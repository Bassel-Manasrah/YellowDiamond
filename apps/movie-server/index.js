import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.APIKEY}`,
  },
};

const buildMovieObject = (movieDetails) => {
  const title = movieDetails.title;
  const imgUrl = `https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`;
  const year = parseInt(movieDetails.release_date.split("-")[0]);
  const url = `https://www.themoviedb.org/movie/${movieDetails.id}`;
  return { title, imgUrl, year, url };
};

const fetchTrailerUrlAsync = async (movieID) => {
  // build the url for fetching trailer url
  const url = `https://api.themoviedb.org/3/movie/${movieID}/videos`;

  // fetch reponse from url
  const response = await fetch(url, options);

  // parse response to json
  const videos = (await response.json()).results;

  // find the official trailer video on youtube
  const video = videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official &&
      video.key
  );

  if (video) {
    // assemble the trailer url
    const trailerUrl = `https://www.youtube.com/watch?v=${video.key}`;

    // return trailer url
    return trailerUrl;
  } else {
    return null;
  }
};

app.get("/searchMovie", async (req, res) => {
  // extract the title from the request
  const title = req.query.title;

  // build the url for fetching movies
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=1`;

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    let moviesDetails = json.results.slice(0, 3);

    const movies = moviesDetails.map(buildMovieObject);
    res.send(movies);
  } catch (error) {
    console.error(error);
  }
});

app.get("/movieTrailer/:movieID", async (req, res) => {
  console.log("movie trailer!");

  const movieID = req.params.movieID;

  const trailerUrl = await fetchTrailerUrlAsync(movieID);

  res.send(trailerUrl);
});

app.get("/movie/:movieID", async (req, res) => {
  // extract the movie id
  const movieID = req.params.movieID;

  // build the url for fetching movie details
  const url = `https://api.themoviedb.org/3/movie/${movieID}`;

  // fetch movie details and trailer url
  const [movieDetailsResponse, trailerUrl] = await Promise.all([
    fetch(url, options),
    fetchTrailerUrlAsync(movieID),
  ]);

  // parse the response to json
  const movieDetails = await movieDetailsResponse.json();

  // assemble the movie object
  const movie = {
    ...buildMovieObject(movieDetails),
    overview: movieDetails.overview,
    actionUrl: trailerUrl,
  };

  // send the movie object
  res.send(movie);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
