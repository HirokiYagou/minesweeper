class Game < ApplicationRecord
  validates :time, presence: true, numericality: :true
  belongs_to :user
end
