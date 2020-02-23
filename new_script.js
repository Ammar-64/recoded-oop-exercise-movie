const TMDB_BASE_URL =   'https://api.themoviedb.org/3'  
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'


class App {
    static run(){
        
        APIService.fetchNowPlaying()
            .then(movie =>{
                movie.map(el => RenderPages.renderNowPlayingMovies(el) )
            })
        APIService.fetchAllGenres()
        .then(json => {
            this.movieGenres=document.getElementsByClassName("genres");
            for (let i of this.movieGenres){
                this.idToNameGenres =i.innerText.slice(7).split(",").map(el=> parseInt(el))
                i.innerText=" "
                for (let t of this.idToNameGenres){
                    for (let j of json){
                        if (t===j.id){
                            i.textContent += ` ${j.name}`
                        }
                    }   
                }
            }
        }) 
        
        
    }

}

class RenderPages{
    static container = document.getElementById("container")

    static renderMovie(movie){
       
        RenderPages.container.innerHTML=`
        <div class="row">
            <div class="col-md-4">
                <img class="movie-backdrop" src=${movie.backdrop}> 
            </div>
            <div class="col-md-8">
                <input type="text" id="searchInput" placeholder="Look for movie..">
                <input type="button" id="searchBtn" value="Find">
                <h3 id="movie-title"><b>Title:</b> ${movie.title}</h3>
                <p id="genres"><b>Genres:</b> ${movie.genres}</p>
                <p id="movie-release-date"><b>Release Date:</b> ${movie.releaseDate}</p>
                <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime}</p>
                <p><b>Company:</b> ${movie.company}</p>
                <p><b>Country:</b> ${movie.country}</p>
                <h3>Overview:</h3>                
                <p class="np-movie-overview">${movie.overview}</p>            
            </div>
        </div>
        <h3>Actors:</h3>  
        <ul id="listActor"></ul>     
        `  
        
        this.searcButton=document.getElementById("searchBtn")
        
        this.searcButton.addEventListener("click",function(){
            this.searcText=document.getElementById("searchInput").value
            this.searcNumber=parseInt(this.searcText)
            RenderPages.container.innerHTML=" "
            APIService.fetchMovie(this.searcNumber)
                .then(movie => RenderPages.renderMovie(movie))
        })  

        this.actorsContainer = document.getElementById('listActor');
        this.actorsContainer.style.listStyle="none"
        RenderPages.container.appendChild(this.actorsContainer)
        APIService.fetchActors(movie.id)
        .then(actors => {
            actors.map(actor =>
                this.actorsContainer.innerHTML += `
                <li class="col-md-3">
                    <div class="row">
                    <img src="${actor.profilePath}"/>
                    </div>
                    <div class="row">
                    <h3>${actor.name}</h3>
                    </div>
                </li>
            `            
            )
        })
    }

    static renderNowPlayingMovies(movie){
        this.img=document.getElementsByClassName("movie-backdrop");
        RenderPages.container.innerHTML+=`
        <div class="row">
            <div class="col-md-4">
                <img id="${movie.id}" class="np movie-backdrop" src=${movie.backdrop}> 
            </div>
            <div class="np col-md-8">
                <h3 id="movie-title"><b>Title:</b> ${movie.title}</h3>
                <p class="genres"><b>Genres:</b>${movie.genre_ids} </p>
                <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
                <h3>Overview:</h3>
                <p id="movie-overview"><b>Overview</b> ${movie.overview}</p>            
            </div>
        </div>
        <hr>
         `
        for (let element of this.img){
            element.addEventListener("click",function(){
                RenderPages.container.innerHTML=" "
                APIService.fetchMovie(element.id)
                    .then(movie => RenderPages.renderMovie(movie) )
            })
        }
    }
}

class APIService{
    
    static fetchMovie(movieId){
        const url = APIService._constructUrl(`movie/${movieId}`)
        return fetch(url)
            .then(res => res.json())
            .then(json=> new Movie(json))
    }
    static fetchNowPlaying(){
        const url=APIService._constructUrl(`movie/now_playing`)
        return fetch(url)
            .then(res => res.json())
            .then(json => json.results.map(el => new NowPlayingMovies(el)))
    }
    static fetchActors(movieId) {
        // write code to fetch the actors 
        const url = APIService._constructUrl(`movie/${movieId}/credits`)
        return fetch(url)
          .then(res => res.json())
          .then(json => json.cast.slice(0,4).map(actor => new Actors(actor)))
      }
    

    static  fetchAllGenres(){
        const url = APIService._constructUrl(`genre/movie/list`)
        return fetch(url)
            .then(res => res.json())
            .then(json => json.genres)        
    }

    
    static _constructUrl (path){
        return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
    } 
}



class NowPlayingMovies{
    
    constructor(json){
        this.id=json.id
        this.title=json.title
        this.overview=json.overview.split(" ").slice(0,25).join(" ")+" ..."
        this.release_date=json.release_date
        this.backdrop =BACKDROP_BASE_URL+ json.backdrop_path
        this.genre_ids = json.genre_ids
        
    }  
}

class Movie{
    constructor(json){
        this.id=json.id
        this.title=json.title
        this.overview=json.overview
        this.backdrop=BACKDROP_BASE_URL+json.backdrop_path
        this.company = json.production_companies.map(json => json["name"]).join("-")
        this.country = json.production_countries.map(json => json["name"]).join("-")
        this.releaseDate= json.release_date
        this.runtime=json.runtime
        this.genres = json.genres.map(json => json["name"]).join("-")
    }
}

class Actors {
    
    constructor(json) {
     
      this.name = json.name
      this.profilePath = PROFILE_BASE_URL + json.profile_path 
    }
  }

document.addEventListener("DOMContentLoaded",App.run)