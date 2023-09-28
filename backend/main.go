package main

import (
	"github.com/finance-management/controllers" // Update the import path
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
	/* if err := migrations.Migrate(db); err != nil {
		panic("Failed to apply migrations")
	}

	// Seed the database with dummy data
	seeds.Seed(db) // Update the function call with the correct path */

	// Initialize the UserController with the database
	userController := controllers.NewUserController(db)
	walletController := controllers.NewWalletController(db)
	categoryController := controllers.NewCategoryController(db)
	outcomeController := controllers.NewOutcomeController(db)
	dailyRecapController := controllers.NewDailyRecapController(db)
	// Define a route to get user data
	app.Post("/api/users", userController.RegisterUser)
	app.Patch("/api/users", userController.UpdateField)
	app.Get("/api/users", userController.GetUsers)
	app.Get("/api/users/", userController.GetUser)

	app.Post("/api/categories", categoryController.CreateCategory)
	app.Get("/api/categories", categoryController.GetAllCategories)
	app.Patch("/api/categories", categoryController.UpdateCategory)
	app.Get("/api/categories/:user_id", categoryController.GetCategoryByUserID)

	app.Post("/api/wallet/new", walletController.CreateWallet)
	app.Get("/api/wallet/:id", walletController.GetWallet)
	app.Put("/api/wallet/:id", walletController.UpdateWallet)

	app.Post("/api/outcome/new", outcomeController.CreateOutcome)
	app.Get("/api/outcome/:id", outcomeController.GetOutcome)
	app.Put("/api/outcome/:id", outcomeController.UpdateOutcome)
	app.Delete("/api/outcome/delete", outcomeController.DeleteOutcome)

	app.Post("/api/dailyrecap/new", dailyRecapController.CreateDailyRecap)
	app.Get("/api/dailyrecap/:id", dailyRecapController.GetDailyRecap)
	app.Put("/api/dailyrecap/:id", dailyRecapController.UpdateDailyRecap)
	app.Delete("/api/dailyrecap/delete/:id", dailyRecapController.DeleteDailyRecap)

	// Start the server
	app.Listen(":5000")
}
