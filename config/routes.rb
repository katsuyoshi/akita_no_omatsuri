ActionController::Routing::Routes.draw do |map|
  map.resources :devices

  map.hikiyamas("/omatsuri/:omatsuri/hikiyamas.:format",
    :controller => 'hikiyamas', :action => 'index' )
    
  map.now_locations("/omatsuri/:omatsuri/locations.:format",
    :controller => 'hikiyamas', :action => 'hikiyamas_location' )
    
  map.locations("/omatsuri/:omatsuri/:hikiyama/locations.:format",
    :controller => 'locations', :action => 'index' )

  map.create_location("/omatsuri/:omatsuri/:hikiyama/location.:format",
    :controller => 'locations', :action => 'create', :conditions => { :method => :post })

  map.locations_by_date("/omatsuri/:omatsuri/:hikiyama/locations/:date.:format",
    :controller => 'locations', :action => 'index', :requirements => { :date => /\d{4}-\d{1,2}-\d{1,2}/ })

  map.locations_by_start_at_and_end_at("/omatsuri/:omatsuri/:hikiyama/locations/:start_at/:end_at.:format",
    :controller => 'locations', :action => 'index', :requirements => { :start_at => /\d{4}-\d{1,2}-\d{1,2}-\d{6}/, :end_at => /\d{4}-\d{1,2}-\d{1,2}-\d{6}/ })

  map.new_locations("/omatsuri/:omatsuri/:hikiyama/locations/new.:format",
    :controller => 'locations', :action => 'new' )

    
  map.resources :omatsuris do |omatsuri|
    omatsuri.resources :hikiyamas, :has_many => [:locations, :icons]
    omatsuri.resources :track_infos
  end
  

  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  map.root :controller => "omatsuris"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
