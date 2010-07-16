class LocationsController < ApplicationController

  before_filter :capture_omatsuri_chonai

  # GET /locations
  # GET /locations.xml
  def index
    @locations = @chonai.locations

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
      if @chonai.locations << @location
        flash[:notice] = 'Location was successfully created.'
        format.html { redirect_to(omatsuri_chonai_url(@omatsuri, @chonai)) }
        format.xml  { render :xml => @location, :status => :created, :location => @location }
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
      format.html { redirect_to(omatsuri_chonai_url(@omatsuri, @chonai)) }
      format.xml  { head :ok }
    end
  end


  private
  
  def capture_omatsuri_chonai
    @chonai = Chonai.find(params[:chonai_id])
    @omatsuri = @chonai.omatsuri
  end

end
