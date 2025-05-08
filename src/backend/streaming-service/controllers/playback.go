package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/redis/go-redis/v9"
)

func SavePlaybackPosition(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userId := c.Param("userId")
	bookId := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	var payload struct {
		Position float64 `json:"position"`
	}

	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	key := "playback:" + userId + ":" + bookId + ":" + chapterIndex

	err := config.RedisClient.Set(ctx, key, payload.Position, 0).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving playback position"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Playback position saved successfully"})
}

func GetPlaybackPosition(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userId := c.Param("userId")
	bookId := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	key := "playback:" + userId + ":" + bookId + ":" + chapterIndex

	playbackPosition, err := config.RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		c.JSON(http.StatusOK, gin.H{"position": 0})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving playback position"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"playback_position": playbackPosition})
}
