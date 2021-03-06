class CreateOmatsuris < ActiveRecord::Migration
  def self.up
    create_table :omatsuris do |t|
      t.string :code
      t.string :name
      t.text :summary
      t.boolean :use_heading, :default => 'true'
      t.string :url

      t.timestamps
    end
  end

  def self.down
    drop_table :omatsuris
  end
end
