package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/middleware"
)

func BookRoutes(router *gin.Engine) {
	books := router.Group("/books")
	books.Use(middleware.JWTAuthMiddleware())
	{
		books.GET("/", controllers.GetAllBooks)
		books.GET("/:id", controllers.GetBookByID)
	}
}
