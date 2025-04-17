package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/routes"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	router := gin.Default()

	client := config.ConnectDB()
	defer client.Disconnect(nil)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	bookCollection := config.GetCollection(client, "books")
	controllers.InitBookController(bookCollection)

	router.Use(cors.Default())
	routes.BookRoutes(router)
	routes.PlaybackRoutes(router)
	routes.DownloadRoutes(router)
	routes.StreamRoutes(router)

	config.InitRedis()

	router.Run(":8080")
}
