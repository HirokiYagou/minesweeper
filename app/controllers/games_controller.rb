class GamesController < ApplicationController
  def index
    set_games
    @game = Game.new
  end
  
  def create
    game = Game.new(game_params)
    if game.save
      set_games
      partial = render_to_string(partial: 'game', collection: @games)
      render json: { html: partial }
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
