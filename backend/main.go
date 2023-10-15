package main

import (
	"github.com/finance-management/controllers"
	"github.com/finance-management/middleware"
	"github.com/finance-management/migrations"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	// Update the import path
)

func setupMiddleware(app *fiber.App) {
	// CORS middleware setup
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept,token , Authorization,Set-Cookie",
		AllowCredentials: true,
	}))
}
func main() {
	// Initialize Fiber
	app := fiber.New()
	setupMiddleware(app)
	// Initialize the database
	db, err := InitDatabase()
	if err != nil {
		panic("Failed to connect to the database")
	}

	// // // Apply migrations
	// if err := migrations.Delete(db); err != nil {
	// 	panic("Failed to Delete Tables")
	// }
	// if err := migrations.Migrate(db); err != nil {
	// 	panic("Failed to apply migrations")
	// }
	//add triggers
	if err := migrations.AddTriggers(db); err != nil {
		panic(err)
	}

	// // Seed the database with dummy data
	// seeds.Seed(db) // Update the function call with the correct path

	// Initialize the UserController with the database

	userController := controllers.NewUserController(db)
	walletController := controllers.NewWalletController(db)
	budgetController := controllers.NewBudgetController(db)
	incomeController := controllers.NewIncomeController(db)
	categoryController := controllers.NewCategoryController(db)
	outcomeController := controllers.NewOutcomeController(db)
	dailyRecapController := controllers.NewDailyRecapController(db)
	reportController := controllers.NewReportController(db)

	// Define routes
	app.Post("/api/users/login", userController.LoginUser)
	app.Post("/api/users", userController.RegisterUser)
	defineUserRoutes(app, userController)
	defineCategoryRoutes(app, categoryController)
	defineWalletRoutes(app, walletController)
	defineOutcomeRoutes(app, outcomeController)
	defineDailyRecapRoutes(app, dailyRecapController)
	defineBudgetRoutes(app, budgetController)
	defineIncomeRoutes(app, incomeController)
	defineReportRoutes(app, reportController)
	// Start the server
	app.Listen(":5000")
}

// Define route functions for each controller
func defineUserRoutes(app *fiber.App, controller *controllers.UserController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Patch("/api/users", controller.UpdateField)
	//authenticatedRoutes.Get("/api/users", controller.GetUsers)
	authenticatedRoutes.Get("/api/users/personal", controller.GetUser)
	authenticatedRoutes.Get("/api/users/logout", controller.LogoutUser)
}

func defineCategoryRoutes(app *fiber.App, controller *controllers.CategoryController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/categories", controller.CreateCategory)
	authenticatedRoutes.Get("/api/categories", controller.GetAllCategories)
	authenticatedRoutes.Patch("/api/categories", controller.UpdateCategory)
	authenticatedRoutes.Delete("/api/categories/:id", controller.DeleteCategory)
	authenticatedRoutes.Get("/api/categories/user/", controller.GetCategoryByUserID)
	authenticatedRoutes.Get("/api/report/", controller.GetCategoryByUserIDAndDateRange)
}

func defineWalletRoutes(app *fiber.App, controller *controllers.WalletController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/wallet/new", controller.CreateWallet)
	authenticatedRoutes.Get("/api/wallet/user/", controller.GetWalletByUserID)
	authenticatedRoutes.Get("/api/wallet/:id", controller.GetWallet)
	authenticatedRoutes.Put("/api/wallet/:id", controller.UpdateWallet)
	authenticatedRoutes.Delete("/api/wallet/:id", controller.DeleteWallet)
}
func defineOutcomeRoutes(app *fiber.App, controller *controllers.OutcomeController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/outcome/new", controller.CreateOutcome)
	authenticatedRoutes.Get("/api/outcome/:id", controller.GetOutcome)
	authenticatedRoutes.Get("/api/outcomes/", controller.GetOutcomeByUserID)
	authenticatedRoutes.Put("/api/outcome/:id", controller.UpdateOutcome)
	authenticatedRoutes.Delete("/api/outcome/delete/:id", controller.DeleteOutcome)
}
func defineDailyRecapRoutes(app *fiber.App, controller *controllers.DailyRecapController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/dailyrecap/new", controller.CreateDailyRecap)
	authenticatedRoutes.Get("/api/dailyrecap/:id", controller.GetDailyRecap)
	authenticatedRoutes.Get("/api/dailyrecap/byuserid/:user_id", controller.GetDailyRecapByUserID)
	authenticatedRoutes.Get("/api/dailyrecap/bydate/:date", controller.GetDailyRecapByDate)
	authenticatedRoutes.Put("/api/dailyrecap/:id", controller.UpdateDailyRecap)
	authenticatedRoutes.Delete("/api/dailyrecap/delete/:id", controller.DeleteDailyRecap)
}
func defineBudgetRoutes(app *fiber.App, controller *controllers.BudgetController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/budget/new", controller.CreateBudget)
	authenticatedRoutes.Get("/api/budget/:id", controller.GetBudgetByID)
	authenticatedRoutes.Get("/api/budgets/", controller.GetBudgetsByUserID)
	authenticatedRoutes.Put("/api/budget/:id", controller.UpdateBudget)
	authenticatedRoutes.Delete("/api/budget/delete/:id", controller.DeleteBudget)
}
func defineIncomeRoutes(app *fiber.App, controller *controllers.IncomeController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Post("/api/incomes/new", controller.CreateIncome)
	authenticatedRoutes.Get("/api/income/:id", controller.GetIncomeByID)
	authenticatedRoutes.Put("/api/incomes/:id", controller.UpdateIncome)
	authenticatedRoutes.Delete("/api/income/delete/:id", controller.DeleteIncome)
	authenticatedRoutes.Get("/api/incomes/user", controller.GetIncomeByUserID)
	authenticatedRoutes.Get("/api/incomes/date/:date", controller.GetIncomeByDate)

}
func defineReportRoutes(app *fiber.App, controller *controllers.ReportController) {
	authenticatedRoutes := app.Group("").Use(middleware.AuthMiddleware)
	authenticatedRoutes.Get("/api/reports/current", controller.GetReportByUserID)
	authenticatedRoutes.Get("/api/reports", controller.GetReportsByUserID)
}
