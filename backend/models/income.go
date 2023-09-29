package models

import "time"

type Income struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Date        time.Time `json:"date"`
	TotalIncome float64   `json:"total_income"`
	Description string    `json:"description"`
	Category    uint      `json:"category_id" gorm:"foreignKey:CategoryID"`
	WalletID    uint      `json:"wallet_id" gorm:"foreignKey:WalletID"`
	UserID      uint      `json:"user_id" gorm:"foreignKey:UserID"`
}