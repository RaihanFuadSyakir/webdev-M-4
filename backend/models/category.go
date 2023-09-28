package models

type Category struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	CategoryName  string `json:"category_name"`
	IsUserDefined bool   `json:"is_user_defined"`
	UserID        uint   `json:"user_id" gorm:"foreignKey:UserID"`
}
