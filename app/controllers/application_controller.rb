# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password


  def to_date str
    a = str.split('-')
    t = a[3]
    h = t[0,2]
    m = (t.size >= 4) ? t[2, 2] : '00'
    s = (t.size >= 6) ? t[4, 2] : '00'
    str = [a[0,3].join('-'), [h, m, s].join(":")].join(' ')
    DateTime.parse(str)
  end
  
end
