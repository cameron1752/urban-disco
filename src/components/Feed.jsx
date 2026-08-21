import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from "@mui/material";
import FeedItem from './FeedItem';

export const FeedContainer = styled(Box)({
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  '&::-webkit-scrollbar': { display: 'none' },
});

export default function Feed({ feedObjects }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useCallback so this function reference stays stable across renders,
  // preventing every FeedItem's observer effect from re-running unnecessarily
  const handleVisible = useCallback((index) => {
    console.log(`something ${JSON.stringify(feedObjects[index])}`)
    setCurrentIndex(index);
  }, []);

  return (
    <FeedContainer>
      {feedObjects?.map(({ video, liked }, index) => (
        <FeedItem
          liked={liked}
          video={video}
          index={index}
          isNext={index === currentIndex + 1}
          onVisible={handleVisible}
        />
      ))}
    </FeedContainer>
  );
}