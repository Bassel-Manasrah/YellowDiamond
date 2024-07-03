import * as SQLite from "expo-sqlite/next";

class RecommendationStorageService {
  constructor() {
    this.db = null;
    this.movieDB = null;
    this.songDB = null;
  }

  async openAsync() {
    // this.db = await SQLite.openDatabaseAsync("recommendations");
    // await this.db.execAsync(
    //   "CREATE TABLE IF NOT EXISTS recommendations (id TEXT PRIMARY KEY, name TEXT, year INTEGER, imgUrl TEXT, previewUrl TEXT)"
    // );

    this.movieDB = await SQLite.openDatabaseAsync("movies");
    await this.movieDB.execAsync(
      "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT, year INTEGER, imgUrl TEXT, actionUrl TEXT, overview TEXT, popularity INTEGER)"
    );

    this.songDB = await SQLite.openDatabaseAsync("songs");
    await this.songDB.execAsync(
      "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, name TEXT, year INTEGER, imgUrl TEXT, artist TEXT, previewUrl TEXT, actionUrl TEXT, popularity INTEGER)"
    );

    console.log(`RecommendationStorageService: opened database`);
  }

  async closeAsync() {
    // await this.db.closeAsync();

    await this.movieDB.closeAsync();
    await this.songDB.closeAsync();

    console.log(`messageStorageService: closed database`);
  }

  async getRecommendationsAsync() {
    const recommendations = await this.db.getAllAsync(
      "SELECT * FROM recommendations"
    );

    return recommendations;
  }

  async getRecommendationByIdAsync(id) {
    const query = `
    SELECT *
    FROM items
    WHERE id = ?
  `;

    const movies = await this.movieDB.getAllAsync(query, id);
    const songs = await this.songDB.getAllAsync(query, id);
    const results = [...movies, ...songs];
    const result = results[0];

    if (!result) return null;
    result.type = movies.length > 0 ? "movie" : "song";

    return result;
  }

  async addRecommendationAsync(recommendation) {
    let db;
    if (recommendation.type === "movie") db = this.movieDB;
    else db = this.songDB;

    delete recommendation.type;
    console.log("recom", recommendation);

    const keys = Object.keys(recommendation);
    const values = Object.values(recommendation);

    const { lastInsertRowId } = await db.runAsync(
      `INSERT INTO items (${keys.join(",")}) VALUES (${keys
        .map((key) => "?")
        .join(",")})`,
      ...values
    );
    console.log(
      `messageStorageService: added recommendation (id: ${lastInsertRowId})`
    );

    return lastInsertRowId;
  }

  // async addRecommendationAsync(recommendation, type) {
  //   let db;
  //   if (type === this.TYPE_MOVIE) db = this.movieDB;
  //   else db = this.songDB;

  //   const { lastInsertRowId } = await db.runAsync(
  //     "INSERT INTO items (id, name, year, imgUrl, previewUrl) VALUES (?, ?, ?, ?, ?)",
  //     id,
  //     name,
  //     year,
  //     imgUrl
  //   );

  //   console.log(
  //     `messageStorageService: added recommendation (id: ${lastInsertRowId})`
  //   );

  //   return lastInsertRowId;
  // }
}

const recommendationStorageService = new RecommendationStorageService();
export default recommendationStorageService;
