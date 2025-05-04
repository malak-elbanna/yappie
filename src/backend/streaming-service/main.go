package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/malak-elbanna/streaming-service/config"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/routes"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.AllowAll())
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "UP",
		})
	})

	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	client := config.ConnectDB()
	defer client.Disconnect(nil)

	bookCollection := config.GetCollection(client, "books")
	controllers.InitBookController(bookCollection)

	routes.BookRoutes(router)
	routes.PlaybackRoutes(router)
	routes.DownloadRoutes(router)
	routes.StreamRoutes(router)

	config.InitRedis()

	router.Run(":" + os.Getenv("PORT"))
}
