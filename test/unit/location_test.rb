require 'test_helper'

class LocationTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  
  test "should get locations by date" do
    assert 4, Location.by_date(DateTime.parse("2010-07-18"))
  end
  
  test "should get locations by start_at and end_at" do
    assert 4, Location.by_start_at_and_end_at(DateTime.parse("2010-07-18-00:00:00"), DateTime.parse("2010-07-19-00:00:00"))
  end
  
end
