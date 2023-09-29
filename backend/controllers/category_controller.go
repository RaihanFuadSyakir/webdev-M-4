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
	// Parse the request body to get the data including UserID, new category name, and isUserDefined
	var requestData struct {
		UserID        uint   `json:"user_id"`
		CategoryName  string `json:"category_name"`
		IsUserDefined bool   `json:"is_user_defined"`
	}

	if err := c.BodyParser(&requestData); err != nil {
		return err
	}

	// Check if the provided user ID exists
	var user models.User
	if err := controller.DB.Preload("Categories").First(&user, requestData.UserID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	// Create the new category
	newCategory := models.Category{
		UserID:        requestData.UserID,
		CategoryName:  requestData.CategoryName,
		IsUserDefined: requestData.IsUserDefined,
	}

	if err := controller.DB.Create(&newCategory).Error; err != nil {
		return err
	}

	// Associate the category with the user in the many-to-many relationship
	association := controller.DB.Model(&user).Association("Categories")
	if err := association.Append(&newCategory); err != nil {
		return err
	}

	return c.JSON(newCategory)
}
func (controller *CategoryController) GetCategoryByUserIDAndDateRange(c *fiber.Ctx) error {
	userID := c.Params("user_id")         // Assuming "user_id" is the parameter name
	startDateStr := c.Query("start_date") // Get the start date from the query parameters
	endDateStr := c.Query("end_date")     // Get the end date from the query parameters

	// Parse the start and end dates from the query parameters
	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid start date format",
		})
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid end date format",
		})
	}

	// Fetch the user by user ID
	user := new(models.User)
	if err := controller.DB.Preload("Categories.Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	// Filter categories by date range
	filteredCategories := []models.Category{}
	for _, category := range user.Categories {
		for _, outcome := range category.Outcomes {
			// Check if the outcome date is within the specified range
			if outcome.Date.After(startDate) && outcome.Date.Before(endDate) {
				filteredCategories = append(filteredCategories, category)
				break
			}
		}
	}

	return c.JSON(filteredCategories)
}

// GetCategoryByUserID retrieves categories by user ID.
func (controller *CategoryController) GetCategoryByUserID(c *fiber.Ctx) error {
	userID := c.Params("user_id") // Assuming "user_id" is the parameter name
	user := new(models.User)

	if err := controller.DB.Preload("Categories").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Categories not found for the user",
			})
		}
		return err
	}
	return c.JSON(user.Categories)
}
func (controller *CategoryController) GetCategoryByUserIDAndDate(c *fiber.Ctx) error {
	userID := c.Params("user_id") // Assuming "user_id" is the parameter name
	dateStr := c.Params("date")   // Assuming "date" is the parameter name

	// Parse the date string to a time.Time object
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid date format",
		})
	}

	// Fetch the user by user ID
	user := new(models.User)
	if err := controller.DB.Preload("Categories.Outcomes").Find(user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return err
	}

	// Filter categories by date
	filteredCategories := []models.Category{}
	for _, category := range user.Categories {
		for _, outcome := range category.Outcomes {
			// Assuming you want to filter by the date of the outcome
			if outcome.Date.Equal(date) {
				filteredCategories = append(filteredCategories, category)
				break
			}
		}
	}

	return c.JSON(filteredCategories)
}

// GetCategoryByID retrieves a category by its ID.
func (controller *CategoryController) GetCategoryByID(c *fiber.Ctx) error {
	id := c.Params("category_id")
	category := new(models.Category)
	if err := controller.DB.First(category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Category not found",
			})
		}
		return err
	}
	return c.JSON(category)
}

// GetAllCategories retrieves all categories.
func (controller *CategoryController) GetAllCategories(c *fiber.Ctx) error {
	var categories []models.Category

	if err := controller.DB.Find(&categories).Error; err != nil {
		return err
	}

	return c.JSON(categories)
}

// UpdateCategory updates an existing category.
func (controller *CategoryController) UpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	category := new(models.Category)

	if err := controller.DB.First(category, id).Error; err != nil {
		return err
	}

	// Parse the request body to get the updated name
	var updateData struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&updateData); err != nil {
		return err
	}

	// Update the "name" field if it's provided in the request
	if updateData.Name != "" {
		category.CategoryName = updateData.Name
	}

	if err := controller.DB.Save(category).Error; err != nil {
		return err
	}

	return c.JSON(category)
}

// DeleteCategory deletes a category by its ID.
func (controller *CategoryController) DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	category := new(models.Category)
	if err := controller.DB.First(category, id).Error; err != nil {
		return err
	}

	if err := controller.DB.Delete(category).Error; err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
