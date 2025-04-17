package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/middleware"
)

func DownloadRoutes(router *gin.Engine) {
	download := router.Group("/download")
	download.Use(middleware.JWTAuthMiddleware())
	{
		download.GET("/:bookId/:chapterIndex", controllers.DownloadChapter)
	}
}
