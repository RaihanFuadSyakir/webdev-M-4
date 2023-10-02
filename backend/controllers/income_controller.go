package controllers

import (
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

	// Save the income to the database using GORM
	controller.DB.Create(&income)

	return jsonResponse(c, fiber.StatusCreated, "Income created successfully", income)
}

// CreateOutcome handles the creation of a new outcome.
// func (controller *IncomeController) CreateOutcome(c *fiber.Ctx) error {
// 	var outcome models.Outcome
// 	if err := c.BodyParser(&outcome); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	// Save the outcome to the database using GORM
// 	controller.DB.Create(&outcome)

// 	return c.Status(fiber.StatusCreated).JSON(outcome)
// }

// // CreateWallet handles the creation of a new wallet.
// func (controller *IncomeController) CreateWallet(c *fiber.Ctx) error {
// 	var wallet models.Wallet
// 	if err := c.BodyParser(&wallet); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 	}

// 	// Save the wallet to the database using GORM
// 	controller.DB.Create(&wallet)

// 	return c.Status(fiber.StatusCreated).JSON(wallet)
// }

// GetIncomeByID retrieves an income by its ID.
func (controller *IncomeController) GetIncomeByID(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", income)
}

// GetOutcomeByID retrieves an outcome by its ID.
// func (controller *IncomeController) GetOutcomeByID(c *fiber.Ctx) error {
// 	outcomeID := c.Params("id")

// 	var outcome models.Outcome
// 	if err := controller.DB.Where("id = ?", outcomeID).First(&outcome).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Outcome not found"})
// 	}

// 	return c.Status(fiber.StatusOK).JSON(outcome)
// }

// // GetWalletByID retrieves a wallet by its ID.
// func (controller *IncomeController) GetWalletByID(c *fiber.Ctx) error {
// 	walletID := c.Params("id")

// 	var wallet models.Wallet
// 	if err := controller.DB.Where("id = ?", walletID).First(&wallet).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
// 	}

// 	return c.Status(fiber.StatusOK).JSON(wallet)
// }

// UpdateIncome updates an existing income.
func (controller *IncomeController) UpdateIncome(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var updatedIncome models.Income
	if err := c.BodyParser(&updatedIncome); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, err.Error(), nil)
	}

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found", nil)
	}

	// Update the income in the database
	controller.DB.Model(&income).Updates(&updatedIncome)

	return jsonResponse(c, fiber.StatusOK, "Income updated successfully", income)
}

// UpdateOutcome updates an existing outcome.
// func (controller *IncomeController) UpdateOutcome(c *fiber.Ctx) error {
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
// func (controller *IncomeController) UpdateWallet(c *fiber.Ctx) error {
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

// DeleteIncome deletes an existing income.
func (controller *IncomeController) DeleteIncome(c *fiber.Ctx) error {
	incomeID := c.Params("id")

	var income models.Income
	if err := controller.DB.Where("id = ?", incomeID).First(&income).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Income not found", nil)
	}

	// Delete the income from the database
	controller.DB.Delete(&income)

	return c.SendStatus(fiber.StatusNoContent)
}

// DeleteOutcome deletes an existing outcome.
// func (controller *IncomeController) DeleteOutcome(c *fiber.Ctx) error {
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
// func (controller *IncomeController) DeleteWallet(c *fiber.Ctx) error {
// 	walletID := c.Params("id")

// 	var wallet models.Wallet
// 	if err := controller.DB.Where("id = ?", walletID).First(&wallet).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
// 	}

// 	// Delete the wallet from the database
// 	controller.DB.Delete(&wallet)

// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Wallet deleted successfully"})
// }
