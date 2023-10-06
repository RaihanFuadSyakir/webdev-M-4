package controllers

import (
	"time"

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
		return jsonResponse(c, fiber.StatusBadRequest, "Bad Request", nil)
	}

	// You might want to authenticate the user here and set the UserID accordingly.
	// dailyRecap.UserID = authenticatedUserID

	if err := drc.DB.Create(&dailyRecap).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return jsonResponse(c, fiber.StatusCreated, "Daily Recap created successfully", dailyRecap)
}

// GetDailyRecap retrieves a single daily recap by its ID.
func (drc *DailyRecapController) GetDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Daily Recap not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", dailyRecap)
}

// GetDailyRecapByUserID retrieves daily recaps for a user by their UserID.
func (drc *DailyRecapController) GetDailyRecapByUserID(c *fiber.Ctx) error {
	userID := c.Params("user_id") // Assuming "user_id" is the parameter name
	user := new(models.User)

	if err := drc.DB.Preload("DailyRecaps").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Daily Recap not found", nil)
		}
		return err
	}
	return jsonResponse(c, fiber.StatusOK, "OK", user.DailyRecaps)
}

// GetDailyRecapByDate retrieves daily recaps for a specific date and time.
func (drc *DailyRecapController) GetDailyRecapByDate(c *fiber.Ctx) error {
	dateStr := c.Params("date") // Assuming "date" is the parameter name in the route

	// Parse the date string into a time.Time object
	date, err := time.Parse(time.RFC3339, dateStr)
	if err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid date format", nil)
	}

	var dailyRecaps []models.DailyRecap

	if err := drc.DB.Where("date = ?", date).Find(&dailyRecaps).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Daily Recap not found for this date", nil)
		}
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "OK", dailyRecaps)
}

// func (controller *DailyRecapController) GetDailyRecapByUserID(c *fiber.Ctx) error {
// 	userID := c.Params("user_id") // Assuming "user_id" is the parameter name
// 	user := new(models.User)

// 	if err := controller.DB.Preload("DailyRecaps").Find(user, userID).Error; err != nil {
// 		if err == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
// 				"error": "Categories not found for the user",
// 			})
// 		}
// 		return err
// 	}
// 	return c.JSON(user.DailyRecaps)
// }

// func (drc *DailyRecapController) GetDailyRecapByDate(c *fiber.Ctx) error {
// 	date := c.Params("date")
// 	dailyrecap := new(models.DailyRecap)
// 	if err := drc.DB.First(dailyrecap, date).Error; err != nil {
// 		if err == gorm.ErrRecordNotFound {
// 			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
// 				"error": "Category not found",
// 			})
// 		}
// 		return err
// 	}
// 	return c.JSON(dailyrecap)
// }

// UpdateDailyRecap updates an existing daily recap by its ID.
func (drc *DailyRecapController) UpdateDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Daily Recap not found", nil)
	}

	if err := c.BodyParser(&dailyRecap); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, err.Error(), nil)
	}

	if err := drc.DB.Save(&dailyRecap).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "Daily Recap updated successfully", dailyRecap)
}

// DeleteDailyRecap deletes an existing daily recap by its ID.
func (drc *DailyRecapController) DeleteDailyRecap(c *fiber.Ctx) error {
	var dailyRecap models.DailyRecap
	dailyRecapID := c.Params("id")

	if err := drc.DB.First(&dailyRecap, dailyRecapID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Daily Recap not found", nil)
	}

	if err := drc.DB.Delete(&dailyRecap).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
