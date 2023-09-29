package migrations

import (
	"github.com/finance-management/models"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	// Create the users table
	if err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Wallet{},
		&models.Income{},
		&models.Outcome{},
		&models.DailyRecap{},
		&models.Budget{},
	); err != nil {
		return err
	}

	// Add your other migration logic here if needed

	return nil
}
func Delete(db *gorm.DB) error {
	if err := DeleteTables(
		db,
		&models.User{},
		&models.Category{},
		&models.Wallet{},
		&models.Income{},
		&models.Outcome{},
		&models.DailyRecap{},
		&models.Budget{},
	); err != nil {
		return err
	}
	return nil
}
