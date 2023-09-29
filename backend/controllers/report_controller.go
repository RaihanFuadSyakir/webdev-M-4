package controllers

import (
	"strconv"
	"time"

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



func (rc *ReportController) GetOutcomesByDateAndUser(c *fiber.Ctx) error {
    var outcomes []models.Outcome

    startDateStr := c.Query("start_date")
    endDateStr := c.Query("end_date")
    userIDStr := c.Query("user_id")

    startDate, err := time.Parse("2006-01-02", startDateStr)
    if err != nil {
        return jsonResponse(c, fiber.StatusBadRequest, "Invalid start_date format", nil)
    }

    endDate, err := time.Parse("2006-01-02", endDateStr)
    if err != nil {
        return jsonResponse(c, fiber.StatusBadRequest, "Invalid end_date format", nil)
    }

    userID, err := strconv.ParseUint(userIDStr, 10, 64)
    if err != nil {
        return jsonResponse(c, fiber.StatusBadRequest, "Invalid user_id format", nil)
    }

    if err := rc.DB.Where("date BETWEEN ? AND ? AND user_id = ?", startDate, endDate, userID).
        Find(&outcomes).Error; err != nil {
        return jsonResponse(c, fiber.StatusInternalServerError, "Error retrieving outcomes", nil)
    }

    return jsonResponse(c, fiber.StatusOK, "OK", outcomes)
}
