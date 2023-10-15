package seeds

import (
	"strconv"
	"time"

	"github.com/finance-management/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	// Generate and create 100 random users in a batch
	users := make([]models.User, 100)
	for i := range users {
		users[i] = models.User{
			Username: uuid.New().String(),
			Email:    uuid.New().String() + "@example.com",
			Password: "password" + uuid.New().String(),
		}
	}
	db.CreateInBatches(&users, len(users))

	for _, user := range users {
		// Create wallets for the user in a batch
		wallets := []models.Wallet{
			{
				WalletName:   "Wallet 1",
				TotalBalance: 1000.0, // Set an initial balance
				UserID:       user.ID,
			},
			{
				WalletName:   "Wallet 2",
				TotalBalance: 500.0, // Set an initial balance
				UserID:       user.ID,
			},
		}
		db.CreateInBatches(&wallets, len(wallets))

		// Create categories for the user in a batch
		categories := []models.Category{
			{
				CategoryName:  "Food",
				IsUserDefined: true,
				UserID:        user.ID,
			},
			{
				CategoryName:  "Entertainment",
				IsUserDefined: true,
				UserID:        user.ID,
			},
		}
		db.CreateInBatches(&categories, len(categories))
		reports := []models.Report{}
		for j := 0; j < 10; j++ {
			date := time.Now().AddDate(0, -j, 0)
			date = time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.UTC) // Set the date to the 1st day of the month
			report := models.Report{
				Date:         date,
				TotalIncome:  float64(j*200 + 100),
				TotalOutcome: float64(j*100 + 50),
				UserID:       user.ID,
			}
			reports = append(reports, report)
		}
		db.CreateInBatches(&reports, len(reports))
		// Create outcomes for the user in a batch
		outcomes := []models.Outcome{}
		for j := 0; j < 10; j++ {
			date := time.Now().AddDate(0, -j, 0) // Generate dates for the last 10 months
			outcome := models.Outcome{
				Date:         date,
				TotalOutcome: float64(j*100 + 50),
				Description:  "Expense #" + strconv.Itoa(j+1),
				CategoryID:   categories[0].ID, // Assign to Food category
				WalletID:     wallets[0].ID,    // Assign to Wallet 1
				UserID:       user.ID,
			}
			outcomes = append(outcomes, outcome)
		}
		db.CreateInBatches(&outcomes, len(outcomes))

		// Create incomes for the user in a batch
		incomes := []models.Income{}
		for j := 0; j < 10; j++ {
			date := time.Now().AddDate(0, -j, 0) // Generate dates for the last 10 months
			income := models.Income{
				Date:        date,
				TotalIncome: float64(j*200 + 100),
				Description: "Income #" + strconv.Itoa(j+1),
				WalletID:    wallets[1].ID, // Assign to Wallet 2
				UserID:      user.ID,
			}
			incomes = append(incomes, income)
		}
		db.CreateInBatches(&incomes, len(incomes))

		// Create budgets for the user in a batch
		budgets := []models.Budget{}
		for j := 0; j < 10; j++ {
			date := time.Now().AddDate(0, -j, 0) // Generate dates for the last 10 months
			budget := models.Budget{
				Date:        date,
				Month:       date.Format("January 2006"),
				TotalBudget: float64(j*300 + 150),
				Description: "Budget #" + strconv.Itoa(j+1),
				UserID:      user.ID,
			}
			budgets = append(budgets, budget)
		}
		db.CreateInBatches(&budgets, len(budgets))
	}
}
