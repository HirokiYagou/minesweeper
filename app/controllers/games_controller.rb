class GamesController < ApplicationController
  before_action :set_games

  def index
    @game = Game.new
  end
  
  def create
    game = Game.new(game_params)
    if game.save
      render json: { game: game, user: game.user }
    end
  end
  
  private
  
  def game_params
    params.require(:game).permit(:time, :comment).merge(user_id: current_user.id)
  end
  
  def set_games
    @games = Game.includes(:user).order('time ASC')[0..9]
  end
end
