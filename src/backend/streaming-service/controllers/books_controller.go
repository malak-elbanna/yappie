package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/models"
	"go.mongodb.org/mongo-driver/mongo"
)

var bookCollection *mongo.Collection

func InitBookController(collection *mongo.Collection) {
	bookCollection = collection
}

func GetAllBooks(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := bookCollection.Find(ctx, map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching books"})
		return
	}

	var rawBooks []map[string]interface{}
	if err := cursor.All(ctx, &rawBooks); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding raw books"})
		return
	}

	cursor, err = bookCollection.Find(ctx, map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error refetching for decoding"})
		return
	}

	var books []models.Book
	if err := cursor.All(ctx, &books); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding books into model.Book"})
		return
	}

	c.JSON(http.StatusOK, books)
}
