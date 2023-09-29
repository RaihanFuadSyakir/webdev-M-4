package migrations

import (
	"gorm.io/gorm"
)

func DeleteTables(db *gorm.DB, tables ...interface{}) error {
	for _, table := range tables {
		if err := db.Migrator().DropTable(table); err != nil {
			return err
		}
	}
	return nil
}
