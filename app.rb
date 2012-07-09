require 'sinatra'
require 'json'

class Movie < Struct.new(:name, :opening_weekend, :total_gross)
  def to_json(*args)
    {
      :id => object_id,
      :name => name,
      :openingWeekend => opening_weekend,
      :totalGross => total_gross
    }.to_json
  end
end

MOVIES = []

def movies_json
  erb JSON.dump(movies: MOVIES), :content_type => "application/json"
end

post '/populate' do
  MOVIES << Movie.new('The Avengers', 207438708, 538116000)
  MOVIES << Movie.new('Harry Potter and the Deathly Hallows Part 2', 169189427, 381011219)
  movies_json
end

post '/movies' do
  attrs = JSON.load(request.body.read)
  MOVIES << Movie.new(*attrs.values)
  movies_json
end

delete '/:id' do
  MOVIES.delete_if {|m| m.object_id == params[:id].to_i}
  movies_json
end

get '*' do
  @movies = MOVIES
  erb :index
end
