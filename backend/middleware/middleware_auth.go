package middleware

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Response struct {
	OK     bool        `json:"ok"`
	Status int         `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}

func AuthMiddleware(c *fiber.Ctx) error {
	// Extract JWT token from the cookie
	tokenString, err := extractJWTToken(c)

	if err != nil {
		// Remove the "token" cookie
		c.ClearCookie("token")

		response := Response{
			OK:     false,
			Status: fiber.StatusUnauthorized,
			Msg:    "Unauthorized",
			Data:   nil,
		}

		return c.Status(fiber.StatusUnauthorized).JSON(response)
	}

	// Validate and extract user ID from the JWT token
	userID, err := validateAndExtractUserID(tokenString)
	if err != nil {
		// Remove the "token" cookie
		c.ClearCookie("token")

		// Remove the userID from Locals when token validation fails
		c.Locals("userID", nil)

		response := Response{
			OK:     false,
			Status: fiber.StatusUnauthorized,
			Msg:    "Unauthorized",
			Data:   nil,
		}

		return c.Status(fiber.StatusUnauthorized).JSON(response)
	}

	// Store the user ID in the context for use in route handlers
	c.Locals("userID", userID)

	// Continue processing the request
	return c.Next()
}

// Define a function to validate and extract user ID from the JWT token
func validateAndExtractUserID(tokenString string) (uint, error) {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		return 0, err
	}

	// Define the secret key for JWT verification
	var jwtSecret = []byte(os.Getenv("SECRET_KEY"))

	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return 0, fmt.Errorf("Invalid or expired JWT token")
	}

	// Extract user ID from the claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, fmt.Errorf("Invalid JWT claims")
	}

	userID, ok := claims["sub"].(float64)
	if !ok {
		return 0, fmt.Errorf("Invalid user ID in JWT claims")
	}

	return uint(userID), nil
}

func extractJWTToken(c *fiber.Ctx) (string, error) {
	reqToken := c.Cookies("token")

	if reqToken == "" {
		return "", fmt.Errorf("Missing JWT token")
	}
	return reqToken, nil
}
