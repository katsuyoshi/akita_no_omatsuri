require 'test_helper'

class RoutesTest < ActionController::TestCase

  # -----
  test "/omatsuris" do
    assert_routing "/omatsuris", { :controller => 'omatsuris',  :action => 'index' }
  end

  test "/omatsuris/1" do
    assert_routing "/omatsuris/1", { :controller => 'omatsuris',  :action => 'show', :id => '1' }
  end

  test "/omatsuri/kakunodate" do
    assert_routing "/omatsuri/kakunodate", { :controller => 'omatsuris',  :action => 'show', :omatsuri => 'kakunodate' }
  end

  # -----
  test "/omatsuris/1/hikiyamas" do
    assert_routing "/omatsuris/1/hikiyamas", { :controller => 'hikiyamas',  :action => 'index', :omatsuri_id => '1' }
  end

  test "/omatsuris/1/hikiyamas/2" do
    assert_routing "/omatsuris/1/hikiyamas/2", { :controller => 'hikiyamas',  :action => 'show', :omatsuri_id => '1', :id => '2' }
  end

  test "/omatsuri/kakunodate/sugazawa" do
    assert_routing "/omatsuri/kakunodate/sugazawa", { :controller => 'hikiyamas',  :action => 'show', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa' }
  end


  # -----
  test "/omatsuris/1/hikiyamas/2/locations" do
    assert_routing "/omatsuris/1/hikiyamas/2/locations", { :controller => 'locations',  :action => 'index', :omatsuri_id => '1', :hikiyama_id => '2' }
  end

  test "/omatsuris/1/hikiyamas/2/locations/3" do
    assert_routing "/omatsuris/1/hikiyamas/2/locations/3", { :controller => 'locations',  :action => 'show', :omatsuri_id => '1', :hikiyama_id => '2', :id => '3' }
  end


  # -----
  test "/omatsuris/1/track_infos" do
    assert_routing "/omatsuris/1/track_infos", { :controller => 'track_infos',  :action => 'index', :omatsuri_id => '1' }
  end

  test "/omatsuris/1/track_info/2" do
    assert_routing "/omatsuris/1/track_infos/2", { :controller => 'track_infos',  :action => 'show', :omatsuri_id => '1', :id => '2' }
  end



  # -----
  test "/omatsuri/kakunodate/hikiyamas" do
    assert_routing "/omatsuri/kakunodate/hikiyamas", { :controller => 'hikiyamas',  :action => 'index', :omatsuri => 'kakunodate' }
  end



  # ----
  test "/omatsuri/kakunodate/sugazawa/locations" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa' }, "/omatsuri/kakunodate/sugazawa/locations")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by date" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :date => '2010-07-19' }, "/omatsuri/kakunodate/sugazawa/locations/2010-07-19")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by date 2" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :date => '2010-7-1' }, "/omatsuri/kakunodate/sugazawa/locations/2010-7-1")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by start_at and end_at" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :start_at => '2010-07-19-000000', :end_at => '2010-07-20-000000' }, "/omatsuri/kakunodate/sugazawa/locations/2010-07-19-000000/2010-07-20-000000")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by start_at and end_at 2" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :start_at => '2010-7-1-000000', :end_at => '2010-7-2-000000' }, "/omatsuri/kakunodate/sugazawa/locations/2010-7-1-000000/2010-7-2-000000")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by start_at and end_at 3" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :start_at => '2010-7-1-0000', :end_at => '2010-7-2-0000' }, "/omatsuri/kakunodate/sugazawa/locations/2010-7-1-0000/2010-7-2-0000")
  end

  test "/omatsuri/kakunodate/sugazawa/locations by start_at and end_at 4" do
    assert_recognizes({ :controller => 'locations',  :action => 'index', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :start_at => '2010-7-1-00', :end_at => '2010-7-2-00' }, "/omatsuri/kakunodate/sugazawa/locations/2010-7-1-00/2010-7-2-00")
  end




  test "/omatsuri/kakunodate/sugazawa/locations/new" do
    assert_recognizes({ :controller => 'locations',  :action => 'new', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa' }, "/omatsuri/kakunodate/sugazawa/locations/new")
  end

  test "/omatsuri/kakunodate/sugazawa/location" do
    assert_recognizes({ :controller => 'locations',  :action => 'create', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa' }, { :path => "/omatsuri/kakunodate/sugazawa/location", :method => :post} )
  end

  test "/omatsuri/kakunodate/sugazawa/icon/abc/0" do
    assert_recognizes({ :controller => 'hikiyamas',  :action => 'show_icon', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :icon => 'abc', :rad => '0' }, { :path => "/omatsuri/kakunodate/sugazawa/icon/abc/0" } )
  end

  test "/omatsuri/kakunodate/sugazawa/icon/0/1" do
    assert_recognizes({ :controller => 'hikiyamas',  :action => 'show_icon', :omatsuri => 'kakunodate', :hikiyama => 'sugazawa', :no => '0', :rad => '1' }, { :path => "/omatsuri/kakunodate/sugazawa/icon/0/1" } )
  end



  # -----
  test "/omatsuri/kakunodate/locations" do
    assert_recognizes({ :controller => 'hikiyamas',  :action => 'hikiyamas_location', :omatsuri => 'kakunodate' }, { :path => "/omatsuri/kakunodate/locations" } )
  end

  test "/omatsuri/kakunodate/locations/2010-8-17-00" do
    assert_routing "/omatsuri/kakunodate/locations/2010-8-17-00", { :controller => 'hikiyamas',  :action => 'hikiyamas_location', :omatsuri => 'kakunodate', :date => '2010-8-17-00' }
  end

  test "/omatsuri/kakunodate/locations/2010-8-17-0001" do
    assert_routing "/omatsuri/kakunodate/locations/2010-8-17-0001", { :controller => 'hikiyamas',  :action => 'hikiyamas_location', :omatsuri => 'kakunodate', :date => '2010-8-17-0001' }
  end

  test "/omatsuri/kakunodate/locations/2010-8-17-000102" do
    assert_routing "/omatsuri/kakunodate/locations/2010-8-17-000102", { :controller => 'hikiyamas',  :action => 'hikiyamas_location', :omatsuri => 'kakunodate', :date => '2010-8-17-000102' }
  end


  # -----

  test "/omatsuri/kakunodate/timelines/2010-8-17-00/2010-8-18-00/0" do
    assert_routing "/omatsuri/kakunodate/timelines/2010-8-17-00/2010-8-18-00/0", { :controller => 'omatsuris',  :action => 'show_timelines', :omatsuri => 'kakunodate', :start_at => '2010-8-17-00', :end_at => '2010-8-18-00', :interval => "0" }
  end



end
