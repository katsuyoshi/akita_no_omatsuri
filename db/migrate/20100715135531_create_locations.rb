class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|
      t.integer :chonai_id
      t.float :latitude
      t.float :longitude
      t.float :horizontal_accuracy
      t.float :heading
      t.float :heading_accuracy
      t.datetime :timestamp

      t.timestamps
    end
  end

  def self.down
    drop_table :locations
  end
end
