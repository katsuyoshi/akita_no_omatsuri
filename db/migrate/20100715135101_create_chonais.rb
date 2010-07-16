class CreateChonais < ActiveRecord::Migration
  def self.up
    create_table :chonais do |t|
      t.string :code
      t.string :title
      t.text :summary
      t.integer :omatsuri_id

      t.timestamps
    end
  end

  def self.down
    drop_table :chonais
  end
end
