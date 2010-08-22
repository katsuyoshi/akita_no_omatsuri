class AddLocationInfoToOmatsuri < ActiveRecord::Migration
  def self.up
    add_column :omatsuris, :location_latitude, :float, :limit => 53
    add_column :omatsuris, :location_longitude, :float, :limit => 53
    add_column :omatsuris, :location_scale, :float
  end

  def self.down
    remove_column :omatsuris, :location_scale
    remove_column :omatsuris, :location_longitude
    remove_column :omatsuris, :location_latitude
  end
end
