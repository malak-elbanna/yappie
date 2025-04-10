package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

	filter := make(map[string]interface{})

	if title := c.Query("title"); title != "" {
		filter["title"] = map[string]interface{}{"$regex": title, "$options": "i"}
	}

	if author := c.Query("author"); author != "" {
		filter["author"] = map[string]interface{}{"$regex": author, "$options": "i"}
	}

	if language := c.Query("language"); language != "" {
		filter["language"] = language
	}

	if category := c.Query("category"); category != "" {
		filter["category"] = map[string]interface{}{"$regex": category, "$options": "i"}
	}

	cursor, err := bookCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching books"})
		return
	}

	var books []models.Book
	if err := cursor.All(ctx, &books); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding books into model.Book"})
		return
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
