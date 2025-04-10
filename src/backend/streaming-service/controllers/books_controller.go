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
