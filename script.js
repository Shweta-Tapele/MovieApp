
//API and API key will be taken from The Movie Database(TMDB)
const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";

//API which extract popular movies
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

// all the genres of movies taken from API responses
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("formId");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var selectedGenre = [];
setGenre();

//function to select particular genre of movies
function setGenre() {
  tagsEl.innerHTML = "";
  
  //loop through each of the genre
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

// highlight the selected genres of movies
function highlightSelection() {
  const tags = document.querySelectorAll(".tag");

  // to remove the selected genres of movies
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add("highlight");
    });
  }
}

// clear button to clear all the selected genre of movies
function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      //reset selected genre of movies
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.append(clear);
  }
}

//call getMovies function
getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;

  //fetch the data from API
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;
        /*check if its first page, if its first page then disable(then previous page is not required to be loaded)*/
        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
          /*check if its a last page, if its a last page then disable (then next page is not required to be loaded)*/
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        //scroll up if it moves to previous or next page
        tagsEl.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

//pass extracted data from API to this function
function showMovies(data) {
  main.innerHTML = "";

  //loop over each movie
  data.forEach((movie) => {

    //Title,poster_path,vote_average,overview,id are taken from response of API
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
             <img src="${
               poster_path
                 ? IMG_URL + poster_path
                 : "http://via.placeholder.com/1080x1580"
             }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>

                
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNavMovie(movie);
    });
  });
}

const overlayContent = document.getElementById("overlay-content");

// Open when someone clicks on the span element
function openNavMovie(movie) {
  let id = movie.id;

  // fetch movie video details from API
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("nav").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;
            // if its youtube then take embed code from it for perticular movies
            if (site == "YouTube") {
              embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `);

              dots.push(`
              <span class="dot">${idx + 1}</span>
            `);
            }
          });

          var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join("")}
        <br/>

        <div class="dots">${dots.join("")}</div>
        
        `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
        }
      }
    });
}

//Close when someone clicks on the "x" symbol inside the overlay
function closeNavMovie() {
  document.getElementById("nav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
  let embedClasses = document.querySelectorAll(".embed");
  let dots = document.querySelectorAll(".dot");

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.add("hide");
      embedTag.classList.remove("show");
    }
  });

  dots.forEach((dot, indx) => {
    if (activeSlide == indx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

//left arrow for videos if there are any videos in left
leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }

  showVideos();
});

//right arrow to show if there is any videos in right
rightArrow.addEventListener("click", () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

// different colors for different ratings
function getColor(vote) {
  if (vote >= 8) {
    return "orange";
  } else if (vote >= 5) {
    return "green";
  } else {
    return "red";
  }
}

//search based on movie name
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

//if previous page is greate than zero then call prevPage function
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

//if there is next page then call nextPage function
next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

//to move page to next and previous pages
function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("sidebarr").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("sidebarr").style.marginLeft = "0";
}

//movies which are coming soon
const comingSoon = document.getElementById('comingSoon')
comingSoon.addEventListener('click', () => {
  var url = BASE_URL+`/movie/upcoming?${API_KEY}&language=en-US`
  getMovies(url)

})

//movies which are top rated
const topRated = document.getElementById('topRated')
topRated.addEventListener('click', () => {
  var url = BASE_URL+`/movie/top_rated?${API_KEY}&language=en-US`
  getMovies(url)
})

//movies which are now playing
const nowPlaying = document.getElementById('nowPlaying')
nowPlaying.addEventListener('click', () => {
  var url = BASE_URL+`/movie/now_playing?${API_KEY}&language=en-US`
  getMovies(url)
})


