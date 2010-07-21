class LocationsController < ApplicationController

  before_filter :capture_omatsuri_hikiyama

  # GET /locations
  # GET /locations.xml
  def index
    if params[:date]
        @locations = @hikiyama.locations.by_date(DateTime.parse(params[:date]))
    elsif params[:start_at] && params[:end_at]
        @locations = @hikiyama.locations.by_start_at_and_end_at(to_date(params[:start_at]), to_date(params[:end_at]))
    else
        @locations = @hikiyama.locations.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @locations }
      format.json  { render :json => @locations }
    end
  end

  # GET /locations/1
  # GET /locations/1.xml
  def show
    @location = Location.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @location }
    end
  end

  # GET /locations/new
  # GET /locations/new.xml
  def new
    @location = Location.new(:latitude => 39.5, :longitude => 140.6, :horizontal_accuracy => 30.0, :heading => 0, :heading_accuracy => 0, :timestamp => Time.now)
     
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @location }
    end
  end

  # GET /locations/1/edit
  def edit
    @location = Location.find(params[:id])
  end

  # POST /locations
  # POST /locations.xml
  def create
    @location = Location.new(params[:location])

    respond_to do |format|
      if @hikiyama.locations << @location
        flash[:notice] = 'Location was successfully created.'
        format.html { redirect_to(omatsuri_hikiyama_url(@omatsuri, @hikiyama)) }
        format.xml  { render :json => @location, :status => :created, :location => '/' }
        format.json  { render :json => @location, :status => :created, :location => '/' }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @location.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /locations/1
  # PUT /locations/1.xml
  def update
    @location = Location.find(params[:id])

    respond_to do |format|
      if @location.update_attributes(params[:location])
        flash[:notice] = 'Location was successfully updated.'
        format.html { redirect_to(@location) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @location.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /locations/1
  # DELETE /locations/1.xml
  def destroy
    @location = Location.find(params[:id])
    @location.destroy

    respond_to do |format|
      format.html { redirect_to(omatsuri_hikiyama_url(@omatsuri, @hikiyama)) }
      format.xml  { head :ok }
    end
  end


  private
  
  def capture_omatsuri_hikiyama
    if params[:hikiyama_id]
      @hikiyama = Hikiyama.find(params[:hikiyama_id])
      @omatsuri = @hikiyama.omatsuri
    else
      @omatsuri = Omatsuri.find_by_code(params[:omatsuri])
      @hikiyama = @omatsuri.hikiyamas.find_by_code(params[:hikiyama])
    end
  end
  
  def to_date str
    a = str.split('-')
    t = a[3]
    str = [a[0,3].join('-'), [t[0,2], t[2,2], t[4,2]].join(':')].join(' ')
    DateTime.parse(str)
  end
  

end
