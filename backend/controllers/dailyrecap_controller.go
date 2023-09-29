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

// GetDailyRecapByUserID retrieves daily recaps for a user by their UserID.
func (drc *DailyRecapController) GetDailyRecapByUserID(c *fiber.Ctx) error {
	var dailyRecaps []models.DailyRecap
	userID := c.Params("userID")

	if err := drc.DB.Where("user_id = ?", userID).Find(&dailyRecaps).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "DailyRecaps not found for this user"})
	}

	return c.Status(fiber.StatusOK).JSON(dailyRecaps)
}

// GetDailyRecapByDate retrieves daily recaps for a specific date.
func (drc *DailyRecapController) GetDailyRecapByDate(c *fiber.Ctx) error {
	var dailyRecaps []models.DailyRecap
	date := c.Params("date")

	// Assuming the date is in a specific format, e.g., "2006-01-02"
	if err := drc.DB.Where("date = ?", date).Find(&dailyRecaps).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "DailyRecaps not found for this date"})
	}

	return c.Status(fiber.StatusOK).JSON(dailyRecaps)
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
