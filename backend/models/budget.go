package models

import "time"

type Budget struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Date        time.Time `json:"date"`
	Month       string    `json:"month"`
	TotalBudget float64   `json:"total_budget"`
	Description string    `json:"description"`
	UserID      uint      `json:"user_id" gorm:"foreignKey:UserID"`
}
