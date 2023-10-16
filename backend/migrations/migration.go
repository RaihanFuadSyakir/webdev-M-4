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
		&models.Report{},
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
		&models.Report{},
	); err != nil {
		return err
	}
	return nil
}

func AddTriggers(db *gorm.DB) error {
	// Add SQL code to create trigger functions and triggers
	if err := db.Exec(`
        CREATE OR REPLACE FUNCTION update_wallet_balance_on_income_insertion()
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE wallets
          SET total_balance = total_balance + NEW.total_income
          WHERE id = NEW.wallet_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION update_wallet_balance_on_outcome_insertion()
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE wallets
          SET total_balance = total_balance - NEW.total_outcome
          WHERE id = NEW.wallet_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER new_income_update_wallet_trigger
        AFTER INSERT
        ON incomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_income_insertion();

        CREATE OR REPLACE TRIGGER new_outcome_update_wallet_trigger
        AFTER INSERT
        ON outcomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_outcome_insertion();

        -- Create a trigger function to update wallet balance on income deletion
        CREATE OR REPLACE FUNCTION update_wallet_balance_on_income_deletion()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE wallets
            SET total_balance = total_balance - OLD.total_income
            WHERE id = OLD.wallet_id;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        -- Create a trigger function to update wallet balance on outcome deletion
        CREATE OR REPLACE FUNCTION update_wallet_balance_on_outcome_deletion()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE wallets
            SET total_balance = total_balance + OLD.total_outcome
            WHERE id = OLD.wallet_id;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        -- Create a trigger for income deletion
        CREATE OR REPLACE TRIGGER income_deletion_trigger
        AFTER DELETE
        ON incomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_income_deletion();

        -- Create a trigger for outcome deletion
        CREATE OR REPLACE TRIGGER outcome_deletion_trigger
        AFTER DELETE
        ON outcomes
        FOR EACH ROW
        EXECUTE FUNCTION update_wallet_balance_on_outcome_deletion();

        CREATE OR REPLACE FUNCTION update_total_income_on_report()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Check if a record for the same month and user already exists
            IF EXISTS (SELECT 1 FROM "reports" WHERE "date" = DATE_TRUNC('month', NEW.date) AND "user_id" = NEW.user_id) THEN
                -- Update the existing record
                UPDATE "reports"
                SET "total_income" = "total_income" + NEW."total_income"
                WHERE "date" = DATE_TRUNC('month', NEW.date) AND "user_id" = NEW.user_id;
            ELSE
                -- Insert a new record
                INSERT INTO "reports" ("date", "user_id", "total_income", "total_outcome")
                VALUES (DATE_TRUNC('month', NEW.date), NEW.user_id, NEW.total_income, 0);
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        -- Create a trigger to update the TotalOutcome in the reports table after inserting into outcomes
        CREATE OR REPLACE FUNCTION update_total_outcome_on_report()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Check if a record for the same month and user already exists
            IF EXISTS (SELECT 1 FROM "reports" WHERE "date" = DATE_TRUNC('month', NEW.date) AND "user_id" = NEW.user_id) THEN
                -- Update the existing record
                UPDATE "reports"
                SET "total_outcome" = "total_outcome" + NEW."total_outcome"
                WHERE "date" = DATE_TRUNC('month', NEW.date) AND "user_id" = NEW.user_id;
            ELSE
                -- Insert a new record
                INSERT INTO "reports" ("date", "user_id", "total_income", "total_outcome")
                VALUES (DATE_TRUNC('month', NEW.date), NEW.user_id, 0, NEW.total_outcome);
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create triggers for updating TotalIncome and TotalOutcome after inserting into incomes and outcomes
        CREATE OR REPLACE TRIGGER update_total_income_on_report_trigger
        AFTER INSERT ON incomes
        FOR EACH ROW
        EXECUTE FUNCTION update_total_income_on_report();

        CREATE OR REPLACE TRIGGER update_total_outcome_on_report_trigger
        AFTER INSERT ON outcomes
        FOR EACH ROW
        EXECUTE FUNCTION update_total_outcome_on_report();

        -- Create a trigger to update the TotalIncome in the reports table after deleting an income record
        CREATE OR REPLACE FUNCTION delete_income_update_report_trigger()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE "reports"
            SET "total_income" = "total_income" - OLD."total_income"
            WHERE "date" = DATE_TRUNC('month', OLD."date") AND "user_id" = OLD."user_id";
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        -- Create a trigger to update the TotalOutcome in the reports table after deleting an outcome record
        CREATE OR REPLACE FUNCTION delete_outcome_update_report_trigger()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE "reports"
            SET "total_outcome" = "total_outcome" - OLD."total_outcome"
            WHERE "date" = DATE_TRUNC('month', OLD."date") AND "user_id" = OLD."user_id";
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        -- Create a trigger to update the TotalIncome in the reports table after deleting an income record
        CREATE OR REPLACE TRIGGER delete_income_update_report_trigger
        AFTER DELETE ON incomes
        FOR EACH ROW
        EXECUTE FUNCTION delete_income_update_report_trigger();
        
        -- Create a trigger to update the TotalOutcome in the reports table after deleting an outcome record
        CREATE OR REPLACE TRIGGER delete_outcome_update_report_trigger
        AFTER DELETE ON outcomes
        FOR EACH ROW
        EXECUTE FUNCTION delete_outcome_update_report_trigger();
    `).Error; err != nil {
		return err
	}
	return nil
}
