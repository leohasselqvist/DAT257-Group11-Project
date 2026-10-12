
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

import { FavoritesContext } from "../contexts/FavoritesContext";
import * as api from "../databaseAPI/API";

type LikeButtonProps = {
  recipeId: number;
  userId: number | null;
};

export default function LikeButton({
  recipeId,
  userId,
}: LikeButtonProps) {
  const context = useContext(FavoritesContext);
  const [loading, setLoading] = useState(false);

  if (!context) return null;

  const { likedIds, setLikedIds } = context;
  const liked = likedIds.includes(recipeId);

  async function toggleLike() {
    console.log("[LikeButton] CLICKED!", { recipeId, userId });

    if (userId == null) {
      console.warn("[LikeButton] Cannot save favourite: userId is null.");
      return;
    }

    if (loading) return;

    const wasLiked = liked;
    setLoading(true);

    try {
      const result = wasLiked
        ? await api.removeFavouriteRecipe(userId, recipeId)
        : await api.addFavouriteRecipe(userId, recipeId);

      console.log("[LikeButton] API response:", result);

      if (result !== 1) {
        throw new Error(`Unexpected API response: ${JSON.stringify(result)}`);
      }

      setLikedIds((previousIds) =>
        wasLiked
          ? previousIds.filter((id) => id !== recipeId)
          : previousIds.includes(recipeId)
            ? previousIds
            : [...previousIds, recipeId]
      );

      console.log(
        `[LikeButton] ${wasLiked ? "Removed" : "Saved"} favourite`,
        { userId, recipeId }
      );
    } catch (error) {
      console.error("[LikeButton] Failed to update favourite:", error);
    } finally {
      setLoading(false);
    }
  }

  
return (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      pressed && styles.pressed,
    ]}
    onPress={toggleLike}
    disabled={loading}
    accessibilityRole="button"
    accessibilityLabel={
      liked ? "Remove favourite" : "Add favourite"
    }
    accessibilityState={{ selected: liked, disabled: loading }}
    hitSlop={8}
  >
    {loading ? (
      <ActivityIndicator size="small" color={liked ? "red" : "gray"} />
    ) : (
      <Text
        style={[
          styles.heart,
          { color: liked ? "red" : "gray" },
        ]}
      >
        ♡
      </Text>
    )}
  </Pressable>
);

}


const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 10,
    bottom: 8,
    zIndex: 10,
    elevation: 5,
    padding: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  heart: {
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
  },
});
