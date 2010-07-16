class Chonai < ActiveRecord::Base
  validates_presence_of :code, :title
  validates_uniqueness_of :code, :scope => :omatsuri_id

  belongs_to :omatsuri
  has_many :locations, :dependent => :destroy
end
