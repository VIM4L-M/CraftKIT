package handlers

import "github.com/gofiber/fiber/v2"

type Handler struct{}

func New() *Handler {
	return &Handler{}
}

func (h *Handler) Health(context *fiber.Ctx) error {
	return context.JSON(fiber.Map{
		"status": "ok",
	})
}
