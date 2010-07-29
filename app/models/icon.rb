require 'RMagick'

class Icon < ActiveRecord::Base
  has_attachment :storage => :file_system, :path_prefix => 'public/icon', :content_type => :image

  validates_presence_of :filename, :message => "ファイルを選択して下さい"
  validates_numericality_of :set_count, :only_integer => true, :greater_than_or_equal_to => 1, :less_than_or_equal_to => 360, :message => "1から360にして下さい"
  
  belongs_to :hikiyama
  
  
  def after_save    
puts '***** after_save ****'
p self
    path = self.public_filename
    dirname = File.dirname path
    basename = File.basename(path, ".*")
    extname = File.extname(path)
    
    org_image = Magick::ImageList.new(File.join(RAILS_ROOT, 'public', path))
    1.upto self.set_count do |i|
#     image = org_image.rotate((i = 1) * 360 / self.set_count)
      background_image = Magick::Image.new(org_image.columns, org_image.rows){|img| img.background_color = 'none' }
      image = background_image.composite(org_image, 0, 0, Magick::OverCompositeOp).rotate((i - 1) * 360 / self.set_count)
      path = File.join(RAILS_ROOT, 'public', dirname, "#{basename}_#{i}#{extname}")
p path
      image.write(path)
    end
  end
  
  def after_destroy
    path = self.public_filename
    dirname = File.dirname path
    basename = File.basename(path, ".*")
    extname = File.extname(path)
    
    1.upto self.set_count do |i|
      path = File.join(RAILS_ROOT, 'public', dirname, "#{basename}_#{i}#{extname}")
      File.delete(path)
    end
  end

#img = Image.new(img.columns, img.rows){self.background_color = 'none'}.composite(img, 0, 0, OverCompositeOp).rotate(45)

  def icon_filename_set
    a = []
    path = self.public_filename
p path
    dirname = File.dirname path
    basename = File.basename(path, ".*")
    extname = File.extname(path)
    
    1.upto self.set_count do |i|
      path = File.join(dirname, "#{basename}_#{i}#{extname}")
      a << path
p path
    end
    a
  end
    
end
