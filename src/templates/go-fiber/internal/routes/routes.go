package routes

import (
	"backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func Register(engine *fiber.App) {
	handler := handlers.New()

	api := engine.Group("/api")
	api.Get("/health", handler.Health)
}
