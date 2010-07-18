class Omatsuri < ActiveRecord::Base
  validates_presence_of :code, :name
  validates_uniqueness_of :code
  
  has_many :hikiyamas, :dependent => :destroy
  has_many :track_infos, :dependent => :destroy
  
  def validate
    unless self.url.blank?
      unless url_is_vallid?
        errors.add(url, "は正しいURLではありません。")
      end
    end
  end
  
  def url_is_vallid?
    begin
      uri = URI.parse(self.url)
      return "http" == uri.scheme
    rescue URI::InvalidURIError
      return false
    end
  end
  
end
