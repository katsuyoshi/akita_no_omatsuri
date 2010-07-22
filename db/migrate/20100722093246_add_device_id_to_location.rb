class AddDeviceIdToLocation < ActiveRecord::Migration
  def self.up
    add_column :locations, :device_id, :integer
  end

  def self.down
    remove_column :locations, :device_id
  end
end
