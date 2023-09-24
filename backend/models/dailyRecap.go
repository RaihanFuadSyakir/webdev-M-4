package models

import "time"

type DailyRecap struct {
	ID   uint      `gorm:"primaryKey" json:"id"`
	Date time.Time `json:"date"`
}
