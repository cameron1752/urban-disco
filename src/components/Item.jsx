import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export const FeedContainer = styled(Box)({
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar, optional
});

export const FeedItem = styled(Paper)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  color: theme.palette.text.primary,
  borderRadius: 0,
}));

export default function Feed({ rows }) {
  return (
    <FeedContainer>
      {rows?.map((row, index) => (
        <FeedItem key={index}>
          {JSON.stringify(row)}
        </FeedItem>
      ))}
    </FeedContainer>
  );
}