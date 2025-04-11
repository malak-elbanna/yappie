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

	var books []models.Book

	if err := cursor.All(ctx, &books); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding books into model.Book"})

		cursor, _ := bookCollection.Find(context.Background(), map[string]interface{}{})
		var rawBooks []map[string]interface{}
		_ = cursor.All(context.Background(), &rawBooks)

		if len(rawBooks) > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"first_book": rawBooks[0]})
		}
		return
	}

	c.JSON(http.StatusOK, books)
}
