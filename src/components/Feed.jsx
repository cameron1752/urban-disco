import { styled } from '@mui/material/styles';
import { Box } from "@mui/material";
import FeedItem from './FeedItem'


export const FeedContainer = styled(Box)({
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar, optional
});

export default function Feed({ feedObjects }) {
    const handleLike = (videoId, liked) => {
    // TODO: call your API here, e.g.
    // fetch(`/api/videos/${videoId}/like`, { method: liked ? "POST" : "DELETE" });
    console.log(videoId, liked ? "liked" : "unliked");
  };


  return (
    <FeedContainer>
      {feedObjects?.map(({ video, liked }) => (
        <FeedItem video={video} liked={liked} />
      ))}
    </FeedContainer>
  );
}