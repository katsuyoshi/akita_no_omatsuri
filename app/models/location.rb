class Location < ActiveRecord::Base
  validates_presence_of :timestamp, :hikiyama_id
  validates_numericality_of :latitude, :longitude, :horizontal_accuracy, :heading, :heading_accuracy

  belongs_to :hikiyama
  belongs_to :device
  
  attr_accessor :device_nickname

  named_scope :by_date, lambda {|date|
    { :conditions => ['timestamp between ? and ?', date.beginning_of_day, date.end_of_day], :order => 'timestamp'}
  }

  named_scope :by_start_at_and_end_at, lambda {|start_at, end_at|
    { :conditions => ['timestamp between ? and ?', start_at, end_at.ago(1)], :order => 'timestamp'}
  }
  
  named_scope :recent, lambda {|limit|
    { :limit => limit, :order => 'timestamp desc' }
  }
  
  named_scope :all, { :order => 'timestamp' }

  
  def before_save
    if self.device_nickname
      d = Device.find_by_nickname(self.device_nickname)
      if d
        self.device = d
      else
        d = Device.new :nickname => self.device_nickname
        d.save
        self.device = d       
      end
    end
  end
  
end
