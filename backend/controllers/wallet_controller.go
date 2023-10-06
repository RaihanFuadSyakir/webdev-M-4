package controllers

import (
	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type WalletController struct {
	DB *gorm.DB
}

func NewWalletController(db *gorm.DB) *WalletController {
	return &WalletController{DB: db}
}

func jsonResponse(c *fiber.Ctx, status int, msg string, data interface{}) error {
	response := Response{
		OK:     status >= 200 && status < 300,
		Status: status,
		Msg:    msg,
		Data:   data,
	}
	return c.Status(status).JSON(response)
}

func (wc *WalletController) CreateWallet(c *fiber.Ctx) error {

	var wallet models.Wallet
	if err := c.BodyParser(&wallet); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Bad Request", nil)
	}

	// You might want to authenticate the user here and set the UserID accordingly.
	// wallet.UserID = authenticatedUserID

	if err := wc.DB.Create(&wallet).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return jsonResponse(c, fiber.StatusCreated, "Wallet created successfully", wallet)
}

func (wc *WalletController) GetWallet(c *fiber.Ctx) error {
	var wallet models.Wallet
	walletID := c.Params("id")

	if err := wc.DB.Preload("Outcomes").Preload("Incomes").First(&wallet, walletID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Wallet not found", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "OK", wallet)
}

func (wc *WalletController) UpdateWallet(c *fiber.Ctx) error {
	var wallet models.Wallet
	walletID := c.Params("id")

	if err := wc.DB.First(&wallet, walletID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Wallet not found", nil)
	}

	if err := c.BodyParser(&wallet); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, err.Error(), nil)
	}

	if err := wc.DB.Save(&wallet).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "Wallet updated successfully", wallet)

}

func (wc *WalletController) DeleteWallet(c *fiber.Ctx) error {
	var wallet models.Wallet
	walletID := c.Params("id")

	if err := wc.DB.First(&wallet, walletID).Error; err != nil {
		return jsonResponse(c, fiber.StatusNotFound, "Wallet not found", nil)
	}

	if err := wc.DB.Delete(&wallet).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", nil)
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (controller *WalletController) GetWalletByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	user := new(models.User)

	if err := controller.DB.Preload("Wallets").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Wallets not found for the user", nil)
		}
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Wallets retrieved successfully", user.Wallets)
}