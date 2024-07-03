import axios from "axios";

const pattern = /^https:\/\/www.themoviedb.org\/movie\/(\d+)[^0-9]*/;

class MovieService {
  async searchByTitleAsync(title) {
    const config = {
      params: { title },
    };

    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_MOVIE_HOSTNAME}/searchMovie`,
        config
      );

      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  isSuggestion(url) {
    return pattern.test(url);
  }

  async getSuggestionAsync(url) {
    // extract the id form url
    const id = url.match(pattern)[1];

    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_MOVIE_HOSTNAME}/movie/${id}`
      );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  async getSuggestionActionUrlAsync(url) {
    // extract the id form url
    const id = url.match(pattern)[1];

    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_MOVIE_HOSTNAME}/movieTrailer/${id}`
      );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new MovieService();
