package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/malak-elbanna/streaming-service/controllers"
)

func BookRoutes(router *gin.Engine) {
	books := router.Group("/books")
	{
		books.GET("/", controllers.GetAllBooks)
		books.GET("/:id", controllers.GetBookByID)
	}
}

func PlaybackRoutes(router *gin.Engine) {
	playback := router.Group("/playback")
	{
		playback.POST("/:userId/:bookId/:chapterIndex", controllers.SavePlaybackPosition)
		playback.GET("/:userId/:bookId/:chapterIndex", controllers.GetPlaybackPosition)
	}
}
