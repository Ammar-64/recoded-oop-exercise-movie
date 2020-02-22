class App {
    static run() {
      // Call a method in APIService to fetch current movies
      // Call renderMovies method
      APIService.fetchMovies()
      .then(movies => HomePage.renderMovies(movies))
  
      // APIService.fetchMovie(534)
      //   .then(movie => {
      //     // add call to fetchActors, passing movie
      //     MoviePage.renderMovieSection(movie)
      //     APIService.fetchActors(movie)
      //       .then(actors => {
      //         console.log(actors);
      //         MoviePage.renderActorsSection(actors)
      //     })
      //   })
    }
  }
  
  class APIService {
  
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3'  //https://api.themoviedb.org/3/movie/${movieId}
                                                        //https://api.themoviedb.org/3/movie/${movieId}/credits
  
    // write a method to fetch current movies
    // Use fetchActors as starter code
    static fetchMovies() {
      // write code to fetch the movies 
      const url = APIService._constructUrl(`movie/now_playing`)
      return fetch(url)
        .then(res => res.json())
        .then(json => json.results.map(movie => new Movie(movie))
    )}
  
    static fetchMovie(movieId) {
      const url = APIService._constructUrl(`movie/${movieId}`)
      return fetch(url)
        .then(res => res.json())
        .then(json => new Movie(json))
    }
  
    static fetchActors(movie) {
      // write code to fetch the actors 
      const url = APIService._constructUrl(`movie/${movie.id}/credits`)
      return fetch(url)
        .then(res => res.json())
        .then(json => json.cast.slice(0,4).map(actor => new Actor(actor)))
    }
  
    static  _constructUrl(path) {
      return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
    }
  }
  
  class HomePage {
    //create renderMovies method
    static container = document.getElementById('container');
    static renderMovies(movies) {
      movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        const movieImage = document.createElement("img");
        movieImage.src = `${movie.backdropUrl}`;
        const movieTitle = document.createElement("h3");
        movieTitle.textContent = `${movie.title}`;
        movieImage.addEventListener("click", function() {
          Movies.run(movie)
        });
  
  
        movieDiv.appendChild(movieTitle);
        movieDiv.appendChild(movieImage);
        this.container.appendChild(movieDiv);
      })
    }
  }
  
  class Movies {
      static run(movie) {
        APIService.fetchMovie(movie.id)
        .then(movie => {
          // add call to fetchActors, passing movie
          MoviePage.renderMovieSection(movie)
          APIService.fetchActors(movie)
            .then(actors => {
              console.log(actors);
              MoviePage.renderActorsSection(actors)
          })
        })
      }
  }
  
  class MoviePage {
    // Change name to MoviePage
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
      MovieSection.renderMovie(movie)
    }
    static renderActorsSection(movie) {
      ActorsSection.renderActors(movie)
    }
  }
  
  class MovieSection {
    static renderMovie(movie) {
      MoviePage.container.innerHTML = `
        <div class="row">
          <div class="col-md-4">
            <img id="movie-backdrop" src=${movie.backdropUrl}> 
          </div>
          <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date">${movie.releaseDate}</p>
            <p id="movie-runtime">${movie.runtime}</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
          </div>
        </div>
        <h3>Actors:</h3>
      `
    }
  
  }
  
  class ActorsSection {
    static actorsList = document.getElementById('actors');
  
    static renderActors(actors) {
      // add code to render Actors
      // Questions: 
      //    how do we handle selecting the first four?
      //    how do we handle rendering the individual actors?
      const actorsContainer = document.createElement('ul');
      actorsContainer.setAttribute('class', "list-unstyled")
      actorsContainer.setAttribute('id', 'actors');
      MoviePage.container.appendChild(actorsContainer);
        actors.forEach(actor => this.renderActor(actor,actorsContainer));
    }
  
    static renderActor(actor, actorsContainer) {
      actorsContainer.insertAdjacentHTML('beforeend', `
        <li class="col-md-3">
          <div class="row">
            <img src="${actor.profilePath}"/>
          </div>
          <div class="row">
            <h3>${actor.name}</h3>
          </div>
        </li>
      `)  
    }
  }
  
  class Actor {
    static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
  
    constructor(json) {
      //add code to create Actor
      this.name = json.name
      this.profilePath = Actor.PROFILE_BASE_URL + json.profile_path 
    }
  }
  
  class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
  
    constructor(json) {
      
      this.id = json.id
      this.title = json.title
      this.releaseDate = json.release_date
      this.runtime = json.runtime + " minutes"
      this.overview = json.overview
      this.backdropPath = json.backdrop_path
    }
  
    get backdropUrl() {
      return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : ""
    }
  }
  
  document.addEventListener("DOMContentLoaded", App.run);
  