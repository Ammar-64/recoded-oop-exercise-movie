class App {
  static run() {
    
    APIService.fetchMovies()
    .then(movies => HomePage.renderMovies(movies))
    

        
  }
}

class APIService {

  static TMDB_BASE_URL = 'https://api.themoviedb.org/3'  
  static fetchMovies() {
    // write code to fetch the movies 
    const url = APIService._constructUrl(`movie/now_playing`)
    return fetch(url)
      .then(res => res.json())
      .then(json => {
        // console.log(json)
        return json.results.map(movie => new Movie(movie))
      })
  }

  static fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json =>new Movie(json))
        
  }

  static fetchActors(movie) {
    // write code to fetch the actors 
    const url = APIService._constructUrl(`movie/${movie.id}/credits`)
    return fetch(url)
      .then(res => res.json())
      .then(json => json.cast.slice(0,4).map(actor => new Actor(actor)))
  }

  static fetchActorsDetails(actorId){
    const url = APIService._constructUrl(`person/${actorId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json =>MovieSection.renderActorsDetails(new ActorDetails(json)))

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
     
      movieGenres.textContent =`${movie.genres}`
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
            // console.log(actors);
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
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Actors:</h3>
    `
  }

  static renderActorsDetails(actor){
    document.querySelector("body").innerHTML = `
    <div class="row">
    <div class="col-md-4">
      <img id="movie-backdrop" src=${actor.profilePath}> 
    </div>
    <div class="col-md-8">
      <h2 id="movie-title">${actor.name}</h2>
      <h3 id="movie-release-date">${actor.birth}</h3>
      <h3>Overview:</h3>
      <p id="movie-overview">${actor.biography}</p>
    </div>
  </div>
  <h3>Actors:</h3>
    `
  }

}

class ActorsSection {
  static actorsList = document.getElementById('actors');

  static renderActors(actors) {
   
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
          <img src="${actor.profilePath}" alt="${actor.id}"/>
        </div>
        <div class="row">
          <h3>${actor.name}</h3>
        </div>
      </li>
    `)
    document.querySelector(`[alt = "${actor.id}"]`).addEventListener("click",() =>{
      APIService.fetchActorsDetails(actor.id)
      .then(actor => ActorsSection.renderActor(actor))      
    })  
  }
}
 
class Actor {
  static PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'

  constructor(json) {
    //add code to create Actor
    this.id = json.id
    this.name = json.name
    this.profilePath = Actor.PROFILE_BASE_URL + json.profile_path 
  }
}


class ActorDetails extends Actor {
  constructor(json){
    super(json)
    this.birth = json.birthday
    this.biography = json.biography
  }
}


class Movie {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'

  constructor(json) {
    
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime + "minutes"
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
    
    this.genres="";
    for (const i in json.genres){
      this.genres+=` ${json.genres[i].name}`
    }
    
    
    
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : ""
  }
}


document.addEventListener("DOMContentLoaded", App.run);
