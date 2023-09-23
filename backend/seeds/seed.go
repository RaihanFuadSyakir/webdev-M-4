package seeds

import (
	"github.com/finance-management/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	// Generate and create 100 random users
	for i := 0; i < 100; i++ {
		user := models.User{
			Username: uuid.New().String(),
			Email:    uuid.New().String() + "@example.com",
			Password: "password" + uuid.New().String(),
		}
		db.Create(&user)
	}
}
