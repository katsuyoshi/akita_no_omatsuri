require File.expand_path('../../../../test/test_helper.rb', File.dirname(__FILE__))

class FilePublisher::ContentsHelperTest < ActionController::IntegrationTest
  include ActionView::Helpers::AssetTagHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TagHelper
  include FilePublisher::ContentsHelper

  def setup
    get "/"
    @controller = controller
    @docroot = File.expand_path("docroot", File.dirname(__FILE__))
    FilePublisher.load_config(:root=>@docroot)
  end

  def test_filepub_url_for
    assert_equal "/contents/images/test.gif", filepub_url_for("images/test.gif")
    assert_equal "/contents/index.html", filepub_url_for("index.html")
  end

  def test_filepub_url_for_with_relative_url_root
    @controller.request.relative_url_root = '/foo'
    assert_equal "/foo/contents/images/test.gif", filepub_url_for("images/test.gif")
    assert_equal "/foo/contents/index.html", filepub_url_for("index.html")
    @controller.request.relative_url_root = ''
  end

  def test_filepub_link_to
    assert_equal \
      "<a href=\"/contents/index.html\">Index</a>",
      filepub_link_to("Index", "index.html")
    assert_equal \
      "<a href=\"/contents/images/test.gif\">画像</a>",
      filepub_link_to("画像", "images/test.gif")
  end

  def test_filepub_include_file
    assert_equal \
      File.read(File.expand_path("index.html", @docroot)),
      filepub_include_file("index.html")
  end

  def test_filepub_image_tag
    assert_equal \
      "<img alt=\"My Image\" src=\"/contents/images/test.gif\" />",
      filepub_image_tag("images/test.gif", :alt=>"My Image")
  end

  def test_filepub_image_tag_with_relative_url_root
    @controller.request.relative_url_root = '/foo'
    assert_equal \
      "<img alt=\"My Image\" src=\"/foo/contents/images/test.gif\" />",
      filepub_image_tag("images/test.gif", :alt=>"My Image")
    @controller.request.relative_url_root = ''
  end
end
