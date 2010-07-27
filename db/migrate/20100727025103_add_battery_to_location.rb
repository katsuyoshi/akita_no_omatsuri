class AddBatteryToLocation < ActiveRecord::Migration
  def self.up
    add_column :locations, :battery_level, :float
  end

  def self.down
    remove_column :locations, :battery_level
  end
end
