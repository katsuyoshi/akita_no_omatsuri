module LocationsHelper
  extend ERB::DefMethod
  def_erb_method('render_location(location)', "#{RAILS_ROOT}/app/views/locations/_location.html.erb")
  def_erb_method('render_location2(location, reference)', "#{RAILS_ROOT}/app/views/locations/_location2.html.erb")
  def_erb_method('render_location3(location)', "#{RAILS_ROOT}/app/views/locations/_location3.html.erb")

  def changed_class value, reference
    c = "";
    c = ' class="changed"' if value != reference
    c
  end
  
end
