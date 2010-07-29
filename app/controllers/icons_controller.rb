class IconsController < ApplicationController
  layout "application"

  def destroy
    @icon = Icon.find(params[:id])
    @icon.destroy

    respond_to do |format|
      format.html { redirect_to(omatsuri_hikiyama_url(@icon.hikiyama.omatsuri, @icon.hikiyama)) }
      format.xml  { head :ok }
    end
  end

end