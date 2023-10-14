package models

import "time"

type Outcome struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Date         time.Time `json:"date"`
	TotalOutcome float64   `json:"total_outcome"`
	Description  string    `json:"description"`
	CategoryID   uint      `json:"category_id" gorm:"foreignKey:CategoryID"`
	WalletID     uint      `json:"wallet_id" gorm:"foreignKey:WalletID"`
	UserID       uint      `json:"user_id" gorm:"foreignKey:UserID"`
	Category     Category  `json:"category"`
	Wallet       Wallet    `json:"wallet"`
}
