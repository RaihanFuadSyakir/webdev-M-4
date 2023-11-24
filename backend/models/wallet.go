package models

type Wallet struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	WalletName   string    `json:"wallet_name" gorm:"unique;not null"` // Tambahkan tag unique di sini
	TotalBalance float64   `json:"total_balance"`
	UserID       uint      `json:"user_id" gorm:"foreignKey:UserID"`
	Outcomes     []Outcome `json:"outcomes"`
	Incomes      []Income  `json:"incomes"`
}
