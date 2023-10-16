package controllers

import (
	"time"

	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CategoryController struct {
	DB *gorm.DB
}

func NewCategoryController(db *gorm.DB) *CategoryController {
	return &CategoryController{DB: db}
}

// CreateCategory creates a new category and associates it with a user.
func (controller *CategoryController) CreateCategory(c *fiber.Ctx) error {
	var requestData struct {
		UserID        uint   `json:"user_id"`
		CategoryName  string `json:"category_name"`
		IsUserDefined bool   `json:"is_user_defined"`
	}
	if err := c.BodyParser(&requestData); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid request data", nil)
	}
	userID := c.Locals("userID")
	requestData.UserID = userID.(uint)
	requestData.IsUserDefined = true
	var user models.User
	if err := controller.DB.Preload("Categories").First(&user, requestData.UserID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to retrieve user data", nil)
	}

	newCategory := models.Category{
		UserID:        requestData.UserID,
		CategoryName:  requestData.CategoryName,
		IsUserDefined: requestData.IsUserDefined,
	}

	if err := controller.DB.Create(&newCategory).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to create category", nil)
	}

	association := controller.DB.Model(&user).Association("Categories")
	if err := association.Append(&newCategory); err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to associate category with user", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "Category created successfully", newCategory)
}

func (controller *CategoryController) DeleteCategory(c *fiber.Ctx) error {
	categoryID := c.Params("id")
	var category models.Category

	// Find the category by ID
	if err := controller.DB.First(&category, categoryID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Category not found", nil)
		}
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to retrieve category data", nil)
	}

	// Delete the category
	if err := controller.DB.Delete(&category).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to delete category", nil)
	}

	return jsonResponse(c, fiber.StatusOK, "Category deleted successfully", nil)
}
func (controller *CategoryController) GetCategoryByUserIDAndDateRange(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid start date format", nil)
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid end date format", nil)
	}

	user := new(models.User)
	if err := controller.DB.Preload("Categories.Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return err
	}

	filteredCategories := []models.Category{}
	for _, category := range user.Categories {
		for _, outcome := range category.Outcomes {
			if outcome.Date.After(startDate) && outcome.Date.Before(endDate) {
				filteredCategories = append(filteredCategories, category)
				break
			}
		}
	}

	return jsonResponse(c, fiber.StatusOK, "Categories retrieved successfully", filteredCategories)
}

func (controller *CategoryController) GetCategoryByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	user := new(models.User)

	if err := controller.DB.Preload("Categories").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Categories not found for the user", nil)
		}
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Categories retrieved successfully", user.Categories)
}

func (controller *CategoryController) GetCategoryByUserIDAndDate(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	dateStr := c.Params("date")

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid date format", nil)
	}

	user := new(models.User)
	if err := controller.DB.Preload("Categories.Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return err
	}

	filteredCategories := []models.Category{}
	for _, category := range user.Categories {
		for _, outcome := range category.Outcomes {
			if outcome.Date.Equal(date) {
				filteredCategories = append(filteredCategories, category)
				break
			}
		}
	}

	return jsonResponse(c, fiber.StatusOK, "Categories retrieved successfully", filteredCategories)
}
func (controller *CategoryController) GetCategoriesOutcomesByUserID(c *fiber.Ctx) error {
	userID := c.Locals("userID")

	user := new(models.User)
	if err := controller.DB.Preload("Categories.Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Categories retrieved successfully", user.Categories)
}
func (controller *CategoryController) GetCategoryByID(c *fiber.Ctx) error {
	id := c.Params("category_id")
	category := new(models.Category)
	if err := controller.DB.First(category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "Category not found", nil)
		}
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Category retrieved successfully", category)
}

func (controller *CategoryController) GetAllCategories(c *fiber.Ctx) error {
	var categories []models.Category

	if err := controller.DB.Find(&categories).Error; err != nil {
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Categories retrieved successfully", categories)
}

func (controller *CategoryController) UpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	category := new(models.Category)

	if err := controller.DB.First(category, id).Error; err != nil {
		return err
	}

	var updateData struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&updateData); err != nil {
		return err
	}

	if updateData.Name != "" {
		category.CategoryName = updateData.Name
	}

	if err := controller.DB.Save(category).Error; err != nil {
		return err
	}

	return jsonResponse(c, fiber.StatusOK, "Category updated successfully", category)
}
