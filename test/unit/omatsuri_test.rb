require 'test_helper'

class OmatsuriTest < ActiveSupport::TestCase


  # Replace this with your real tests.
  test "nil url" do
    @omatsuri = Omatsuri.new
    @omatsuri.code = "kanto"
    @omatsuri.name = "KANTO"

    assert @omatsuri.save
  end
  
  test "invalid url" do
    @omatsuri = Omatsuri.new
    @omatsuri.code = "kanto"
    @omatsuri.name = "KANTO"
    @omatsuri.url = "abc"

    assert !@omatsuri.save
  end
  
  test "valid url" do
    @omatsuri = Hikiyama.new
    @omatsuri.code = "kanto"
    @omatsuri.name = "KANTO"
    @omatsuri.url = "http://www.kakudate.com/omatsuri/"

    assert @omatsuri.save
  end
  
end
