package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/routes"
)

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"}, // Add Authorization
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	client := config.ConnectDB()
	defer client.Disconnect(nil)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	bookCollection := config.GetCollection(client, "books")
	controllers.InitBookController(bookCollection)

	routes.BookRoutes(router)
	routes.PlaybackRoutes(router)
	routes.DownloadRoutes(router)

	config.InitRedis()

	router.Run(":8080")
}
