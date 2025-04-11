package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
)

func BookRoutes(router *gin.Engine) {
	books := router.Group("/books")
	{
		books.GET("/", controllers.GetAllBooks)
	}
}
