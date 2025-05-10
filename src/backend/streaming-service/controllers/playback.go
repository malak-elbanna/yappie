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
	log := config.Logger
	log.Info("SavePlaybackPosition request received")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userId := c.Param("userId")
	bookId := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	log.Infof("Saving playback position for userId: %s, bookId: %s, chapterIndex: %s", userId, bookId, chapterIndex)

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
		log.WithError(err).Error("Error saving playback position to Redis")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving playback position"})
		return
	}

	log.Infof("Playback position saved successfully for userId: %s, bookId: %s, chapterIndex: %s", userId, bookId, chapterIndex)
	c.JSON(http.StatusOK, gin.H{"message": "Playback position saved successfully"})
}

func GetPlaybackPosition(c *gin.Context) {
	log := config.Logger
	log.Info("GetPlaybackPosition request received")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userId := c.Param("userId")
	bookId := c.Param("bookId")
	chapterIndex := c.Param("chapterIndex")

	key := "playback:" + userId + ":" + bookId + ":" + chapterIndex

	playbackPosition, err := config.RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		log.Warn("No playback position found", "userId", userId, "bookId", bookId, "chapterIndex", chapterIndex)
		c.JSON(http.StatusOK, gin.H{"position": 0})
		return
	} else if err != nil {
		log.WithError(err).Error("Error retrieving playback position from Redis")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving playback position"})
		return
	}

	log.WithFields(map[string]interface{}{
		"userId":       userId,
		"bookId":       bookId,
		"chapterIndex": chapterIndex,
	}).Info("Playback position retrieved successfully for ")
	c.JSON(http.StatusOK, gin.H{"playback_position": playbackPosition})
}
