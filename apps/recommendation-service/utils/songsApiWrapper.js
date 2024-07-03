import SpotifyWebApi from "spotify-web-api-node";

var spotifyApi = new SpotifyWebApi({
  clientId: "7e701abdfd66456e86e65bd5d028a52d",
  clientSecret: "b3aad8464d714f7baa199a683e1e0ec0",
  redirectUri: "http://localhost/",
});
let access_token;

class SongsApiWrapper {
  constructor() {
    this.#renewToken();
    setInterval(() => {
      this.#renewToken();
    }, 1000 * 60 * 30);
  }

  async #renewToken() {
    const data = await spotifyApi.clientCredentialsGrant();
    access_token = data.body["access_token"];
    spotifyApi.setAccessToken(access_token);
  }

  #normalizeSong(song) {
    return {
      id: song.id,
      name: song.name,
      artist: song.artists[0].name,
      year: song.album.release_date.split("-")[0],
      imgUrl: song.album.images[0].url,
      previewUrl: song.preview_url,
      actionUrl: song.external_urls.spotify,
      popularity: song.popularity,
      type: "song",
    };
  }

  #removeAttributes(obj, attributes) {
    attributes.forEach((attr) => delete obj[attr]);
    return obj;
  }

  async getSongAudioFeatures(id) {
    const data = await spotifyApi.getAudioFeaturesForTrack(id);
    const song = data.body;

    let attributesToRemove = [
      "analysis_url",
      "track_href",
      "uri",
      "id",
      "type",
    ];
    const obj = this.#removeAttributes(song, attributesToRemove);

    return obj;
  }

  async findAsync(title, limit) {
    try {
      const data = await spotifyApi.searchTracks(`track:${title}`, {
        limit,
        offset: 0,
      });
      let songs = data.body.tracks.items;
      songs = songs.map(this.#normalizeSong);

      return songs;
    } catch (error) {
      this.findAsync(title, limit);
    }
  }

  async findByIdAsync(id) {
    let song = (await spotifyApi.getTrack(id)).body;
    song = this.#normalizeSong(song);
    return song;
  }
}

export default new SongsApiWrapper();
