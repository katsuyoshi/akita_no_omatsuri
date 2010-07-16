class Omatsuri < ActiveRecord::Base
  validates_presence_of :code, :name
  validates_uniqueness_of :code
  validates_format_of :url, { :with => /|^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/ix, :message => "の形式が違っています。" }
  
  has_many :hikiyamas, :dependent => :destroy
  has_many :track_infos, :dependent => :destroy
end
