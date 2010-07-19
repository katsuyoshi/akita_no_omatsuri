require 'test_helper'

class OmatsurisControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:omatsuris)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create omatsuri" do
    assert_difference('Omatsuri.count') do
      post :create, :omatsuri => { :code => 'kanto', :name => 'KANTO' }
    end

    assert_redirected_to omatsuri_path(assigns(:omatsuri))
  end

  test "should show omatsuri" do
    get :show, :id => omatsuris(:kakunodate).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => omatsuris(:kakunodate).to_param
    assert_response :success
  end

  test "should update omatsuri" do
    put :update, :id => omatsuris(:kakunodate).to_param, :omatsuri => { :code => 'kakunodate', :name => 'KAKUNODATE' }
    assert_redirected_to omatsuri_path(assigns(:omatsuri))
  end

  test "should destroy omatsuri" do
    assert_difference('Omatsuri.count', -1) do
      delete :destroy, :id => omatsuris(:kakunodate).to_param
    end

    assert_redirected_to omatsuris_path
  end
end
