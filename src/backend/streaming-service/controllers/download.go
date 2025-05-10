package controllers

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func DownloadChapter(c *gin.Context) {
	log := config.Logger

	bookID := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	log.WithFields(map[string]interface{}{
		"book_id":       bookID,
		"chapter_index": chapterIndex,
	}).Info("Download request received")

	id, err := primitive.ObjectIDFromHex(bookID)
	if err != nil {
		log.WithError(err).WithField("book_id", bookID).Error("Book not found")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var book models.Book
	err = bookCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&book)
	if err != nil {
		log.WithFields(map[string]interface{}{
			"chapter_index": chapterIndex,
			"book_title":    book.Title,
		}).WithError(err).Error("Invalid chapter index")
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
	log.WithFields(map[string]interface{}{
		"book_title":    book.Title,
		"chapter_title": chapter.Title,
		"mp3_url":       chapter.MP3URL,
	}).Info("Fetching chapter audio")

	resp, err := http.Get(chapter.MP3URL)
	if err != nil || resp.StatusCode != http.StatusOK {
		log.WithFields(map[string]interface{}{
			"status_code": resp.StatusCode,
			"mp3_url":     chapter.MP3URL,
		}).WithError(err).Error("Failed to fetch audio from source")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audio from source"})
		return
	}
	defer resp.Body.Close()

	filename := fmt.Sprintf("%s - %s.mp3", book.Title, chapter.Title)

	c.Header("Content-Disposition", "attachment; filename=\""+filename+"\"")
	c.Header("Content-Type", "audio/mpeg")
	c.Header("Content-Length", resp.Header.Get("Content-Length"))

	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		log.WithError(err).Error("Failed to stream file")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream file"})
	}

	log.WithFields(map[string]interface{}{
		"book_id":       bookID,
		"chapter_index": chapterIndex,
		"filename":      filename,
	}).Info("Download completed successfully")
}
