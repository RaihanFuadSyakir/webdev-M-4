package controllers

import (
	"fmt"
	"time"

	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type BudgetController struct {
	DB *gorm.DB
}

func NewBudgetController(db *gorm.DB) *BudgetController {
	return &BudgetController{DB: db}
}

// CreateBudget handles the creation of a new budget.
func (controller *BudgetController) CreateBudget(c *fiber.Ctx) error {
	var budget models.Budget
	if err := c.BodyParser(&budget); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Bad Request", nil)
	}

	// Check if month and year are in a valid range
	if !isValidMonth(budget.Month) || !isValidYear(budget.Year) {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid Month or Year", nil)
	}

	userID := c.Locals("userID")
	budget.UserID = userID.(uint)
	budget.CurrentBudget = budget.TotalBudget

	if err := controller.DB.Create(&budget).Error; err != nil {
		fmt.Println(err)
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	if err := controller.DB.Preload("Category").Find(&budget, budget.ID).Error; err != nil {
		return err
	}

	return jsonResponse(c, fiber.StatusCreated, "Budget created successfully", budget)
}

// isValidMonth checks if the given month is in a valid range (1 to 12).
func isValidMonth(month uint) bool {
	return month >= 1 && month <= 12
}

// isValidYear checks if the given year is in a valid range (not too far in the past or future).
func isValidYear(year uint) bool {
    // Set a reasonable range for the years (e.g., 5 years in the past and 10 years in the future).
    currentYear := uint(time.Now().Year())
    minValidYear := currentYear - 10
    maxValidYear := currentYear + 10

    return year >= minValidYear && year <= maxValidYear
}




// GetOutcomeByUserID retrieves outcomes for a user by their UserID.
func (controller *BudgetController) GetBudgetsByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID") // Assuming "user_id" is the parameter name
	user := new(models.User)

	if err := controller.DB.Preload("Budgets").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Budget not found", nil)
		}
		return err
	}
	for i := range user.Budgets {
		if err := controller.DB.Preload("Category").Find(&user.Budgets[i]).Error; err != nil {
			return err
		}
	}
	return jsonResponse(c, fiber.StatusOK, "OK", user.Budgets)
}

// GetBudgetByID retrieves an budget by its ID.
func (controller *BudgetController) GetBudgetByID(c *fiber.Ctx) error {
	var budget models.Budget
	budgetID := c.Params("id")

	if err := controller.DB.Where("id = ?", budgetID).First(&budget).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Budget not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", budget)
}

// UpdateBudget updates an existing budget.
func (controller *BudgetController) UpdateBudget(c *fiber.Ctx) error {
	var updatedBudget models.Budget
	budgetID := c.Params("id")

	if err := c.BodyParser(&updatedBudget); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, err.Error(), nil)
	}

	var budget models.Budget
	if err := controller.DB.Where("id = ?", budgetID).First(&budget).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Budget not found", nil)
	}

	// Update the budget in the database
	controller.DB.Model(&budget).Updates(&updatedBudget)

	return jsonResponse(c, fiber.StatusOK, "Budget updated successfully", budget)
}

// DeleteBudget deletes an existing budget.
func (controller *BudgetController) DeleteBudget(c *fiber.Ctx) error {
	budgetID := c.Params("id")

	var budget models.Budget
	if err := controller.DB.Where("id = ?", budgetID).First(&budget).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Budget not found", nil)
	}

	// Delete the budget from the database
	controller.DB.Delete(&budget)

	return c.SendStatus(fiber.StatusNoContent)
}
