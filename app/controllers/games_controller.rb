class GamesController < ApplicationController
  def index
    @games = Game.includes(:user).order('time DESC')
  end
end
