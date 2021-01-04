class GamesController < ApplicationController
  def index
    @games = Game.includes(:user).order('time ASC')
  end

  def create
    
  end
end
