class GamesController < ApplicationController
  def index
    @games = Game.includes(:user).order('time ASC')
    @game = Game.new
  end

  def create
    game = Game.new(game_params)
    if game.save
      redirect_to root_path
    end
  end

  private

  def game_params
    params.require(:game).permit(:time, :comment).merge(user_id: current_user.id)
  end
end
