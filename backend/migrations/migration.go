package migrations

import (
	"github.com/finance-management/models"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	// Create the users table
	if err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Wallet{},
		&models.Income{},
		&models.Outcome{},
		&models.DailyRecap{},
		&models.Budget{},
	); err != nil {
		return err
	}

	// Add your other migration logic here if needed

	return nil
}
func Delete(db *gorm.DB) error {
	if err := DeleteTables(
		db,
		&models.User{},
		&models.Category{},
		&models.Wallet{},
		&models.Income{},
		&models.Outcome{},
		&models.DailyRecap{},
		&models.Budget{},
	); err != nil {
		return err
	}
	return nil
}

func AddTriggers(db *gorm.DB) error {
	// Add SQL code to create trigger functions and triggers
	if err := db.Exec(`
        CREATE OR REPLACE FUNCTION update_wallet_balance_on_income()
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE wallets
          SET total_balance = total_balance + NEW.total_income
          WHERE id = NEW.wallet_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION update_wallet_balance_on_outcome()
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE wallets
          SET total_balance = total_balance - NEW.total_outcome
          WHERE id = NEW.wallet_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER income_trigger
        AFTER INSERT
        ON incomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_income();

        CREATE TRIGGER outcome_trigger
        AFTER INSERT
        ON outcomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_outcome();
    `).Error; err != nil {
		return err
	}
	return nil
}
