class CreateTrackInfos < ActiveRecord::Migration
  def self.up
    create_table :track_infos do |t|
      t.integer :omatsuri_id
      t.string :title
      t.text :summary
      t.datetime :start_at
      t.datetime :end_at

      t.timestamps
    end
  end

  def self.down
    drop_table :track_infos
  end
end
