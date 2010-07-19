class Location < ActiveRecord::Base
  belongs_to :hikiyama

  named_scope :by_date, lambda {|date|
    { :conditions => ['timestamp between ? and ?', date.beginning_of_day, date.end_of_day], :order => 'timestamp'}
  }

  named_scope :by_start_at_and_end_at, lambda {|start_at, end_at|
    { :conditions => ['timestamp between ? and ?', start_at, end_at.ago(1)], :order => 'timestamp'}
  }

end
