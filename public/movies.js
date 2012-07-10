window.App = new function() {
  this.movies = [];
  this.init = function(data) {
    this.movies.splice(0, this.movies.length);
    this.movies.push.apply(this.movies, this.getMovies(data['movies']));
  }
  this.getMovies = function(json) {
    var movies = [];
    for (i in json) {
      movies.push(new Movie(json[i]));
    }
    return movies;
  }
  this.findMovieBySlug = function (slug) {
    for (movieIndex in this.movies) {
      var movie = this.movies[movieIndex];
      if (movie.slug() == slug) return movie;
    }
  }
}

function Movie(attrs) {
  this.attrs = attrs;
  for (k in attrs) { this[k] = attrs[k]; }
  this.slug = function() {
    return this.name.toLowerCase().replace(/\s+/g,'-');
  }
  this.isNew = typeof(this.name) != 'string'
  this.toRuby = function() {
    var attrs = {
      'id': this.id,
      'name': this.name,
      'opening_weekend': this.openingWeekend,
      'total_gross': this.totalGross
    };
    return attrs
  }
  this.percentageOfTotal = function() {
    return Math.round(this.openingWeekend / this.totalGross * 100);
  }
}

function moviesController($scope, $routeParams, $location, $http) {
  $scope.movies = App.movies;
  $scope.populate = function() {
    $http.post('/populate').success(function(data) {
      App.init(data);
    });
  }
  if ($location.path() == '/new') {
    $scope.newMovie = new Movie;
  }
  $scope.submit = function() {
    if ($scope.form.$valid) {
      $http.post('/movies', $scope.newMovie.toRuby()).success(function(data) {
        App.init(data);
        App.findMovieBySlug($scope.newMovie.slug()).isNew = true;
        $location.path('/');
      });
    }
    else {
      $scope.form.$error['base'] = 'There was an error!'
    }
  }
}

function movieController($scope, $routeParams, $location, $http) {
  $scope.movie = App.findMovieBySlug($routeParams['slug']);
  $scope.delete = function() {
    $http.delete('/'+$scope.movie.id).success(function(data) {
      App.init(data);
      $location.path('/');
    });
  }
}

var module = angular.module('movieApp', [], function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: 'list.html',
    controller: moviesController
  });
  $routeProvider.when('/new', {
    templateUrl: 'list.html',
    controller: moviesController
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
