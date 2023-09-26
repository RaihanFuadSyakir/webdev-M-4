package main

import (
	"github.com/finance-management/controllers" // Update the import path
	"github.com/finance-management/migrations"
	"github.com/finance-management/seeds"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Initialize Fiber
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // Update with your React app's domain
	}))
	// Initialize the database
	db, err := InitDatabase()
	if err != nil {
		panic("Failed to connect to the database")
	}

	// Apply migrations
	if err := migrations.Migrate(db); err != nil {
		panic("Failed to apply migrations")
	}

	// Seed the database with dummy data
	seeds.Seed(db) // Update the function call with the correct path

	// Initialize the UserController with the database
	userController := controllers.NewUserController(db)
	walletController := controllers.NewWalletController(db)
	categoryController := controllers.NewCategoryController(db)
	// Define a route to get user data
	app.Post("/api/user", userController.RegisterUser)
	app.Get("/api/user", userController.GetUser)
	app.Get("/api/users", userController.GetUsers)
	app.Get("/api/categories/:id", categoryController.GetCategoryByID)
	app.Post("/api/categories", categoryController.CreateCategory)
	app.Get("/api/categories", categoryController.GetAllCategories)
	app.Patch("/api/user", userController.UpdateField)
	app.Post("/api/wallet/new", walletController.CreateWallet)
	app.Get("/api/wallet/:id", walletController.GetWallet)
	app.Put("/api/wallet/:id", walletController.UpdateWallet)
	// Start the server
	app.Listen(":5000")
}
