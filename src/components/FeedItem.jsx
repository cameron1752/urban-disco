import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Box, Typography, Avatar, CardMedia } from "@mui/material";
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import AvatarButton from './AvatarButton';
import FeedVideo from './FeedVideo';


export const StyledFeedItem = styled(Paper)(({ theme }) => ({
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

export default function FeedItem({ video, index, liked, isNext, onVisible }) {
    return (
        <StyledFeedItem key={video.id}>
            {/* video / image */}
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                <FeedVideo video={video} isNext={isNext} index={index} onVisible={onVisible}/>

                {/* avatar + name */}
                <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 1, }}>
                    <AvatarButton user={video.userId} />
                </Box>

                {/* like + comment icon */}
                <Box sx={{ position: "absolute",  bottom: 50, right: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, }}>
                    {/* like */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <LikeButton liked={liked} likes={video.likes} videoId={video.id} />
                    </Box>

                    {/* comment */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <CommentButton videoId={video.id} comments={video.comments} />
                    </Box>
                </Box>

                {/* caption */}
                <Box sx={{ position: "absolute",  bottom: 50, left: 8, maxWidth: "70%", }} >
                    <Typography variant="body2" sx={{ color: "white", textShadow: "0 0 3px rgba(0,0,0,0.7)" }} >
                        {video.caption}
                    </Typography>
                </Box>
            </Box >
        </StyledFeedItem>
    );
}