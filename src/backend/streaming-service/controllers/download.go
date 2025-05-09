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

	log.Infof("Download request received for bookId: %s, chapterIndex: %s", bookID, chapterIndex)

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

	filename := fmt.Sprintf("%s - %s.mp3", book.Title, chapter.Title)

	c.Header("Content-Disposition", "attachment; filename=\""+filename+"\"")
	c.Header("Content-Type", "audio/mpeg")
	c.Header("Content-Length", resp.Header.Get("Content-Length"))

	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		log.WithError(err).Error("Failed to stream file")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream file"})
	}

	log.Infof("Download completed for bookId: %s, chapterIndex: %s", bookID, chapterIndex)
}
