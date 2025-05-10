package controllers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/malak-elbanna/streaming-service/config"
)

var clientConnections = make(map[string]map[*websocket.Conn]bool)
var broadcasterIDs = make(map[string]string)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleLiveAudio(c *gin.Context) {
	log := config.Logger

	roomID := c.Param("roomId")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "roomId is required"})
		return
	}

	userID := c.Query("userId")
	role := c.Query("role")
	if userID == "" || role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId and role are required"})
		return
	}

	log.WithFields(map[string]interface{}{
		"userId": userID,
		"roomId": roomID,
		"role":   role,
	}).Info("Handling live audio for ")

	if role == "broadcaster" {
		if existingBroadcaster, exists := broadcasterIDs[roomID]; exists && existingBroadcaster != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "A broadcaster already exists for this room"})
			return
		}
		broadcasterIDs[roomID] = userID
	} else {
		if broadcasterIDs[roomID] == userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Broadcaster cannot join as listener"})
			return
		}
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.WithError(err).Error("WebSocket upgrade failed")
		return
	}
	defer conn.Close()

	if _, ok := clientConnections[roomID]; !ok {
		clientConnections[roomID] = make(map[*websocket.Conn]bool)
	}

	clientConnections[roomID][conn] = true

	err = config.RedisClient.SAdd(context.Background(), "active_rooms", roomID).Err()
	if err != nil {
		log.Println("Failed to add room to Redis:", err)
	}

	log.WithField("roomId", roomID).Info("Client connected to room")

	defer func() {
		delete(clientConnections[roomID], conn)
		if len(clientConnections[roomID]) == 0 {
			delete(clientConnections, roomID)

			err := config.RedisClient.SRem(context.Background(), "active_rooms", roomID).Err()
			if err != nil {
				log.WithError(err).Error("Failed to remove room from Redis")
			}
		}
		log.WithField("roomId", roomID).Info("Client disconnected from room")

		if len(clientConnections[roomID]) == 0 {
			delete(broadcasterIDs, roomID)
		}
	}()

	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.WithError(err).Error("Error reading message from client")
			break
		}

		for client := range clientConnections[roomID] {
			if client != conn {
				err := client.WriteMessage(messageType, data)
				if err != nil {
					log.WithError(err).Error("Error writing message to client")
					client.Close()
					delete(clientConnections[roomID], client)
				}
			}
		}
	}
}

func GetActiveStreams(c *gin.Context) {
	log := config.Logger
	log.Info("GetActiveStreams request received")

	roomIDs, err := config.RedisClient.SMembers(context.Background(), "active_rooms").Result()
	if err != nil {
		log.WithError(err).Error("Failed to retrieve active rooms from Redis")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch active streams"})
		return
	}

	type RoomInfo struct {
		ParticipantCount int    `json:"participantCount"`
		BroadcasterID    string `json:"broadcasterId"`
	}

	activeRooms := make(map[string]RoomInfo)
	for _, roomID := range roomIDs {
		count := len(clientConnections[roomID])
		if count > 0 {
			broadcasterID := broadcasterIDs[roomID]
			activeRooms[roomID] = RoomInfo{
				ParticipantCount: count,
				BroadcasterID:    broadcasterID,
			}
		}
	}

	log.WithField("active_rooms", activeRooms).Info("Active rooms retrieved")
	c.JSON(http.StatusOK, gin.H{"rooms": activeRooms})
}
