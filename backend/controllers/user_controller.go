package controllers

import (
	"github.com/finance-management/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{DB: db}
}

func (uc *UserController) GetUser(c *fiber.Ctx) error {
	var user models.User
	param := c.Params("identifier")
	if err := uc.DB.Where("username = ? OR email = ?", param, param).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to retrieve user data", nil)
	}
	return jsonResponse(c, fiber.StatusOK, "User retrieved successfully", user)
}

func (uc *UserController) RegisterUser(c *fiber.Ctx) error {
	var newUser struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}
	if err := c.BodyParser(&newUser); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid request body", nil)
	}
	var existingUser models.User
	if err := uc.DB.Where("username = ?", newUser.Username).First(&existingUser).Error; err == nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Username is already in use", nil)
	}
	if err := uc.DB.Where("email = ?", newUser.Email).First(&existingUser).Error; err == nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Email is already in use", nil)
	}
	existingUser.Username = newUser.Username
	existingUser.Password = newUser.Password
	existingUser.Email = newUser.Email
	if err := uc.DB.Create(&existingUser).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to register the user", nil)
	}
	existingUser.Password = ""
	return jsonResponse(c, fiber.StatusCreated, "User registered successfully", existingUser)
}

func (uc *UserController) GetUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := uc.DB.Find(&users).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to retrieve user data", nil)
	}
	return jsonResponse(c, fiber.StatusOK, "Users retrieved successfully", users)
}

func (uc *UserController) UpdateField(c *fiber.Ctx) error {
	var updateData struct {
		UserID        uint   `json:"user_id"`
		FieldToUpdate string `json:"field_to_update"`
		NewValue      string `json:"new_value"`
	}
	if err := c.BodyParser(&updateData); err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid request body", nil)
	}
	var currentUser models.User
	if err := uc.DB.First(&currentUser, updateData.UserID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, fiber.StatusNotFound, "User not found", nil)
		}
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to retrieve user data", nil)
	}
	switch updateData.FieldToUpdate {
	case "username":
		currentUser.Username = updateData.NewValue
	case "email":
		currentUser.Email = updateData.NewValue
	case "password":
		currentUser.Password = updateData.NewValue
	case "token":
		currentUser.Token = updateData.NewValue
	default:
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid field name", nil)
	}
	if err := uc.DB.Save(&currentUser).Error; err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Failed to update user field", nil)
	}
	return jsonResponse(c, fiber.StatusOK, "User field updated successfully", currentUser)
}

/* func (uc *UserController) LoginUser(c *fiber.Ctx) error {
	// Parse the request body to get the user's login credentials
	var loginRequest struct {
		Identifier string `json:"identifier"` // Can be username or email
		Password   string `json:"password"`
	}

	if err := c.BodyParser(&loginRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Check if the user with the provided username or email exists
	var existingUser models.User
	if err := uc.DB.Where("username = ? OR email = ?", loginRequest.Identifier, loginRequest.Identifier).First(&existingUser).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Incorrect username/email or password",
		})
	}

	// At this point, the user has successfully logged in
	// You may want to generate a JWT token or a session for authentication and authorization

	return c.JSON(fiber.Map{
		"status": "success",
		"user":   existingUser,
	})
} */
