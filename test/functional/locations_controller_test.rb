require 'test_helper'

class LocationsControllerTest < ActionController::TestCase

  test "should get index" do
    get :index, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param
    assert_response :success
    assert_not_nil assigns(:locations)
  end

  test "should get index by date" do
    get :index, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param, :date => '2010-7-18'
    assert_response :success
    assert 4, assigns(:locations).size
  end

  test "should get index by start_at and end_at" do
    get :index, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param, :start_at => '2010-7-18-000000', :end_at => '2010-7-19-000000'
    assert_response :success
    assert 4, assigns(:locations).size
  end

  test "should get new" do
    get :new, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param
    assert_response :success
  end

  test "should create location" do
    assert_difference('Location.count') do
      post :create, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param, :location => { :latitude => 0.0, :longitude => 0.0, :timestamp => '2010-07-18 00:00:00' }
    end

    assert_redirected_to omatsuri_hikiyama_path(omatsuris(:kakunodate), hikiyamas(:sugazawa))
  end

  test "should destroy location" do
    assert_difference('Location.count', -1) do
      delete :destroy, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama_id => hikiyamas(:sugazawa).to_param, :id => locations(:one).to_param
    end

    assert_redirected_to omatsuri_hikiyama_path(omatsuris(:kakunodate), hikiyamas(:sugazawa))
  end
end
