package models

import "time"

type DailyRecap struct {
	ID     uint      `gorm:"primaryKey" json:"id"`
	Date   time.Time `json:"date"`
	UserID uint      `json:"user_id" gorm:"foreignKey:UserID"`
}
