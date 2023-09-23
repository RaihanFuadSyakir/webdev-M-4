package migrations

import (
	"github.com/finance-management/models"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	// Create the users table
	if err := db.AutoMigrate(&models.User{}); err != nil {
		return err
	}

	// Add your other migration logic here if needed

	return nil
}
