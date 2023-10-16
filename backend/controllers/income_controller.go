package controllers

import (
	"fmt"

	"time"

	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type IncomeController struct {
	DB *gorm.DB
}

func NewIncomeController(db *gorm.DB) *IncomeController {
	return &IncomeController{DB: db}
}

// CreateIncome handles the creation of a new income.
func (controller *IncomeController) CreateIncome(c *fiber.Ctx) error {
	var income models.Income
	if err := c.BodyParser(&income); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Bad Request", nil)
	}
	userID := c.Locals("userID")
	income.UserID = userID.(uint)
	// Save the income to the database using GORM
	if err := controller.DB.Create(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, err.Error(), nil)
	}
	fmt.Println("Income created successfully")
	return jsonResponse(c, fiber.StatusCreated, "Income created successfully", income)
}

// GetIncomeByID retrieves an income by its ID.
func (controller *IncomeController) GetIncomeByID(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found by ID", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", income)
}

// GetIncomeByID retrieves an income by its date.
func (controller *IncomeController) GetIncomeByDate(c *fiber.Ctx) error {
	// Get the date parameter from the request
	dateParam := c.Params("date")

	// Parse the date parameter to a time.Time object
	date, err := time.Parse("2006-01-02", dateParam)
	if err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid date format", nil)
	}

	// Get incomes for the given date
	var incomes []models.Income
	if err := controller.DB.Where("date = ?", date).Find(&incomes).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Error getting incomes", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", incomes)
}

// UpdateIncome updates an existing income.
func (controller *IncomeController) UpdateIncome(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var updatedIncome models.Income
	if err := c.BodyParser(&updatedIncome); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, err.Error(), nil)
	}

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found with Update", nil)
	}

	// Update the income in the database
	controller.DB.Model(&income).Updates(&updatedIncome)

	return jsonResponse(c, fiber.StatusOK, "Income updated successfully", income)
}

// DeleteIncome deletes an existing income.
func (controller *IncomeController) DeleteIncome(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found with Delete", nil)
	}

	// Delete the income from the database
	controller.DB.Delete(&income)

	return c.SendStatus(fiber.StatusNoContent)
}

// GetIncomeByUserID retrieves inomes for a user by their UserID.
func (oc *IncomeController) GetIncomeByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID") // Assuming "user_id" is the parameter name
	user := new(models.User)

	if err := oc.DB.Preload("Incomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Income not found by UserID", nil)
		}
		return err
	}
	// Loop through each Outcome and preload related Category and Wallet data
	for i := range user.Incomes {
		if err := oc.DB.Preload("Wallet").Find(&user.Incomes[i]).Error; err != nil {
			return jsonResponse(c, fiber.StatusNotFound, "Wallet Error", nil)
		}
	}
	return jsonResponse(c, fiber.StatusOK, "OK", user.Incomes)

}
