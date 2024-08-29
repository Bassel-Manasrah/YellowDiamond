import { useEffect, useState } from "react";
import messageStorageService from "../services/MessageStorageService";
import contactService from "../services/ContactService";
import recommendationsFetchingService from "../services/RecommendationFetchingService";

export default function useChatPreviews() {
  const [chatPreviews, setChatPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChatPreviews = async () => {
    previews = await messageStorageService.getChatPreviewsAsync();

    previews = await Promise.all(
      previews.map(async (preview) => {
        const isRecommendation =
          recommendationsFetchingService.isRecommendation(preview.lastMessage);

        if (!isRecommendation) return preview;

        console.log("fetchChatPreviews call fetchAsync");
        // const recommendation = await recommendationsFetchingService.fetchAsync(
        //   preview.lastMessage
        // );

        // console.log(`recommendation: ${recommendation.name}`);

        return { ...preview, lastMessage: "* recommendation *" };
      })
    );
    previews = await Promise.all(
      previews.map(async (preview) => ({
        ...preview,
        name: await contactService.getNameByPhoneNumberAsync(
          preview.phoneNumber
        ),
      }))
    );

    setChatPreviews(previews);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatPreviews();
    messageStorageService.onNewMessage(fetchChatPreviews);
    messageStorageService.onChangeReadStatus(fetchChatPreviews);
  }, []);

  return { loading, chatPreviews };
}
