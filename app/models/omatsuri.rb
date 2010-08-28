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
  
  def json_attributes
    attributes = self.attributes.clone
    attributes.delete "created_at"
    attributes.delete "updated_at"
    { :omatsuri => attributes }
  end
  

  def json_location_at_date start_at, end_at, timespan, interval, accuracy
    start_at ||= DateTime.now
    end_at ||= start_at + 24.0 * 60.0 * 60.0
    timespan ||= 24.0 * 60.0
    interval ||= 12
    accuracy ||= 500
    
    interval /= (24.0 * 60.0 * 60.0)
    
    now = start_at
    timelines = []
    last_timeline = nil
    anInterval = timespan
    while (now <= end_at)
      timeline = self.hikiyamas.collect do |hikiyama|
        hikiyama.json_location_at_date now, anInterval, accuracy
      end
      if last_timeline
        timeline.each_with_index do |h, i|
          if h[:location].nil?
            location = last_timeline[i][:location]
            h[:location] = location if location
          end
        end
      end
      timelines << timeline
      last_timeline = timeline
      anInterval = interval
      
      if now == end_at
        break
      end
      now += interval
      now = end_at if now > end_at
    end
    
    timelines
  end

end
