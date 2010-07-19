require 'test_helper'

class TrackInfosControllerTest < ActionController::TestCase

  test "should get new" do
    get :new, :omatsuri_id => omatsuris(:kakunodate).id, :title => '本番', :start_at => '2010-07-18 00:00', :end_at => '2010-07-18 00:01'
    assert_response :success
  end

  test "should create track_info" do
    assert_difference('TrackInfo.count') do
      post :create, :omatsuri_id => omatsuris(:kakunodate).to_param, :track_info => { :title => '本番', :start_at => '2010-07-18 00:00', :end_at => '2010-07-18 00:01' }
    end

    assert_redirected_to omatsuris(:kakunodate)
  end

  test "should show track_info" do
    get :show, :id => track_infos(:kakunodate_info).to_param, :omatsuri_id => omatsuris(:kakunodate).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => track_infos(:kakunodate_info).to_param, :omatsuri_id => omatsuris(:kakunodate).to_param
    assert_response :success
  end

  test "should update track_info" do
    put :update, :omatsuri_id => omatsuris(:kakunodate).to_param, :id => track_infos(:kakunodate_info).to_param, :track_info => { :title => 'test' }
    assert_redirected_to omatsuri_path(omatsuris(:kakunodate).to_param)
  end

  test "should destroy track_info" do
    assert_difference('TrackInfo.count', -1) do
      delete :destroy, :id => track_infos(:kakunodate_info).to_param, :omatsuri_id => omatsuris(:kakunodate).to_param
    end

    assert_redirected_to omatsuri_path(:id => omatsuris(:kakunodate).to_param)
  end
end
