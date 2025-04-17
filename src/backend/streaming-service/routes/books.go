package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/middleware"
	cors "github.com/rs/cors/wrapper/gin"
)

func BookRoutes(router *gin.Engine) {
	books := router.Group("/books")
	books.Use(middleware.JWTAuthMiddleware(), cors.Default())
	{
		books.GET("/", controllers.GetAllBooks)
		books.GET("/:id", controllers.GetBookByID)
	}
}
