package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
	"github.com/malak-elbanna/streaming-service/middleware"
)

func PlaybackRoutes(router *gin.Engine) {
	playback := router.Group("/playback")
	playback.Use(middleware.JWTAuthMiddleware())
	{
		playback.POST("/:userId/:bookId/:chapterIndex", controllers.SavePlaybackPosition)
		playback.GET("/:userId/:bookId/:chapterIndex", controllers.GetPlaybackPosition)
	}
}
