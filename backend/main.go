package main

import (
	"github.com/finance-management/controllers" // Update the import path
	"github.com/finance-management/migrations"
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
	//seeds.Seed(db) // Update the function call with the correct path

	// Initialize the UserController with the database
	userController := controllers.NewUserController(db)
	walletController := controllers.NewWalletController(db)

	// 	outcomeController := controllers.NewOutcomeController(db)
	// 	dailyRecapController := controllers.NewDailyRecapController(db)
	budgetController := controllers.NewBudgetController(db)
	incomeController := controllers.NewIncomeController(db)

	// Define a route to get user data
	app.Post("/api/user/register", userController.RegisterUser)
	app.Get("/api/user/find", userController.GetUser)
	app.Get("/api/users", userController.GetUsers)
	app.Post("/api/user/token", userController.UpdateToken)

	app.Post("/api/wallet/new", walletController.CreateWallet)
	app.Get("/api/wallet/:id", walletController.GetWallet)
	app.Put("/api/wallet/:id", walletController.UpdateWallet)

	// 	app.Post("/api/outcome/new", outcomeController.CreateOutcome)
	// 	app.Get("/api/outcome/:id", outcomeController.GetOutcome)
	// 	app.Put("/api/outcome/:id", outcomeController.UpdateOutcome)
	// 	app.Delete("/api/outcome/delete", outcomeController.DeleteOutcome)

	// 	app.Post("/api/dailyrecap/new", dailyRecapController.CreateDailyRecap)
	// 	app.Get("/api/dailyrecap/:id", dailyRecapController.GetDailyRecap)
	// 	app.Put("/api/dailyrecap/:id", dailyRecapController.UpdateDailyRecap)
	// 	app.Delete("/api/dailyrecap/delete/:id", dailyRecapController.DeleteDailyRecap)

	app.Post("/api/budget/new", budgetController.CreateBudget)
	app.Get("/api/budget/:id", budgetController.GetBudgetByID)
	app.Put("/api/budget/:id", budgetController.UpdateBudget)
	app.Delete("/api/budget/delete/:id", budgetController.DeleteBudget)

	app.Post("/api/income", incomeController.CreateIncome)
	app.Get("/api/income/:id", incomeController.GetIncomeByID)
	app.Put("/api/income/:id", incomeController.UpdateIncome)
	app.Delete("/api/income/:id", incomeController.DeleteIncome)

	// Start the server
	app.Listen(":5000")
}
