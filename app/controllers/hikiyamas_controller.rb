class HikiyamasController < ApplicationController
  layout "application"

  before_filter :capture_omatsuri

  # GET /hikiyamas
  # GET /hikiyamas.xml
  def index
    @hikiyamas = @omatsuri.hikiyamas

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @hikiyamas }
      format.json  { render :json => @hikiyamas }
    end
  end

  # GET /hikiyamas/1
  # GET /hikiyamas/1.xml
  def show
    @hikiyama = Hikiyama.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @hikiyama }
    end
  end

  # GET /hikiyamas/new
  # GET /hikiyamas/new.xml
  def new
    @hikiyama = Hikiyama.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @hikiyama }
    end
  end

  # GET /hikiyamas/1/edit
  def edit
    @hikiyama = Hikiyama.find(params[:id])
  end

  # POST /hikiyamas
  # POST /hikiyamas.xml
  def create
    @hikiyama = Hikiyama.new(params[:hikiyama])

    respond_to do |format|
      if @omatsuri.hikiyamas << @hikiyama
        flash[:notice] = 'Hikiyama was successfully created.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { render :xml => @hikiyama, :status => :created, :location => @omatsuri }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @hikiyama.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /hikiyamas/1
  # PUT /hikiyamas/1.xml
  def update
    @hikiyama = Hikiyama.find(params[:id])

    respond_to do |format|
      if @hikiyama.update_attributes(params[:hikiyama])
        flash[:notice] = 'Hikiyama was successfully updated.'
        format.html { redirect_to(@omatsuri, @hikiyama) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @hikiyama.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /hikiyamas/1
  # DELETE /hikiyamas/1.xml
  def destroy
    @hikiyama = Hikiyama.find(params[:id])
    @hikiyama.destroy

    respond_to do |format|
      format.html { redirect_to(@omatsuri) }
      format.xml  { head :ok }
    end
  end



  private
  
  def capture_omatsuri
    @omatsuri = Omatsuri.find(params[:omatsuri_id]) if params[:omatsuri_id]
    @omatsuri = Omatsuri.find_by_code(params[:omatsuri]) if params[:omatsuri]
  end

end
