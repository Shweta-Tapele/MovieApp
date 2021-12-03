
//API and API key will be taken from The Movie Database(TMDB)
const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const search = document.getElementById("search");

//images of some quotes
const quotes = [
  "https://www.brainyquote.com/photos_tr/en/t/timburton/179842/timburton1-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/g/georgelucas/462198/georgelucas1-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/o/orsonwelles/162035/orsonwelles4-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/g/georgelucas/137492/georgelucas3-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/a/alfredhitchcock/100223/alfredhitchcock1-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/o/oliverstone/310994/oliverstone4-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/j/jeffbridges/318882/jeffbridges2-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/t/terriwindling/230068/terriwindling3-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/m/maryschmich/100449/maryschmich1-2x.jpg",
  "https://www.brainyquote.com/photos_tr/en/a/alfredhitchcock/131108/alfredhitchcock1-2x.jpg",
];


/* Used Jquery for two side sliders
Here using 2 sliders - YearsRange & RatingsRange
*/
$(function () {
  $("#years-range").slider({
    range: true,
    min: 1980,
    max: new Date().getFullYear(),
    values: [2000, new Date().getFullYear()],
    slide: function (event, ui) {
      $("#years").val(ui.values[0] + " - " + ui.values[1]);
    },
  });
  $("#years").val(
    $("#years-range").slider("values", 0) +
      " - " +
      $("#years-range").slider("values", 1)
  );

  $("#ratings-range").slider({
    range: true,
    min: 0,
    max: 10,
    step: 0.1,
    values: [6, 10],
    slide: function (event, ui) {
      $("#ratings").val(ui.values[0] + " - " + ui.values[1]);
    },
  });
  $("#ratings").val(
    $("#ratings-range").slider("values", 0) +
      " - " +
      $("#ratings-range").slider("values", 1)
  );
});


/*Brings data of movies with param values selcted using above sliders */
function getMovies(yearLower, yearUpper, ratingLower, ratingUpper, page) {
  lastUrl = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&release_date.gte=${yearLower}&release_date.lte=${yearUpper}&vote_average.gte=${ratingLower}&vote_average.lte=${ratingUpper}&with_watch_monetization_types=flatrate`;
  fetch(lastUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showBarChart(data);
        showPieChart(data);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

      } else {
        console.log("No results found");
      }
    });
}

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

search.addEventListener("click", () => {
  document.getElementById("quotes").style.display = "none";
  document.getElementById("charts").style.display = "none";
  document.getElementById("chartContent").style.display = "block";
  let yearLower = $("#years-range").slider("values", 0);
  let yearUpper = $("#years-range").slider("values", 1);
  let ratingLower = $("#ratings-range").slider("values", 0);
  let ratingUpper = $("#ratings-range").slider("values", 1);

  getMovies(yearLower, yearUpper, ratingLower, ratingUpper, 1);
});

function pageCall(page) {
  let yearLower = $("#years-range").slider("values", 0);
  let yearUpper = $("#years-range").slider("values", 1);
  let ratingLower = $("#ratings-range").slider("values", 0);
  let ratingUpper = $("#ratings-range").slider("values", 1);
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(yearLower, yearUpper, ratingLower, ratingUpper, page);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(yearLower, yearUpper, ratingLower, ratingUpper, page);
  }
}
var barChart;
var pieChart;

/*Used to plot barGraph */
function showBarChart(input) {
  if (barChart) {
    barChart.destroy();
  }
  const vals = {
    labels: input.results.map((a) => a.title),
    datasets: [
      {
        label: "Vote Count",
        data: input.results.map((a) => a.vote_count),
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: vals,
    maintainAspectRatio: true,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  var grapharea = document.getElementById("barChart").getContext("2d");
  barChart = new Chart(grapharea, config);
}

/*This function plots PieChart */
function showPieChart(input) {
  if (pieChart) {
    pieChart.destroy();
  }
  const vals = {
    labels: input.results.map((a) => a.title),
    datasets: [
      {
        label: "Popularity",
        data: input.results.map((a) => a.popularity),
        backgroundColor: [
          "#F0F8FF",
          "#FAEBD7",
          "#00FFFF",
          "#7FFFD4",
          "#ffff99",
          "#ff4da6",
          "#8080ff",
          "#001f3f",
          "#d279a6",
          "#4d4dff",
          "#4dffdb",
          "#ccff33",
          "#ff9933",
          "#ff4d4d",
          "#ff80ff",
          "#ff5c33",
          "#b3ff66",
          "#80b3ff",
          "#ad33ff",
          "#5353c6",
          "#ac3939",
        ],
        borderColor: ["rgb(255, 255, 255)"],
        hoverOffset: 2,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: vals,
    maintainAspectRatio: true,
  };
  var grapharea = document.getElementById("pieChart").getContext("2d");
  pieChart = new Chart(grapharea, config);
}


/*Intial info and quotes display
These will be hidden once search button clicked */
document.getElementById("charts").innerHTML = `
<div class="alert alert-warning alert-dismissible fade show" role="alert">
<h4 class="alert-heading"><strong>Holy guacamole!</strong> You should check in on some of those above fields.</h4>
<hr>
<p class="mb-0">Also please take a look at below quote &#128512;</p>
</div>
`;
var quoteLink = quotes[Math.floor(Math.random() * quotes.length)];

document.getElementById("quotes").innerHTML = `
<img src="${quoteLink}" alt="quote" width = "100%" height = "50%">
`;
document.getElementById("chartContent").style.display = "none";
