class CreateHikiyamas < ActiveRecord::Migration
  def self.up
    create_table :hikiyamas do |t|
      t.string :code
      t.string :name
      t.text :summary
      t.integer :omatsuri_id
      t.string :url

      t.timestamps
    end
  end

  def self.down
    drop_table :hikiyamas
  end
end
