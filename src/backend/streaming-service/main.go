package main

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/routes"
)

func main() {
	router := gin.Default()
	client := config.ConnectDB()
	defer client.Disconnect(nil)

	bookCollection := config.GetCollection(client, "books")
	controllers.InitBookController(bookCollection)

	routes.BookRoutes(router)

	config.InitRedis()

	router.Run(":8080")
}
