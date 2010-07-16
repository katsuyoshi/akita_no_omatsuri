class Omatsuri < ActiveRecord::Base
  validates_presence_of :code, :title
  validates_uniqueness_of :code
  
  has_many :chonais, :dependent => :destroy
end
