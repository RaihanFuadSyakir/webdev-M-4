package models

type Budget struct {
	ID            uint    `gorm:"primaryKey" json:"id"`
	Month         uint    `json:"month"`
	Year          uint    `json:"year"`
	TotalBudget   float64 `json:"total_budget"`
	CurrentBudget float64 `json:"current_budget"`
	CategoryID    uint    `json:"category_id" gorm:"foreignKey:CategoryID"`
	Description   string  `json:"description"`
	UserID        uint    `json:"user_id" gorm:"foreignKey:UserID"`
}
