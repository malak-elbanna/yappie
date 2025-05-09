package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var bookCollection *mongo.Collection

func InitBookController(collection *mongo.Collection) {
	bookCollection = collection
}

func GetAllBooks(c *gin.Context) {
	log := config.Logger

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Info("GetAllBooks request received")

	filter := make(map[string]interface{})
	queryParams := c.Request.URL.Query()

	for key, values := range queryParams {
		if len(values) > 0 && values[0] != "" {
			switch key {
			case "title", "author", "category":
				filter[key] = bson.M{"$regex": values[0], "$options": "i"}
			default:
				filter[key] = values[0]
			}
		}
	}

	log.Info("Checking Redis")
	cachingKey := "books:" + url.QueryEscape(c.Request.URL.RawQuery)

	cachedBooks, err := config.RedisClient.Get(ctx, cachingKey).Result()
	if err == nil {
		log.Info("Cache hit for key:", cachingKey)
		var books []models.Book
		if err := json.Unmarshal([]byte(cachedBooks), &books); err == nil {
			c.JSON(http.StatusOK, books)
			return
		}
	}

	log.Warn("Cache miss for key:", cachingKey)

	log.Info("Querying MongoDB with filter:", filter)
	cursor, err := bookCollection.Find(ctx, filter)
	if err != nil {
		log.WithError(err).Error("MongoDB Find error")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching books"})
		return
	}

	log.Info("Books retrieved from MongoDB")
	var books []models.Book
	if err := cursor.All(ctx, &books); err != nil {
		log.WithError(err).Error("MongoDB cursor.All error")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding books"})
		return
	}

	bytes, err := json.Marshal(books)
	if err != nil {
		log.WithError(err).Error("Error marshalling books to JSON")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing books"})
		return
	}

	log.Info("Setting cache in Redis")
	err = config.RedisClient.Set(ctx, cachingKey, bytes, time.Hour).Err()
	if err != nil {
		log.WithError(err).Error("Error setting cache in Redis")
	}

	log.Info("Returning books to client")
	c.JSON(http.StatusOK, books)
}

func GetBookByID(c *gin.Context) {
	log := config.Logger
	log.Info("GetBookByID request received")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	bookID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(bookID)
	if err != nil {
		log.WithError(err).Error("Invalid book ID")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var book models.Book
	err = bookCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&book)
	if err != nil {
		log.WithError(err).Error("Book not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	log.Info("Book found:", book.Title)
	c.JSON(http.StatusOK, book)
}
