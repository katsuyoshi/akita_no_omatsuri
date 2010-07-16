class TrackInfo < ActiveRecord::Base
  validates_presence_of :title, :start_at, :end_at

  belongs_to :omatsuri
end
