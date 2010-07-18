require 'test_helper'

class HikiyamaTest < ActiveSupport::TestCase

  test "nil url" do
    @hikiyama = Hikiyama.new
    @hikiyama.code = "sugazawa"
    @hikiyama.name = "SUGAZAWA"

    assert @hikiyama.save
  end
  
  test "invalid url" do
    @hikiyama = Hikiyama.new
    @hikiyama.code = "sugazawa"
    @hikiyama.name = "SUGAZAWA"
    @hikiyama.url = "abc"

    assert !@hikiyama.save
  end

  test "valid url" do
    @hikiyama = Hikiyama.new
    @hikiyama.code = "sugazawa"
    @hikiyama.name = "SUGAZAWA"
    @hikiyama.url = "http://www.kakudate.com/omatsuri/"

    assert @hikiyama.save
  end

end
