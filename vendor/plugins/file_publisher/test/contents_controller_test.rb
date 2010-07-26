require File.expand_path('../../../../test/test_helper.rb', File.dirname(__FILE__))

Mime::Type.register 'image/jpeg', :jpg
Mime::Type.register 'image/gif', :gif

class FilePublisher::ContentsControllerTest < ActionController::IntegrationTest
  def setup
    @docroot = File.expand_path("docroot", File.dirname(__FILE__))
    FilePublisher.load_config(:root=>@docroot)
  end

  def test_no_root
    FilePublisher.load_config(:root=>"/no/such/path")
    get "/contents"
    assert_response 404
  end

  def test_redirect_to_directory
    get "/contents"
    assert_response :redirect
    assert_equal("http://www.example.com/contents/",
                 response.headers["Location"])
    get "/contents/"
    assert_response :ok

    get "/contents/images"
    assert_response :redirect
    assert_equal("http://www.example.com/contents/images/",
                 response.headers["Location"])
    get "/contents/images/"
    assert_response 404
  end

  def test_read_index_file
    get "/contents/"
    assert_response :ok
    content = File.read(File.expand_path("index.html", @docroot))
    assert_equal(content, response.body)
    assert_equal("text/html", response.content_type)
  end

  def test_extension_does_not_exist
    get "/contents/README"
    assert_response :ok
    assert_equal "application/octet-stream", response.content_type
  end


  def test_not_found
    get "/contents/no/such/file"
    assert_response 404
    get "/contents/images/"
    assert_response 404
  end

  def test_contents
    get "/contents/images/test.gif"
    assert_response :ok
    assert_equal("image/gif", response.content_type)

    get "/contents/images/test.gif/"
    assert_response 404

    get "/contents/images/test.jpg"
    assert_response :ok
    assert_equal("image/jpeg", response.content_type)

    get "/contents/index.html"
    assert_response :ok
    assert_equal("text/html", response.content_type)
    etag = response.headers["Etag"]
    last_mod = response.headers["Last-Modified"]

    get "/contents/", {}, {"If-None-Match" => etag}
    assert_response 304
    get "/contents/", {}, {"If-None-Match" => etag.reverse}
    assert_response 200

    get "/contents/", {}, {"If-Modified-Since" => Time.now.httpdate}
    assert_response 304
    get "/contents/", {}, {"If-Modified-Since" => last_mod}
    assert_response 304
    get "/contents/", {}, {"If-Modified-Since" => Time.at(0).httpdate}
    assert_response 200
  end

  def test_nondisclosure
    FilePublisher.load_config(
      :root => @docroot,
      :nondisclosure_name => /\A(.*\.html?|.*\.gif|readme)\z/i,
      :index_file => %w(format index.html)
    )

    get '/contents/index.html'
    assert_response 404

    get '/contents/images/test.gif'
    assert_response 404

    get '/contents/README'
    assert_response 404

    get '/contents/.svn/format'
    assert_response 404

    get '/contents/.svn/'
    assert_response 404
  end
end
