class TrackInfosController < AdminController
  layout "application"

  before_filter :capture_omatsuri

  # GET /track_infos
  # GET /track_infos.xml
  def index
    @track_infos = TrackInfo.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @track_infos }
      format.json  { render :json => @track_infos }
    end
  end

  # GET /track_infos/1
  # GET /track_infos/1.xml
  def show
    @track_info = TrackInfo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @track_info }
    end
  end

  # GET /track_infos/new
  # GET /track_infos/new.xml
  def new
    @track_info = TrackInfo.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @track_info }
    end
  end

  # GET /track_infos/1/edit
  def edit
    @track_info = TrackInfo.find(params[:id])
  end

  # POST /track_infos
  # POST /track_infos.xml
  def create
    @track_info = TrackInfo.new(params[:track_info])

    respond_to do |format|
      if @omatsuri.track_infos << @track_info
        flash[:notice] = 'TrackInfo was successfully created.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { render :xml => @track_info, :status => :created, :location => @track_info }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @track_info.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /track_infos/1
  # PUT /track_infos/1.xml
  def update
    @track_info = TrackInfo.find(params[:id])

    respond_to do |format|
      if @track_info.update_attributes(params[:track_info])
        flash[:notice] = 'TrackInfo was successfully updated.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @track_info.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /track_infos/1
  # DELETE /track_infos/1.xml
  def destroy
    @track_info = TrackInfo.find(params[:id])
    @track_info.destroy

    respond_to do |format|
      format.html { redirect_to(@omatsuri) }
      format.xml  { head :ok }
    end
  end


  private
  
  def capture_omatsuri
    @omatsuri = Omatsuri.find(params[:omatsuri_id])
  end

end
