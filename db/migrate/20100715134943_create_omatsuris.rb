class CreateOmatsuris < ActiveRecord::Migration
  def self.up
    create_table :omatsuris do |t|
      t.string :code
      t.string :title
      t.text :summary

      t.timestamps
    end
  end

  def self.down
    drop_table :omatsuris
  end
end
