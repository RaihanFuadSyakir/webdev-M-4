package controllers

import (
	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ReportController struct {
	DB *gorm.DB
}

func NewReportController(db *gorm.DB) *ReportController {
	return &ReportController{DB: db}
}

// GetReportByUserID retrieves a report based on the user's ID
func (c *ReportController) GetReportByUserID(ctx *fiber.Ctx) error {
	userID := ctx.Params("userID") // Assuming you have a route parameter for the user ID

	var report models.Report
	if err := c.DB.Where("user_id = ?", userID).First(&report).Error; err != nil {
		return err
	}

	return ctx.JSON(report)
}

// GetReportsByUserID retrieves up to 5 latest reports based on the user's ID
func (cr *ReportController) GetReportsByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	user := new(models.User)
	if err := cr.DB.Preload("Reports").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Reports not found for the user", nil)
		}
		return err
	}
	return jsonResponse(c, fiber.StatusOK, "Reports retrieved successfully", user.Reports)
}
