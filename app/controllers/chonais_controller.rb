class ChonaisController < ApplicationController

  before_filter :capture_omatsuri

  # GET /chonais
  # GET /chonais.xml
  def index
    @chonais = Chonai.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @chonais }
      format.json  { render :json => @chonais }
    end
  end

  # GET /chonais/1
  # GET /chonais/1.xml
  def show
    @chonai = Chonai.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @chonai }
    end
  end

  # GET /chonais/new
  # GET /chonais/new.xml
  def new
    @chonai = Chonai.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @chonai }
    end
  end

  # GET /chonais/1/edit
  def edit
    @chonai = Chonai.find(params[:id])
  end

  # POST /chonais
  # POST /chonais.xml
  def create
    @chonai = Chonai.new(params[:chonai])

    respond_to do |format|
      if @omatsuri.chonais << @chonai
        flash[:notice] = 'Chonai was successfully created.'
        format.html { redirect_to(@omatsuri) }
        format.xml  { render :xml => @chonai, :status => :created, :location => @omatsuri }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @chonai.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /chonais/1
  # PUT /chonais/1.xml
  def update
    @chonai = Chonai.find(params[:id])

    respond_to do |format|
      if @chonai.update_attributes(params[:chonai])
        flash[:notice] = 'Chonai was successfully updated.'
        format.html { redirect_to(@chonai) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @chonai.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /chonais/1
  # DELETE /chonais/1.xml
  def destroy
    @chonai = Chonai.find(params[:id])
    @chonai.destroy

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
