import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Avatar, CircularProgress } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import { getComments } from '../data/DataContext.jsx';
import CommentsPanel from './CommentsPanel.jsx';

export default function CommentButton({ videoId, comments }) {
    const [open, setOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(comments);

    useEffect(() => {
        setCommentCount(comments);
    }, [comments]);

    return (
        <>
            <IconButton onClick={() => setOpen(true)} sx={{ padding: 0 }} aria-label="View comments">
                <CommentIcon sx={{ color: "white", filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }} />
            </IconButton>
            <Typography variant="caption" sx={{ color: "white", textShadow: "0 0 3px rgba(0,0,0,0.7)" }}>
                {commentCount}
            </Typography>

            <CommentsPanel
                open={open}
                onClose={() => setOpen(false)}
                videoId={videoId}
                onCommentCountChange={setCommentCount}
            />
        </>
    );
}