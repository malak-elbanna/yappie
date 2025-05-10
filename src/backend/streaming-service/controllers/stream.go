package controllers

import (
	"context"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func StreamChapter(c *gin.Context) {
	log := config.Logger

	bookID := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	log.WithFields(map[string]interface{}{
		"bookID":       bookID,
		"chapterIndex": chapterIndex,
	}).Info("Streaming request received for ")

	id, err := primitive.ObjectIDFromHex(bookID)
	if err != nil {
		log.WithError(err).Error("Invalid book ID")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var book models.Book
	err = bookCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&book)
	if err != nil {
		log.WithError(err).Error("Book not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	i, err := strconv.Atoi(chapterIndex)
	if err != nil || i < 0 || i >= len(book.Chapters) {
		log.WithError(err).Error("Invalid chapter index")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chapter index"})
		return
	}

	chapter := book.Chapters[i]

	resp, err := http.Get(chapter.MP3URL)
	if err != nil || resp.StatusCode != http.StatusOK {
		log.WithError(err).Error("Failed to fetch audio from source")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audio from source"})
		return
	}
	defer resp.Body.Close()

	c.Header("Content-Type", "audio/mpeg")
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Disposition", "inline")

	rangeHeader := c.GetHeader("Range")
	if rangeHeader != "" {
		req, _ := http.NewRequest("GET", chapter.MP3URL, nil)
		req.Header.Set("Range", rangeHeader)

		rangeResp, err := http.DefaultClient.Do(req)
		if err != nil || rangeResp.StatusCode != http.StatusPartialContent {
			log.WithError(err).Error("Failed to stream range content")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream range content"})
			return
		}
		defer rangeResp.Body.Close()

		c.Status(http.StatusPartialContent)
		c.Header("Content-Range", rangeResp.Header.Get("Content-Range"))
		c.Header("Content-Length", rangeResp.Header.Get("Content-Length"))

		_, err = io.Copy(c.Writer, rangeResp.Body)
		if err != nil {
			log.WithError(err).Error("Error while streaming file")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error during streaming"})
		}
		return
	}

	c.Header("Content-Length", resp.Header.Get("Content-Length"))
	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		log.WithError(err).Error("Error while streaming file")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error while streaming file"})
	}
	log.WithFields(map[string]interface{}{
		"bookID":       bookID,
		"chapterIndex": chapterIndex,
	}).Info("Streaming completed for ")
}
