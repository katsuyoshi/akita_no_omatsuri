class AddIndexToLocation < ActiveRecord::Migration
  def self.up
    add_index :locations, :hikiyama_id
    add_index :locations, :timestamp
    add_index :locations, :device_id
  end

  def self.down
    remove_index :locations, :hikiyama_id
    remove_index :locations, :timestamp
    remove_index :locations, :device_id
  end
end
