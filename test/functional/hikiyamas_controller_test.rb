require 'test_helper'

class HikiyamasControllerTest < ActionController::TestCase

  test "should get index" do
    get :index, :omatsuri_id => omatsuris(:kakunodate).to_param
    assert_response :success
    assert_not_nil assigns(:hikiyamas)
  end

  test "should get new" do
    get :new, :omatsuri_id => omatsuris(:kakunodate).to_param
    assert_response :success
  end

  test "should create hikiyama" do
    assert_difference('Hikiyama.count') do
      post :create, :omatsuri_id => omatsuris(:kakunodate).to_param, :hikiyama => { :code => 'yokomachi', :name => '横町' }
    end

    assert_redirected_to omatsuris(:kakunodate)
  end


  test "should show hikiyama" do
    get :show, :omatsuri_id => omatsuris(:kakunodate).to_param, :id => hikiyamas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :omatsuri_id => omatsuris(:kakunodate).to_param, :id => hikiyamas(:sugazawa).to_param
    assert_response :success
  end

  test "should update hikiyama" do
    put :update, :omatsuri_id => omatsuris(:kakunodate).to_param, :id => hikiyamas(:sugazawa).to_param, :hikiyama => { }
    assert_redirected_to omatsuri_path(assigns(:omatsuri))
  end

  test "should destroy hikiyama" do
    assert_difference('Hikiyama.count', -1) do
      delete :destroy, :omatsuri_id => omatsuris(:kakunodate).to_param, :id => hikiyamas(:sugazawa).to_param
    end

    assert_redirected_to omatsuri_path(assigns(:omatsuri))
  end
end
