package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
)

func StreamRoutes(router *gin.Engine) {
	stream := router.Group("/stream")
	{
		stream.GET("/:bookId/:chapterIndex", controllers.StreamChapter)
		stream.GET("/live", controllers.HandleLiveAudio)
	}
}
