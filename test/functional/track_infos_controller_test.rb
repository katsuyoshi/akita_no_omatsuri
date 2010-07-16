require 'test_helper'

class TrackInfosControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:track_infos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create track_info" do
    assert_difference('TrackInfo.count') do
      post :create, :track_info => { }
    end

    assert_redirected_to track_info_path(assigns(:track_info))
  end

  test "should show track_info" do
    get :show, :id => track_infos(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => track_infos(:one).to_param
    assert_response :success
  end

  test "should update track_info" do
    put :update, :id => track_infos(:one).to_param, :track_info => { }
    assert_redirected_to track_info_path(assigns(:track_info))
  end

  test "should destroy track_info" do
    assert_difference('TrackInfo.count', -1) do
      delete :destroy, :id => track_infos(:one).to_param
    end

    assert_redirected_to track_infos_path
  end
end
