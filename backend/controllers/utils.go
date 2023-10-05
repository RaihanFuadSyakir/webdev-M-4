package controllers

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Response struct {
	OK     bool        `json:"ok"`
	Status int         `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}

// Function to generate a JWT token for a user
func generateJWTToken(userID uint) (string, error) {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		panic("Error loading .env file")
	}
	// Define a secret key for signing JWTs
	var jwtSecret = []byte(os.Getenv("SECRET_KEY"))
	// Define the token claims, including the user ID and expiration time
	claims := jwt.MapClaims{
		"sub": userID,                                // User ID
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Token expiration time (e.g., 24 hours)
	}

	// Create a new token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
