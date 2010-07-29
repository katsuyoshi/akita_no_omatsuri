class CreateIcons < ActiveRecord::Migration
  def self.up
    create_table :icons do |t|
      t.integer :hikiyama_id
      t.string :content_type
      t.string :filename
      t.integer :set_count
      t.integer :size

      t.timestamps
    end
  end

  def self.down
    drop_table :icons
  end
end
