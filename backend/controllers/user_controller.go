package controllers

import (
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
	user.Password = ""
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
	// Check if a report exists for the current month and year
	currentDate := time.Now()
	month := currentDate.Month()
	year := currentDate.Year()
	date := time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
	existingReport := models.Report{}
	if err := uc.DB.Where("user_id = ? AND date = ?", existingUser.ID, date).First(&existingReport).Error; err != nil {
		if gorm.ErrRecordNotFound == err {
			// Create a report if it doesn't exist
			newReport := models.Report{
				Date:         time.Date(year, month, 1, 0, 0, 0, 0, time.UTC),
				UserID:       existingUser.ID,
				TotalIncome:  0,
				TotalOutcome: 0,
			}
			if err := uc.DB.Create(&newReport).Error; err != nil {
				return jsonResponse(c, fiber.StatusInternalServerError, "Failed to create the initial report", nil)
			}
		} else {
			return jsonResponse(c, fiber.StatusInternalServerError, "Failed to check the report", err)
		}
	}
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
		return jsonResponse(c, fiber.StatusBadRequest, "Invalid request body", nil)
	}

	// Check if the user with the provided username or email exists
	var existingUser models.User
	if err := uc.DB.Where("username = ? OR email = ?", loginRequest.Identifier, loginRequest.Identifier).First(&existingUser).Error; err != nil {
		return jsonResponse(c, fiber.StatusBadRequest, "Incorrect username/email or password", nil)
	}

	// Generate a new JWT token for the user
	tokenString, err := generateJWTToken(existingUser.ID)
	if err != nil {
		return jsonResponse(c, fiber.StatusInternalServerError, "Internal Server Error", "Failed to generate JWT token")
	}

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
	return jsonResponse(c, fiber.StatusOK, "Success", fiber.Map{
		"user":  existingUser,
		"token": tokenString, // Include the token in the response if needed
	})
}
func (uc *UserController) LogoutUser(c *fiber.Ctx) error {
	// Remove the "token" cookie by setting it to an empty value and expiring it
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Second), // Expire immediately
		Domain:   "localhost",                      // Set to the appropriate domain,
		Path:     "/",
		SameSite: fiber.CookieSameSiteLaxMode,
	})

	// Clear the "userID" from locals
	c.Locals("userID", nil)

	// Return a response indicating successful logout
	return jsonResponse(c, fiber.StatusOK, "Logout successful", nil)
}
