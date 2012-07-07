function Movie(name, openingWeekend, totalGross) {
  this.name = name;
  this.openingWeekend = openingWeekend;
  this.totalGross = totalGross;
  this.slug = function() {
    return this.name.toLowerCase().replace(/\s+/g,'-');
  }
  this.isNew = typeof(this.name) != 'string'
}

var avengers = new Movie('The Avengers', 207438708, 538116000);
var harryPotter = new Movie('Harry Potter and the Deathly Hallows Part 2', 169189427, 381011219);

function moviesController($scope, state) {
  $scope.state = state;
}

function newMovieController($scope, state, $location) {
  $scope.state = state;
  $scope.newMovie = new Movie;
  $scope.submit = function() {
    if ($scope.form.$valid) {
      state['movies'].push($scope.newMovie);
      $location.path('/');
    }
    else {
      $scope.form.$error['base'] = 'There was an error!'
    }
  }
}

function movieController($scope, state, $routeParams) {
  $scope.movie = state.findMovieBySlug($routeParams['slug']);
}

var module = angular.module('movieApp', [], function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: 'list.html',
    controller: moviesController
  });
  $routeProvider.when('/new', {
    templateUrl: 'list.html',
    controller: newMovieController
  });
  $routeProvider.when('/:slug', {
    templateUrl: 'show.html',
    controller: movieController
  });
});

module.directive('fadeIn', function() {
  return function(scope, element, attrs) {
    var movie = scope.movie;
    if (movie.isNew) {
      $(element).hide().fadeIn('slow', function() { movie.isNew = false});
    }
   };
});

module.service('state', function() {
  return {
    'movies': [],
    'findMovieBySlug': function (slug) {
        for (movieIndex in this.movies) {
          var movie = this.movies[movieIndex];
          if (movie.slug() == slug) return movie;
        }
    },
    'populate': function() {
      this['movies'] = [avengers, harryPotter];
    }
  }
});
