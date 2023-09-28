package controllers

import (
	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type OutcomeController struct {
	DB *gorm.DB
}

func NewOutcomeController(db *gorm.DB) *OutcomeController {
	return &OutcomeController{DB: db}
}

func (oc *OutcomeController) CreateOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	if err := c.BodyParser(&outcome); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// You might want to authenticate the user here and set the UserID accordingly.
	// wallet.UserID = authenticatedUserID

	if err := oc.DB.Create(&outcome).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(outcome)

}

// GetOutcome retrieves a single outcome by its ID.
func (oc *OutcomeController) GetOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	outcomeID := c.Params("id")

	if err := oc.DB.First(&outcome, outcomeID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
	}

	return c.Status(fiber.StatusOK).JSON(outcome)
}

// UpdateOutcome updates an existing outcome by its ID.
func (oc *OutcomeController) UpdateOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	outcomeID := c.Params("id")

	if err := oc.DB.First(&outcome, outcomeID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
	}

	if err := c.BodyParser(&outcome); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := oc.DB.Save(&outcome).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(outcome)
}

// DeleteOutcome deletes an existing outcome by its ID.
func (oc *OutcomeController) DeleteOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	outcomeID := c.Params("id")

	if err := oc.DB.First(&outcome, outcomeID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
	}

	if err := oc.DB.Delete(&outcome).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
