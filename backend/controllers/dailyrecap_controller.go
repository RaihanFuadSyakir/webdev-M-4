package controllers

import (
	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type DailyRecapController struct {
	DB *gorm.DB
}

func NewDailyRecapController(db *gorm.DB) *DailyRecapController {
	return &DailyRecapController{DB: db}
}

func (drc *DailyRecapController) CreateDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	if err := c.BodyParser(&dailyRecap); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// You might want to authenticate the user here and set the UserID accordingly.
	// dailyRecap.UserID = authenticatedUserID

	if err := drc.DB.Create(&dailyRecap).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(dailyRecap)
}

// GetDailyRecap retrieves a single daily recap by its ID.
func (drc *DailyRecapController) GetDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "DailyRecap not found"})
	}

	return c.Status(fiber.StatusOK).JSON(dailyRecap)
}

// UpdateDailyRecap updates an existing daily recap by its ID.
func (drc *DailyRecapController) UpdateDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "DailyRecap not found"})
	}

	if err := c.BodyParser(&dailyRecap); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := drc.DB.Save(&dailyRecap).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(dailyRecap)
}

// DeleteDailyRecap deletes an existing daily recap by its ID.
func (drc *DailyRecapController) DeleteDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "DailyRecap not found"})
	}

	if err := drc.DB.Delete(&dailyRecap).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
