package models

import "time"

type Income struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Date        time.Time `json:"date"`
	TotalIncome float64   `json:"total_income"`
	Description string    `json:"description"`
	WalletID    uint      `json:"wallet_id"`
	UserID      uint      `json:"user_id"`
}
