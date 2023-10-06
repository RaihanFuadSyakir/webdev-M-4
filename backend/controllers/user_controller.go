package controllers

import (
	"fmt"
	"time"

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
	userID := c.Locals("userID")
	if err := uc.DB.First(&user, userID).Error; err != nil {
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

func (uc *UserController) LoginUser(c *fiber.Ctx) error {
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
		response := Response{
			OK:     false,
			Status: fiber.StatusUnauthorized,
			Msg:    "Unauthorized",
			Data:   "Incorrect username/email or password",
		}

		return c.Status(fiber.StatusUnauthorized).JSON(response)
	}

	// Generate a new JWT token for the user
	tokenString, err := generateJWTToken(existingUser.ID)
	if err != nil {
		response := Response{
			OK:     false,
			Status: fiber.StatusInternalServerError,
			Msg:    "Internal Server Error",
			Data:   "Failed to generate JWT token",
		}

		return c.Status(fiber.StatusInternalServerError).JSON(response)
	}
	/* c.Response().Header.Set("Access-Control-Allow-Origin", "http://localhost:3000")
	c.Response().Header.Set("Access-Control-Allow-Credentials", "true")
	c.Response().Header.Set("Access-Control-Allow-Headers", "Content-Type,access-control-allow-origin, access-control-allow-headers,access-control-allow-credentials")
	c.Response().Header.Set("Content-Type", "application/json") */
	// Set the JWT token as a cookie in the response
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		SameSite: fiber.CookieSameSiteLaxMode,
		Expires:  time.Now().Add(2 * time.Hour),
		Domain:   "localhost", // Set to the appropriate domain,
		Path:     "/",
	})
	existingUser.Password = ""
	// Return the JWT token in the JSON response (optional)
	fmt.Println("success")
	return c.JSON(fiber.Map{
		"status": "success",
		"user":   existingUser,
		"token":  tokenString, // Include the token in the response if needed
	})
}
