package controllers

import (
	"fmt"
	"time"

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

func (oc *OutcomeController) isBalanceSufficient(walletID uint, totalOutcome float64) (bool, error) {
	var wallet models.Wallet
	if err := oc.DB.First(&wallet, walletID).Error; err != nil {
		return false, err
	}

	return wallet.TotalBalance >= totalOutcome, nil
}

func (oc *OutcomeController) CreateOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	if err := c.BodyParser(&outcome); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Bad Request", nil)
	}

	userID := c.Locals("userID")
	outcome.UserID = userID.(uint)

	// Check if the outcome exceeds the total balance in the selected wallet
	wallet, err := oc.getWalletByID(outcome.WalletID)
	if err != nil {
		fmt.Println("Error getting wallet:", err)
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	if outcome.TotalOutcome > wallet.TotalBalance {
		return jsonResponse(c, fiber.StatusBadRequest, "Outcome exceeds total balance in the selected wallet", nil)
	}

	if err := oc.DB.Create(&outcome).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	fmt.Println("Outcome created successfully")

	// Preload the Category and Wallet associations before returning the outcome

	if err := oc.DB.Preload("Category").Preload("Wallet").First(&outcome, outcome.ID).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	// Call the function to calculate and update CurrentBudget
	if err := oc.calculateAndUpdateBudgetCurrentBudget(outcome.CategoryID, outcome.Date); err != nil {
		fmt.Println("Error updating CurrentBudget:", err)
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}


	return jsonResponse(c, fiber.StatusCreated, "Outcome created successfully", outcome)
}

// getWalletByID retrieves a wallet by ID.
func (oc *OutcomeController) getWalletByID(walletID uint) (models.Wallet, error) {
	var wallet models.Wallet
	if err := oc.DB.First(&wallet, walletID).Error; err != nil {
		return wallet, err
	}
	return wallet, nil
}


// GetOutcome retrieves a single outcome by its ID.
func (oc *OutcomeController) GetOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	outcomeID := c.Params("id")

	if err := oc.DB.First(&outcome, outcomeID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Outcome not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", outcome)
}

// GetOutcomeByUserID retrieves outcomes for a user by their UserID.
func (oc *OutcomeController) GetOutcomeByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID") // Assuming "user_id" is the parameter name
	user := new(models.User)

	if err := oc.DB.Preload("Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Outcome not found", nil)
		}
		return err
	}
	// Loop through each Outcome and preload related Category and Wallet data
	for i := range user.Outcomes {
		if err := oc.DB.Preload("Category").Preload("Wallet").Find(&user.Outcomes[i]).Error; err != nil {
			return err
		}
	}
	return jsonResponse(c, fiber.StatusOK, "OK", user.Outcomes)
}

// DeleteOutcome deletes an existing outcome by its ID.
func (oc *OutcomeController) DeleteOutcome(c *fiber.Ctx) error {
	var outcome models.Outcome
	outcomeID := c.Params("id")

	if err := oc.DB.First(&outcome, outcomeID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Outcome not found", nil)
	}

	// Backup the categoryID and date before deletion
	categoryID := outcome.CategoryID
	date := outcome.Date

	if err := oc.DB.Delete(&outcome).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	// Update CurrentBudget for the deleted outcome
	if err := oc.calculateAndUpdateBudgetCurrentBudget(categoryID, date); err != nil {
		fmt.Println("Error updating CurrentBudget:", err)
		// Handle error if needed
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// Function to calculate and update CurrentBudget in Budget model
func (oc *OutcomeController) calculateAndUpdateBudgetCurrentBudget(categoryID uint, date time.Time) error {
	// Find the budget for the same category, month, and year
	var budget models.Budget
	if err := oc.DB.
		Where("category_id = ? AND month = ? AND year = ?", categoryID, date.Month(), date.Year()).
		First(&budget).Error; err != nil {
		return err
	}

	// Calculate TotalOutcome for the same month and category
	var totalOutcomeResult struct {
		TotalOutcome float64
	}
	if err := oc.DB.Raw("SELECT SUM(total_outcome) as total_outcome FROM outcomes WHERE category_id = ? AND EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?", categoryID, date.Month(), date.Year()).Scan(&totalOutcomeResult).Error; err != nil {
		return err
	}

	totalOutcome := totalOutcomeResult.TotalOutcome

	// Calculate CurrentBudget
	currentBudget := budget.TotalBudget - totalOutcome

	// Update CurrentBudget in the database
	if err := oc.DB.Model(&models.Budget{}).Where("id = ?", budget.ID).Update("current_budget", currentBudget).Error; err != nil {
		return err
	}

	return nil
}
