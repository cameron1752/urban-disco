import { useState } from 'react';
import { IconButton, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {toggleLike} from '../data/DataContext.jsx';

export default function LikeButton({ liked, likes, videoId }) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLikeClick = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((count) => count + (nextLiked ? 1 : -1));
    toggleLike(videoId, nextLiked);
  };

  return (
    <>
      <IconButton
        onClick={handleLikeClick}
        sx={{ padding: 0 }}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        {isLiked ? (
          <FavoriteIcon sx={{ color: "red", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: "white", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />
        )}
      </IconButton>
      <Typography variant="caption" sx={{ color: "white", textShadow: "0 0 3px rgba(0,0,0,0.7)" }}>
        {likeCount}
      </Typography>
    </>
  );
}