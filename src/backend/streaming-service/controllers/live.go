package controllers

import (
	"context"
	"log"
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
		log.Println("WebSocket upgrade failed:", err)
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

	log.Printf("Client joined room: %s", roomID)

	defer func() {
		delete(clientConnections[roomID], conn)
		if len(clientConnections[roomID]) == 0 {
			delete(clientConnections, roomID)

			err := config.RedisClient.SRem(context.Background(), "active_rooms", roomID).Err()
			if err != nil {
				log.Println("Failed to remove room from Redis:", err)
			}
		}
		log.Printf("Client left room: %s", roomID)

		if len(clientConnections[roomID]) == 0 {
			delete(broadcasterIDs, roomID)
		}
	}()

	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading from client:", err)
			break
		}

		for client := range clientConnections[roomID] {
			if client != conn {
				err := client.WriteMessage(messageType, data)
				if err != nil {
					log.Println("Error broadcasting message:", err)
					client.Close()
					delete(clientConnections[roomID], client)
				}
			}
		}
	}
}

func GetActiveStreams(c *gin.Context) {
	roomIDs, err := config.RedisClient.SMembers(context.Background(), "active_rooms").Result()
	if err != nil {
		log.Println("Failed to retrieve active rooms:", err)
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

	c.JSON(http.StatusOK, gin.H{"rooms": activeRooms})
}
