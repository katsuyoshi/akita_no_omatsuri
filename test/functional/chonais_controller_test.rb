require 'test_helper'

class ChonaisControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:chonais)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create chonai" do
    assert_difference('Chonai.count') do
      post :create, :chonai => { }
    end

    assert_redirected_to chonai_path(assigns(:chonai))
  end

  test "should show chonai" do
    get :show, :id => chonais(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => chonais(:one).to_param
    assert_response :success
  end

  test "should update chonai" do
    put :update, :id => chonais(:one).to_param, :chonai => { }
    assert_redirected_to chonai_path(assigns(:chonai))
  end

  test "should destroy chonai" do
    assert_difference('Chonai.count', -1) do
      delete :destroy, :id => chonais(:one).to_param
    end

    assert_redirected_to chonais_path
  end
end
