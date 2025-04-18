package controllers

import (
	"context"
	"encoding/json"
	"log"
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
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Println("GetAllBooks request")

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

	log.Println("check redis")
	cachingKey := "books:" + url.QueryEscape(c.Request.URL.RawQuery)

	cachedBooks, err := config.RedisClient.Get(ctx, cachingKey).Result()
	if err == nil {
		var books []models.Book
		if err := json.Unmarshal([]byte(cachedBooks), &books); err == nil {
			c.JSON(http.StatusOK, books)
			return
		}
	}

	log.Println("cache miss")
	cursor, err := bookCollection.Find(ctx, filter)
	if err != nil {
		log.Printf("MongoDB Find error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching books"})
		return
	}

	log.Println("mongo results")
	var books []models.Book
	if err := cursor.All(ctx, &books); err != nil {
		log.Printf("MongoDB cursor.All error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding books"})
		return
	}

	log.Println("books retrieved")

	bytes, err := json.Marshal(books)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing books"})
		return
	}

	err = config.RedisClient.Set(ctx, cachingKey, bytes, time.Hour).Err()
	if err != nil {
		log.Printf("Error setting cache in Redis: %v", err)
	}

	c.JSON(http.StatusOK, books)
}

func GetBookByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	bookID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(bookID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var book models.Book
	err = bookCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&book)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}
