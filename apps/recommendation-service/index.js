import express from "express";
import { MongoClient } from "mongodb";
import songsApiWrapper from "./utils/songsApiWrapper.js";
import moviesApiWrapper from "./utils/moviesApiWrapper.js";
import pickObvious from "./utils/pickObvious.js";

const dbUrl = "mongodb://localhost:27017/movies";
const client = new MongoClient(dbUrl);

const app = express();
const port = process.env.PORT || 3001;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmQ5MGM1YTRmOGY1MzljNmVkMDkwOWNhNTA2MzkyZCIsInN1YiI6IjY1ZTRlMTlkZjcwNmRlMDE2M2M4OTMyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MfgZb_sSu2AhZj1QbwlCU82kIP3uK9Q7ImjXvXaNxrQ",
  },
};

app.get("/", async (req, res) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=oppenheimer&include_adult=false&language=en-US&page=1`;
  const fetched = await fetch(url, options);
  const json = await fetched.json();
  console.log("here!");
  res.send(json.results);
});

app.get("/movie/:id", async (req, res) => {
  const id = req.params.id;
  const includeTags = req.query.tags ? parseBoolean(req.query.tags) : false;

  const movie = await moviesApiWrapper.getMovieByIdAsync(id, includeTags);
  console.log("movie", movie);
  res.json(movie);
});

app.get("/songAudioFeatures/:id", async (req, res) => {
  const id = req.params.id;

  const song = await songsApiWrapper.getSongAudioFeatures(id);
  console.log("song", song);
  res.json(song);
});

app.get("/recommendation/:id", async (req, res) => {
  const id = req.params.id;

  let found;
  if (moviesApiWrapper.isMovieId(id)) {
    found = await moviesApiWrapper.findByIdAsync(id);
  } else {
    found = await songsApiWrapper.findByIdAsync(id);
  }

  res.json(found);
});

const parseBoolean = (booleanString) => {
  if (booleanString === "true") return true;
  else return false;
};

app.get("/search", async (req, res) => {
  const name = req.query.name;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const obvious = req.query.obvious ? parseBoolean(req.query.obvious) : true;
  const type = req.query.type || "all";

  if (!name) return res.sendStatus(400);

  let recoms = [];

  if (type === "all" || type === "movie") {
    const movies = await moviesApiWrapper.findAsync(name, 10);
    if (movies) recoms.push(...movies);
  }

  // if (type === "all" || type === "song") {
  //   const songs = await songsApiWrapper.findAsync(name, 10);
  //   if (songs) recoms.push(...songs);
  // }

  recoms = recoms.sort((a, b) => b.popularity - a.popularity);
  recoms = recoms.slice(0, limit);

  if (obvious) recoms = pickObvious(recoms);

  res.json(recoms);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
