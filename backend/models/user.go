package models

type User struct {
	ID          uint         `gorm:"primaryKey" json:"id"`
	Username    string       `gorm:"unique;not null" json:"username"`
	Email       string       `gorm:"unique;not null" json:"email"`
	Password    string       `gorm:"not null" json:"password"`
	Token       string       `json:"token"`
	Wallets     []Wallet     `json:"wallets"`
	Categories  []Category   `json:"user_categories"`
	DailyRecaps []DailyRecap `json:"daily_recaps"`
	Outcomes    []Outcome    `json:"outcomes"`
	Incomes     []Income     `json:"incomes"`
	Budgets     []Budget     `json:"budgets"`
}
