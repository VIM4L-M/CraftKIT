package app

import (
	"fmt"

	"backend/internal/database"
	"backend/internal/routes"
	"github.com/gin-gonic/gin"
)

type App struct {
	Engine *gin.Engine
}

func New() (*App, error) {
	if _, err := database.Connect(); err != nil {
		return nil, err
	}

	engine := gin.Default()
	routes.Register(engine)

	return &App{Engine: engine}, nil
}

func (a *App) Run() error {
	if err := a.Engine.Run(":8080"); err != nil {
		return fmt.Errorf("run server: %w", err)
	}

	return nil
}
