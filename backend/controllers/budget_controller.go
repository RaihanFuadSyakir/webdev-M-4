package controllers

import (
	"fmt"

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
	userID := c.Locals("userID")
	budget.UserID = userID.(uint)
	if err := controller.DB.Create(&budget).Error; err != nil {
		fmt.Println(err)
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}
	return jsonResponse(c, fiber.StatusCreated, "Budget created successfully", budget)
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
	return jsonResponse(c, fiber.StatusOK, "OK", user.Budgets)
}

// // CreateOutcome handles the creation of a new outcome.
// func (controller *BudgetController) CreateOutcome(c *fiber.Ctx) error {
// 	var outcome models.Outcome
// 	if err := c.BodyParser(&outcome); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	// Save the outcome to the database using GORM
// 	controller.DB.Create(&outcome)

// 	return c.Status(fiber.StatusCreated).JSON(outcome)
// }

// // CreateWallet handles the creation of a new wallet.
// func (controller *BudgetController) CreateWallet(c *fiber.Ctx) error {
// 	var wallet models.Wallet
// 	if err := c.BodyParser(&wallet); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	// Save the wallet to the database using GORM
// 	controller.DB.Create(&wallet)

// 	return c.Status(fiber.StatusCreated).JSON(wallet)
// }

// GetBudgetByID retrieves an budget by its ID.
func (controller *BudgetController) GetBudgetByID(c *fiber.Ctx) error {
	var budget models.Budget
	budgetID := c.Params("id")

	if err := controller.DB.Where("id = ?", budgetID).First(&budget).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Budget not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", budget)
}

// // GetOutcomeByID retrieves an outcome by its ID.
// func (controller *BudgetController) GetOutcomeByID(c *fiber.Ctx) error {
// 	outcomeID := c.Params("id")

// 	var outcome models.Outcome
// 	if err := controller.DB.Where("id = ?", outcomeID).First(&outcome).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
// 	}

// 	return c.Status(fiber.StatusOK).JSON(outcome)
// }

// // GetWalletByID retrieves a wallet by its ID.
// func (controller *BudgetController) GetWalletByID(c *fiber.Ctx) error {
// 	walletID := c.Params("id")

// 	var wallet models.Wallet
// 	if err := controller.DB.Where("id = ?", walletID).First(&wallet).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
// 	}

// 	return c.Status(fiber.StatusOK).JSON(wallet)
// }

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

// // UpdateOutcome updates an existing outcome.
// func (controller *BudgetController) UpdateOutcome(c *fiber.Ctx) error {
// 	outcomeID := c.Params("id")

// 	var updatedOutcome models.Outcome
// 	if err := c.BodyParser(&updatedOutcome); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	var outcome models.Outcome
// 	if err := controller.DB.Where("id = ?", outcomeID).First(&outcome).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
// 	}

// 	// Update the outcome in the database
// 	controller.DB.Model(&outcome).Updates(&updatedOutcome)

// 	return c.Status(fiber.StatusOK).JSON(outcome)
// }

// // UpdateWallet updates an existing wallet.
// func (controller *BudgetController) UpdateWallet(c *fiber.Ctx) error {
// 	walletID := c.Params("id")

// 	var updatedWallet models.Wallet
// 	if err := c.BodyParser(&updatedWallet); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	var wallet models.Wallet
// 	if err := controller.DB.Where("id = ?", walletID).First(&wallet).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
// 	}

// 	// Update the wallet in the database
// 	controller.DB.Model(&wallet).Updates(&updatedWallet)

// 	return c.Status(fiber.StatusOK).JSON(wallet)
// }

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

// // DeleteOutcome deletes an existing outcome.
// func (controller *BudgetController) DeleteOutcome(c *fiber.Ctx) error {
// 	outcomeID := c.Params("id")

// 	var outcome models.Outcome
// 	if err := controller.DB.Where("id = ?", outcomeID).First(&outcome).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
// 	}

// 	// Delete the outcome from the database
// 	controller.DB.Delete(&outcome)

// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Outcome deleted successfully"})
// }

// // DeleteWallet deletes an existing wallet.
// func (controller *BudgetController) DeleteWallet(c *fiber.Ctx) error {
// 	walletID := c.Params("id")

// 	var wallet models.Wallet
// 	if err := controller.DB.Where("id = ?", walletID).First(&wallet).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
// 	}

// 	// Delete the wallet from the database
// 	controller.DB.Delete(&wallet)

// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Wallet deleted successfully"})
// }
