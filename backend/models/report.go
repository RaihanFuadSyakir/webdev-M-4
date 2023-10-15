package models

import "time"

type Report struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Date         time.Time `json:"date"`
	TotalIncome  float64   `json:"total_income"`
	TotalOutcome float64   `json:"total_outcome"`
	UserID       uint      `json:"user_id" gorm:"foreignKey:UserID"`
}
