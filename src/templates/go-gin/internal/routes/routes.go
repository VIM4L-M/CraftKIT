package routes

import (
	"backend/internal/handlers"
	"github.com/gin-gonic/gin"
)

func Register(engine *gin.Engine) {
	handler := handlers.New()

	api := engine.Group("/api")
	{
		api.GET("/health", handler.Health)
	}
}
