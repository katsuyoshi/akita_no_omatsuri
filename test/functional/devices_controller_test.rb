require 'test_helper'

class DevicesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:devices)
  end

  test "should show device" do
    get :show, :id => devices(:iphone).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => devices(:iphone).to_param
    assert_response :success
  end

  test "should update device" do
    put :update, :id => devices(:iphone).to_param, :device => { }
    assert_redirected_to device_path(assigns(:device))
  end

  test "should destroy device" do
    assert_difference('Device.count', -1) do
      delete :destroy, :id => devices(:iphone).to_param
    end

    assert_redirected_to devices_path
  end
end
