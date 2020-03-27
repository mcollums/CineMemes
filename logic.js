// Comment everything you code!!

var keyword = "";
var mainPagePosters = ["The Avengers", "The Lion King", "Crazy Rich Asians", "The Princess Bride", "American Psycho", "Parasite"];
var currentFile = window.location.pathname.split("/").pop();


// This is the Toaster Function
function showToast(text) {
    var x = document.getElementById("toast");
    x.classList.add("show");
    x.innerHTML = 'Please Enter a Movie';
    setTimeout(function () {
        x.classList.remove("show");
    }, 3000);
}

//This function searches omdb with the keyword and populates the results page
function searchResult() {
    var movieKey = "eb91f19f";
    var resultURL = "https://www.omdbapi.com/?apikey=" + movieKey + "&s=" + keyword + "&plot=full&r=json";

    $.ajax({
        url: resultURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var search = response.Search;
        for (var j = 0; j < search.length; j++) {

            var newRow = $("<div>");
            var newTitle = $("<h4>");
            newTitle.addClass("search-result");
            newTitle.attr("data-movie" , response.Search[j].Title);
            newTitle.text(response.Search[j].Title + " (" + response.Search[j].Year + ")");

            newRow.append(newTitle);
            $("#search-content-div").append(newRow);
        }
    })
}


// This function searches OMDB for the keyword
function omdbSearch() {
    //OMDB Api Key
    var movieKey = "eb91f19f";
    var searchURL = "https://www.omdbapi.com/?apikey=" + movieKey + "&t=" + keyword + "&plot=full&r=json";

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var poster = response.Poster;
        console.log(poster);
        var moviePoster = $("#movie-poster");
        moviePoster.attr("src", poster);


        var title = response.Title;
        $("#movie-title").text("Title: " + title);

        var actors = response.Actors;
        $("#movie-actors").text("Actors: " + actors);

        var year = response.Year;
        $("#movie-year").text("Year: " + year);

        var plot = response.Plot;
        $("#movie-plot").text("Plot: " + plot);
    });
}


// Function that searches Reddit for keyword
function redditSearch() {

    if (keyword.includes(":")) {
        keyword = keyword.split(":").shift();
    } 

    var redditURL = "https://www.reddit.com/search.json?&sort=top&limit=400&t=all&q=" + keyword;

    $.ajax({
        url: redditURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.data.children);
        displayReddit(response);
    });
}

//This function displays the reddit results
function displayReddit(response) {

    // //This variable keeps track of the # of posts we've added
    var postCount = 0;

    //Run this function that will append the reddit image, link, and title to the page if they're within our conditions
    response.data.children.forEach(function (post) {

        if (postCount <= 9) {

            //Function checks to see if the subreddit each post is from is also in our acceptedSubreddits array
            function isCorrectSubreddit(subreddit) {
                //There are the subreddits we want results from
                var acceptedSubreddits = ["funny", "movies", "MovieDetails", "dankmemes", "memes", "marvelstudios", "BeAmazed", "YMS", "GetMotivated"];

                //If the json object is from one of the subreddits we want...
                if (acceptedSubreddits.includes(subreddit)) {
                    return true;
                } else {
                    return false;
                }
            }

            //This variable is set to a boolean value dependent on whether or not the post is from an accepted subreddit
            var goodSubreddit = isCorrectSubreddit(post.data.subreddit);

            //This function checks if the url of the post is an image
            function isUrlImage(url) {
                //make sure we remove any nasty GET params 
                url = url.split('?')[0];
                //moving on, split the uri into parts that had dots before them
                var parts = url.split('.');
                //get the last part ( should be the extension )
                var extension = parts[parts.length - 1];
                //define some image types to test against
                var imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp'];
                //check if the extension matches anything in the list.
                if (imageTypes.indexOf(extension) !== -1) {
                    return true;
                } else {
                    return false;
                }
            }

            //Here we call the isUriImage function for each of the posts' urls
            var isImage = isUrlImage(post.data.url);

            //While the url is an image and the post count is less than 9...
            if (isImage && goodSubreddit) {
                // create these variables using the still image and gif urls
                var title = post.data.title;
                var subreddit = post.data.subreddit;
                var imgURL = post.data.url;

                console.log("Title: " + title + "  Subreddit: " + subreddit + "  URL: " + imgURL);

                // makes new image tag for each gif and adds the following attr and class
                var image = $("<img>");
                image.attr("src", imgURL);
                image.addClass("reddit-img");

                //New div and paragraph information
                var newp = $("<p class='post-tag'> Title: " + title + "<br></br> Subreddit: " + subreddit + "</p>");
                var newa = $("<a href=" + imgURL + ">")
                var newDiv = $("<div class='col-lg-6 reddit-result-col'>");


                // Append(image) to reddit results row
                $("#reddit-results-row").append(newa);
                $(newa).append(newDiv);
                $(newDiv).append(image);
                $(newDiv).append(newp);
                postCount++
                console.log("Subreddit = " + post.data.subreddit);
            }
        } else {
            return;
        }
    })
}


//This if statement is looking to see if there's a query selector in the page url everytime the javascript is called in our html
if (currentFile.includes("movie.html")) {
    //Empties the row where the reddit posts are populated to before running anything
    $("#reddit-results-row").empty();

    //grab the value after the "=" of the url
    //set this value as the keyword
    keyword = window.location.search.split("=")[1];

    //Call the omdb function
    //Call the reddit function
    omdbSearch();
    redditSearch();

}
//If we're already on the results page...
else if (currentFile.includes("results.html")) {
    //Take the keyword after the "=" in the query selector section of the URL
    keyword = window.location.search.split("=")[1];
    //Run the search result function
    searchResult();
}


//This function takes the mainPagePosters array and puts them on the index.html page
for (var i = 0; i < mainPagePosters.length; i++) {
    //OMDB api key
    var movieKey = "eb91f19f";
    //OMDB url to search for exact title matches
    var searchUrl = "https://www.omdbapi.com/?apikey=" + movieKey + "&t=" + mainPagePosters[i] + "&plot=full&r=json";

    $.ajax({
        url: searchUrl,
        method: "GET"
    }).then(function (response) {

        //Creating link element that will go to the movies page with the title in the url
        var poster = $("<a>");
        poster.attr("href", "movie.html?title=" + response.Title);
        poster.attr("id", response.Title);

        //Creating an image element that we will append to the link element
        var posterImg = $("<img>");
        posterImg.attr("src", response.Poster);
        posterImg.attr("data-poster", response.Title);
        posterImg.addClass("poster-style");
        poster.append(posterImg);

        //Append poster image and link to the div
        $("#main-body").append(poster);

    });
}

// When the Search Button is clicked...
$("#submit-btn").on("click", function () {
    event.preventDefault();

    //keyword is set to the value of the search input box
    keyword = $("#search-field").val().trim();

    // If the user input is empty, blank spaces or undefined...
    if (keyword === " " || keyword === undefined || keyword === "") {
        //Popup a Toast that requests the user enter a keyword
        showToast();
    } 
        //If the user input contains a !empty string...
        else {
        //Replace any blank spaces with %20 signs
        keyword = keyword.replace(" ", "%20");

        //Take the user to the results page, with their keyword in the query selector of the url
        window.location.href = 'results.html?title=' + keyword;
    }

});

// After clicking a movie result on the results.html page...
$(document).on("click", ".search-result", function () {
    //Keyword is set to the text of that selection
    var movie = ($(this).attr("data-movie"));
    console.log(movie);
    //User is taken to the movie page, with the movie title in the query selector
    window.location.href = 'movie.html?title=' + movie;
})

// Wrap every letter in a span
$('.ml11 .letters').each(function(){
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });

// makes the top suggestion text pop up letter by letter
  anime.timeline()
    .add({
      targets: '.ml11 .line',
      scaleY: [0,1],
      opacity: [0.5,1],
      easing: "easeOutExpo",
      duration: 1500
    })
    .add({
      targets: '.ml11 .line',
      translateX: [0,$(".ml11 .letters").width()],
      easing: "easeOutExpo",
      duration: 700,
      delay: 400
    }).add({
      targets: '.ml11 .letter',
      opacity: [0,1],
      easing: "easeOutExpo",
      duration: 600,
      offset: '-=775',
      delay: function(el, i) {
        return 34 * (i+1)
      }
    }).add({
      targets: '.ml11',
      opacity: 1,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });

// Wrap every letter in a span
$('.ml16').each(function(){
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });
  
  anime.timeline()
    .add({
      targets: '.ml16 .letter',
      translateY: [-100,0],
      easing: "easeOutExpo",
      duration: 1400,
      delay: function(el, i) {
        return 30 * i;
      }
    }).add({
      targets: '.ml16',
      opacity: 1,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });


