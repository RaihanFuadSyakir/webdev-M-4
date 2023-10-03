package main

import (
	"github.com/finance-management/controllers"
	"github.com/finance-management/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	// Update the import path
)

func main() {
	// Initialize Fiber
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000", // Allow requests from your frontend domain
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept,token , Authorization,Set-Cookie", // Add the necessary headers
		AllowCredentials: true,                                                            // Allow credentials (cookies) to be sent
	}))
	// Initialize the database
	db, err := InitDatabase()
	if err != nil {
		panic("Failed to connect to the database")
	}

	// Apply migrations
	/* if err := migrations.Delete(db); err != nil {
		panic("Failed to Delete Tables")
	}
	if err := migrations.Migrate(db); err != nil {
		panic("Failed to apply migrations")
	}

	// Seed the database with dummy data
	seeds.Seed(db) // Update the function call with the correct path */

	// Initialize the UserController with the database

	userController := controllers.NewUserController(db)
	walletController := controllers.NewWalletController(db)
	budgetController := controllers.NewBudgetController(db)
	incomeController := controllers.NewIncomeController(db)
	categoryController := controllers.NewCategoryController(db)
	outcomeController := controllers.NewOutcomeController(db)
	dailyRecapController := controllers.NewDailyRecapController(db)
	reportController := controllers.NewReportController(db)

	// Define a route to get user data
	app.Post("/api/users/login", userController.LoginUser)
	authenticatedRoutes := app.Group("")
	authenticatedRoutes.Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/users", userController.RegisterUser)
	authenticatedRoutes.Patch("/api/users", userController.UpdateField)
	authenticatedRoutes.Get("/api/users", userController.GetUsers)
	authenticatedRoutes.Get("/api/users/:identifier", userController.GetUser)
	authenticatedRoutes.Post("/api/categories", categoryController.CreateCategory)
	authenticatedRoutes.Get("/api/categories", categoryController.GetAllCategories)
	authenticatedRoutes.Patch("/api/categories", categoryController.UpdateCategory)
	authenticatedRoutes.Get("/api/categories/:user_id", categoryController.GetCategoryByUserID)
	authenticatedRoutes.Get("/api/report/", categoryController.GetCategoryByUserIDAndDateRange)
	authenticatedRoutes.Post("/api/wallet/new", walletController.CreateWallet)
	authenticatedRoutes.Get("/api/wallet/:id", walletController.GetWallet)
	authenticatedRoutes.Put("/api/wallet/:id", walletController.UpdateWallet)
	authenticatedRoutes.Post("/api/outcome/new", outcomeController.CreateOutcome)
	authenticatedRoutes.Get("/api/outcome/:id", outcomeController.GetOutcome)
	authenticatedRoutes.Get("/api/outcome/byuserid/:user_id", outcomeController.GetOutcomeByUserID)
	authenticatedRoutes.Put("/api/outcome/:id", outcomeController.UpdateOutcome)
	authenticatedRoutes.Delete("/api/outcome/delete", outcomeController.DeleteOutcome)
	authenticatedRoutes.Post("/api/dailyrecap/new", dailyRecapController.CreateDailyRecap)
	authenticatedRoutes.Get("/api/dailyrecap/:id", dailyRecapController.GetDailyRecap)
	authenticatedRoutes.Get("/api/dailyrecap/byuserid/:user_id", dailyRecapController.GetDailyRecapByUserID)
	authenticatedRoutes.Get("/api/dailyrecap/bydate/:date", dailyRecapController.GetDailyRecapByDate)
	authenticatedRoutes.Put("/api/dailyrecap/:id", dailyRecapController.UpdateDailyRecap)
	authenticatedRoutes.Delete("/api/dailyrecap/delete/:id", dailyRecapController.DeleteDailyRecap)
	authenticatedRoutes.Post("/api/budget/new", budgetController.CreateBudget)
	authenticatedRoutes.Get("/api/budget/:id", budgetController.GetBudgetByID)
	authenticatedRoutes.Put("/api/budget/:id", budgetController.UpdateBudget)
	authenticatedRoutes.Delete("/api/budget/delete/:id", budgetController.DeleteBudget)
	authenticatedRoutes.Post("/api/income", incomeController.CreateIncome)
	authenticatedRoutes.Get("/api/income/:id", incomeController.GetIncomeByID)
	authenticatedRoutes.Put("/api/income/:id", incomeController.UpdateIncome)
	authenticatedRoutes.Delete("/api/income/:id", incomeController.DeleteIncome)
	authenticatedRoutes.Get("/api/report/outcomes", reportController.GetOutcomesByDateAndUser)

	// Start the server
	app.Listen(":5000")
}
