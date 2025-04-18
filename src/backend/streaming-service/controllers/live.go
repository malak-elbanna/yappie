package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var rooms = make(map[string]map[*websocket.Conn]bool)

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

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	if _, ok := rooms[roomID]; !ok {
		rooms[roomID] = make(map[*websocket.Conn]bool)
	}

	rooms[roomID][conn] = true
	log.Printf("Client joined room: %s", roomID)

	defer func() {
		delete(rooms[roomID], conn)
		if len(rooms[roomID]) == 0 {
			delete(rooms, roomID)
		}
		log.Printf("Client left room: %s", roomID)
	}()

	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading from client:", err)
			break
		}

		if messageType == websocket.TextMessage {
			for client := range rooms[roomID] {
				if client != conn {
					err := client.WriteMessage(websocket.TextMessage, data)
					if err != nil {
						log.Println("Error broadcasting emoji:", err)
						client.Close()
						delete(rooms[roomID], client)
					}
				}
			}
			continue
		}

		for client := range rooms[roomID] {
			if client != conn {
				err := client.WriteMessage(messageType, data)
				if err != nil {
					log.Println("Error broadcasting audio:", err)
					client.Close()
					delete(rooms[roomID], client)
				}
			}
		}
	}
}

func GetActiveStreams(c *gin.Context) {
	activeRooms := make(map[string]int)
	for roomID, clients := range rooms {
		if len(clients) > 0 {
			activeRooms[roomID] = len(clients)
		}
	}

	c.JSON(http.StatusOK, gin.H{"rooms": activeRooms})
}
