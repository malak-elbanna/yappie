// controllers/stream.go
package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)

func HandleLiveAudio(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	clients[conn] = true
	defer delete(clients, conn)

	for {
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading from client:", err)
			break
		}

		for client := range clients {
			if client != conn {
				err := client.WriteMessage(messageType, data)
				if err != nil {
					log.Println("Error broadcasting:", err)
					client.Close()
					delete(clients, client)
				}
			}
		}
	}
}
