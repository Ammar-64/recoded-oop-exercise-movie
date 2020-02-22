const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'
class App {
  static run() {
    APIService.fetchMovie(634)
      .then(movie => Page.renderMovie(movie))
    APIService.fetchActors(634)
      .then(actors => Page.renderActors(actors))
  }
}
class APIService {
  static fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json => new Movie(json))
  }
  static _constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
  }
  static fetchActors(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/credits`)
    return fetch(url)
      .then(res => res.json())
      .then(json => {
        let actorsArray = []
        for (let i = 0; i <= 3 && i < json.cast.length; i++) {
          let actor = new Actor(json.cast[i])
          actorsArray.push(actor)
        }
        return actorsArray
      })
  }
  static fetchActorsDetails(actorID) {
    const url = APIService._constructUrl(`person/${actorID}`)
    return fetch(url)
      .then(res => res.json())
      .then(obj => {
        console.log(new ActorDetails(obj));
        return new ActorDetails(obj)
      })
  }
}
class Page {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')
  static actorsSection = document.querySelector("#actors")
  static actorsDetailsSection = document.querySelector("#actor-details")
  static renderMovie(movie) {
    Page.backdrop.src = BACKDROP_BASE_URL + movie.backdropPath
    Page.title.innerText = movie.title
    Page.releaseDate.innerText = movie.releaseDate
    Page.runtime.innerText = movie.runtime + " minutes"
    Page.overview.innerText = movie.overview
  }
  static renderActorsDetails(actorDetails) {
    Page.actorsDetailsSection.innerHTML = `
    <li class = "card col-md-12 ">
    <img src="${actorDetails.profilePictureURL}" class="card-img-top" alt="${actorDetails.id}">
    <div class="card-body">
      <h5 class="card-title">${actorDetails.name}</h5> 
      <h3 class="card-text">${actorDetails.birth}</h3>
      <h3 class="card-text">${actorDetails.biography}</h3> 
    </div>
    </li>
    `
  }
  static renderActors(actors) {
    actors.forEach((actor, i) => {
      Page.actorsSection.insertAdjacentHTML("beforeend", `
        <li class = "card col-md-3 ">
            <img src="${actor.profilePictureURL}" class="card-img-top" alt="${actor.id}">
            <div class="card-body">
              <h5 class="card-title">${actor.name}</h5>
              <h3 class="card-text">${actor.character}</h3> 
            </div>
        </li>
      `)
      document.querySelector(`[alt="${actor.id}"]`).addEventListener("click", () => {
        APIService.fetchActorsDetails(actor.id)
          .then(actor => Page.renderActorsDetails(actor))
      })
    })
  }
}
class Actor {
  constructor(json) {
    this.id = json.id
    this.name = json.name
    this.character = json.character
    this.picPath = json.profile_path
  }
  get profilePictureURL() {
    return PROFILE_BASE_URL + this.picPath
  }
}
class ActorDetails extends Actor {
  constructor(json) {
    super(json)
    this.birth = json.birthday
    this.biography = json.biography
  }
}
class Movie {
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }
}
document.addEventListener("DOMContentLoaded", App.run);