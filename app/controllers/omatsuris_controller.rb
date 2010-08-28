class OmatsurisController < AdminController
  layout "application"

  # GET /omatsuris
  # GET /omatsuris.xml
  def index
    @omatsuris = Omatsuri.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @omatsuris }
      format.json  { render :json => @omatsuris }
    end
  end
  
  # GET /omatsuris/1
  # GET /omatsuris/1.xml
  def show
    @omatsuri = Omatsuri.find_by_code(params[:omatsuri]) if params[:omatsuri]
    @omatsuri ||= Omatsuri.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @omatsuri }
      format.json { render :json => @omatsuri.json_attributes }      
    end
  end
  
  def show_timelines
    @omatsuri = Omatsuri.find_by_code(params[:omatsuri]) if params[:omatsuri]
    @omatsuri ||= Omatsuri.find(params[:id])
    start_at = to_date(params[:start_at]) if params[:start_at]
    end_at = to_date(params[:end_at]) if params[:end_at]
    timespan = to_date(params[:timespan]) if params[:timespan]
    interval = params[:interval].to_f if params[:interval]
    accuracy = params[:accuracy].to_f if params[:accuracy]
    
    respond_to do |format|
      format.json {
        @locations = @omatsuri.json_location_at_date start_at, end_at, timespan, interval, accuracy
        render :json => @locations
      }
    end
  end



  # GET /omatsuris/new
  # GET /omatsuris/new.xml
  def new
    @omatsuri = Omatsuri.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @omatsuri }
    end
  end

  # GET /omatsuris/1/edit
  def edit
    @omatsuri = Omatsuri.find(params[:id])
  end

  # POST /omatsuris
  # POST /omatsuris.xml
  def create
    @omatsuri = Omatsuri.new(params[:omatsuri])

    respond_to do |format|
      if @omatsuri.save
        flash[:notice] = 'Omatsuri was successfully created.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { render :xml => @omatsuri, :status => :created, :location => @omatsuri }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @omatsuri.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /omatsuris/1
  # PUT /omatsuris/1.xml
  def update
    @omatsuri = Omatsuri.find(params[:id])

    respond_to do |format|
      if @omatsuri.update_attributes(params[:omatsuri])
        flash[:notice] = 'Omatsuri was successfully updated.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @omatsuri.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /omatsuris/1
  # DELETE /omatsuris/1.xml
  def destroy
    @omatsuri = Omatsuri.find(params[:id])
    @omatsuri.destroy

    respond_to do |format|
      format.html { redirect_to(omatsuris_url) }
      format.xml  { head :ok }
    end
  end
end
