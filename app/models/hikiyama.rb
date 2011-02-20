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
    attributes[:icons] = self.icons.collect{|i| File.basename(i.public_filename, ".*") }
    { :hikiyama => attributes }
  end

  def json_location_at_date date, accuracy
    date ||= DateTime.now
    accuracy ||= 500.0
    
    location = self.locations.find(:first, :conditions => ["timestamp <= ? and horizontal_accuracy <= ?", date, accuracy], :order => "timestamp desc")
    h = {}
    h[:location] = location.json_attributes[:location] if location
    h[:name] = self.name
    h[:code] = self.code
    h[:url] = self.url
    h[:summary] = self.summary
    h[:icons] = self.icons.collect{|i| File.basename(i.public_filename, ".*") }
#p h
    h
  end
  
end
