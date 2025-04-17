package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
)

func DownloadRoutes(router *gin.Engine) {
	download := router.Group("/download")
	{
		download.GET("/:bookId/:chapterIndex", controllers.DownloadChapter)
	}
}
