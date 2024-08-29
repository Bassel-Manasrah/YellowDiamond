import axios from "axios";
import recommendationStorageService from "./RecommendationStorageService";

class RecommendationsFetchingService {
  constructor() {
    this.db = null;
  }

  isRecommendation(content) {
    return /^RECOMMENDATION\/[a-zA-Z0-9]+$/.test(content);
  }

  async searchAsync(name, limit = 3, type = "all", obvious = true) {
    const { data } = await axios.get(
      `http://${process.env.EXPO_PUBLIC_RECOMMENDATION_HOSTNAME}/search?name=${name}&limit=${limit}&type=${type}&obvious=${obvious}`
    );
    return data;
  }

  async fetchAsync(content) {
    console.log("fetchAsync");
    const id = content.split("/")[1];

    // check if it is already exists in the local storage
    await recommendationStorageService.openAsync();
    const recom = await recommendationStorageService.getRecommendationByIdAsync(
      id
    );
    if (recom) return recom;

    // otherwise we fetch it from the backend
    try {
      const { data } = await axios.get(
        `http://${process.env.EXPO_PUBLIC_RECOMMENDATION_HOSTNAME}/recommendation/${id}`
      );

      if (data.hasOwnProperty("genres")) {
        delete data.genres;
      }

      console.log(`adding ${data.name} to storage, ${recom}`);

      await recommendationStorageService.addRecommendationAsync(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

const recommendationsFetchingService = new RecommendationsFetchingService();
export default recommendationsFetchingService;
