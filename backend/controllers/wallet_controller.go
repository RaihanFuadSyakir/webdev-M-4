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

func (wc *WalletController) CreateWallet(c *fiber.Ctx) error {
    var wallet models.Wallet
    if err := c.BodyParser(&wallet); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // You might want to authenticate the user here and set the UserID accordingly.
    // wallet.UserID = authenticatedUserID

    if err := wc.DB.Create(&wallet).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.Status(fiber.StatusCreated).JSON(wallet)
}

func (wc *WalletController) GetWallet(c *fiber.Ctx) error {
    var wallet models.Wallet
    walletID := c.Params("id")

    if err := wc.DB.Preload("Outcomes").Preload("Incomes").First(&wallet, walletID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
    }

    return c.Status(fiber.StatusOK).JSON(wallet)
}

func (wc *WalletController) UpdateWallet(c *fiber.Ctx) error {
    var wallet models.Wallet
    walletID := c.Params("id")

    if err := wc.DB.First(&wallet, walletID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
    }

    if err := c.BodyParser(&wallet); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    if err := wc.DB.Save(&wallet).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.Status(fiber.StatusOK).JSON(wallet)
}

func (wc *WalletController) DeleteWallet(c *fiber.Ctx) error {
    var wallet models.Wallet
    walletID := c.Params("id")

    if err := wc.DB.First(&wallet, walletID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wallet not found"})
    }

    if err := wc.DB.Delete(&wallet).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.SendStatus(fiber.StatusNoContent)
}
