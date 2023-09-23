package controllers

import (
	"fmt"

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

	// Retrieve username parameter from the URL
	username := c.Params("username")

	// Retrieve user data from the database based on the username
	if err := uc.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve user data",
		})
	}

	return c.JSON(user)
}

func (uc *UserController) RegisterUser(c *fiber.Ctx) error {
	// Parse the request body to get the user data for registration
	var newUser struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}

	if err := c.BodyParser(&newUser); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Check if the username is already in use
	var existingUser models.User
	if err := uc.DB.Where("username = ?", newUser.Username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username is already in use",
		})
	}
	// Check if the email is already in use
	if err := uc.DB.Where("email = ?", newUser.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email is already in use",
		})
	}
	existingUser.Username = newUser.Username
	existingUser.Password = newUser.Password
	existingUser.Email = newUser.Email
	// Save the user data to the database
	if err := uc.DB.Create(&existingUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to register the user",
		})
	}

	// Remove sensitive data (e.g., password) from the response
	existingUser.Password = ""

	return c.JSON(existingUser)
}

func (uc *UserController) GetUsers(c *fiber.Ctx) error {
	var users []models.User

	// Retrieve all user data from the database
	if err := uc.DB.Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve user data",
		})
	}

	return c.JSON(users)
}

func (uc *UserController) UpdateToken(c *fiber.Ctx) error {
	// Parse the request body to get the user data, including the username and token
	var currentUser models.User
	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	fmt.Println(user)
	fmt.Println(currentUser)
	// Retrieve the user data from the database based on the username
	if err := uc.DB.Where("username = ?", user.Username).First(&currentUser).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve user data",
		})
	}
	fmt.Println(user)
	currentUser.Token = user.Token
	// Update the user's token
	if err := uc.DB.Save(&currentUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user token",
		})
	}

	return c.JSON(user)
}
