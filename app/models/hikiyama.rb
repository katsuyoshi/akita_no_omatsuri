class Hikiyama < ActiveRecord::Base
  validates_presence_of :code, :name
  validates_uniqueness_of :code, :scope => :omatsuri_id

  belongs_to :omatsuri
  has_many :locations, :dependent => :destroy
  has_many :icons, :dependent => :destroy

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

  def json_attributes
    attributes = self.attributes.clone
    attributes.delete "created_at"
    attributes.delete "updated_at"
    attributes.delete "omatsuri_id"
    attributes[:omatsuri_name] = self.omatsuri.name
    attributes[:omatsuri_code] = self.omatsuri.code
    { :hikiyama => attributes }
  end
  
end
