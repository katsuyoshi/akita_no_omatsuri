require 'test_helper'

class HikiyamasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:hikiyamas)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create hikiyama" do
    assert_difference('Hikiyama.count') do
      post :create, :hikiyama => { }
    end

    assert_redirected_to hikiyama_path(assigns(:hikiyama))
  end

  test "should show hikiyama" do
    get :show, :id => hikiyamas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => hikiyamas(:one).to_param
    assert_response :success
  end

  test "should update hikiyama" do
    put :update, :id => hikiyamas(:one).to_param, :hikiyama => { }
    assert_redirected_to hikiyama_path(assigns(:hikiyama))
  end

  test "should destroy hikiyama" do
    assert_difference('Hikiyama.count', -1) do
      delete :destroy, :id => hikiyamas(:one).to_param
    end

    assert_redirected_to hikiyamas_path
  end
end
