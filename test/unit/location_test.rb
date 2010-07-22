require 'test_helper'

class LocationTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  
  test "should get locations by date" do
    assert 4, Location.by_date(DateTime.parse("2010-07-18"))
  end
  
  test "should get locations by start_at and end_at" do
    assert 4, Location.by_start_at_and_end_at(DateTime.parse("2010-07-18-00:00:00"), DateTime.parse("2010-07-19-00:00:00"))
  end
  
  test "latitude should be number" do
    location = locations(:one)
    location.latitude = "abcd"
    assert !location.valid?
    location.latitude = nil
    assert !location.valid?
    location.latitude = 1.23
    assert location.valid?
  end
  
  test "longitude should be number" do
    location = locations(:one)
    location.longitude = "abcd"
    assert !location.valid?
    location.longitude = nil
    assert !location.valid?
    location.longitude = 1.23
    assert location.valid?
  end
  
  test "horizontal_accuracy should be number" do
    location = locations(:one)
    location.horizontal_accuracy = "abcd"
    assert !location.valid?
    location.horizontal_accuracy = nil
    assert !location.valid?
    location.horizontal_accuracy = 1.23
    assert location.valid?
  end

  test "heading should be number" do
    location = locations(:one)
    location.heading = "abcd"
    assert !location.valid?
    location.heading = nil
    assert !location.valid?
    location.heading = 1.23
    assert location.valid?
  end
  
  test "heading_accuracy should be number" do
    location = locations(:one)
    location.heading_accuracy = "abcd"
    assert !location.valid?
    location.heading_accuracy = nil
    assert !location.valid?
    location.heading_accuracy = 1.23
    assert location.valid?
  end
  
  test "timestamp should not be empty" do
    location = locations(:one)
    location.timestamp = nil
    assert !location.valid?
    location.timestamp = Time.now
    assert location.valid?
  end
  
  test "hikiyama_id should not be empty" do
    location = locations(:one)
    location.hikiyama_id = nil
    assert !location.valid?
    location.hikiyama_id = 1
    assert location.valid?
  end
  
  
end
