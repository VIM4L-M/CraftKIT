package app

import (
	"fmt"

	"backend/internal/routes"
	"github.com/gofiber/fiber/v2"
)

type App struct {
	Engine *fiber.App
}

func New() *App {
	engine := fiber.New()
	routes.Register(engine)

	return &App{Engine: engine}
}

func (a *App) Run() error {
	if err := a.Engine.Listen(":8080"); err != nil {
		return fmt.Errorf("run server: %w", err)
	}

	return nil
}
