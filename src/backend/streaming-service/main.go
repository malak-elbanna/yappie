package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/routes"
)

func main() {
	router := gin.Default()

	router.Use(cors.Default())

	client := config.ConnectDB()
	defer client.Disconnect(nil)

	bookCollection := config.GetCollection(client, "books")
	controllers.InitBookController(bookCollection)

	routes.BookRoutes(router)
	routes.PlaybackRoutes(router)

	config.InitRedis()

	router.Run(":8080")
}
