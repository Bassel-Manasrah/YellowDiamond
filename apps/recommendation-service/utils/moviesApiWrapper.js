import fetch from "node-fetch";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmQ5MGM1YTRmOGY1MzljNmVkMDkwOWNhNTA2MzkyZCIsInN1YiI6IjY1ZTRlMTlkZjcwNmRlMDE2M2M4OTMyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MfgZb_sSu2AhZj1QbwlCU82kIP3uK9Q7ImjXvXaNxrQ",
  },
};

class MoviesApiWrapper {
  #normalizeMovie(movie) {
    let popularity;
    if (movie.popularity > 100)
      popularity = Math.floor(0.0375 * movie.popularity + 76.25);
    else popularity = Math.floor(0.7 * movie.popularity);

    popularity = popularity > 100 ? 100 : popularity;

    return {
      id: movie.id,
      name: movie.title,
      year: parseInt(movie.release_date?.split("-")[0]),
      imgUrl: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
      actionUrl: `https://www.themoviedb.org/movie/${movie.id}`,
      overview: movie.overview,
      genres: movie.genres ? movie.genres.map((genre) => genre.name) : [],
      popularity,
      type: "movie",
    };
  }

  async getMovieByIdAsync(id, includeTags) {
    console.log(`getMovieByIdAsync ${id} ${includeTags}`);

    let tags = [];
    if (includeTags) {
      const tagsUrl = `https://api.themoviedb.org/3/movie/${id}/keywords`;
      const tagsRes = await fetch(tagsUrl, options);
      const tagsJson = await tagsRes.json();
      tags = tagsJson.keywords?.map((keyword) => keyword.name);
    }

    const detailsUrl = `https://api.themoviedb.org/3/movie/${id}`;
    const detailsRes = await fetch(detailsUrl, options);
    const detailsJson = await detailsRes.json();
    const details = this.#normalizeMovie(detailsJson);

    return includeTags ? { ...details, tags } : details;
  }

  async findAsync(title, limit) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=1`;
    const res = await fetch(url, options);
    const json = await res.json();
    let movies = json.results.slice(0, limit);
    movies = movies.map(this.#normalizeMovie);
    return movies;
  }

  async findByIdAsync(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const res = await fetch(url, options);
    let movie = await res.json();
    movie = this.#normalizeMovie(movie);
    return movie;
  }

  async getMovieVector(id) {
    const movie = this.findByIdAsync(id);
    movie["genres"] = " ".join(movie["genres"]);
    movie["tags"] = " ".join(movie["tags"]);
    movie["dump"] =
      movie["genres"] + " " + movie["tags"] + " " + movie["overview"];
    movie["dump"] = preprocess(movie["dump"]);
    return movie_vectorizer.transform([movie["dump"]]).toarray();
  }

  isMovieId(id) {
    return /^\d+$/.test(id);
  }
}

export default new MoviesApiWrapper();
