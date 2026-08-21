import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SendIcon from '@mui/icons-material/Send';
import { getComments, postComment, deleteComment, editComment } from '../data/DataContext.jsx';
import TextField from '@mui/material/TextField';
import { useAuth } from '../data/AuthContext.jsx';
import AvatarButton from './AvatarButton';

export default function CommentsPanel({ open, onClose, videoId, onCommentCountChange }) {
    const [commentList, setCommentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        onCommentCountChange?.(commentList.length);
    }, [commentList, onCommentCountChange]);

    const startEdit = (comment) => {
        setEditingComment(comment);
        setNewComment(comment.text);
    };

    const cancelEdit = () => {
        setEditingComment(null);
        setNewComment('');
    };

    // fetch comments whenever the panel opens
    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setLoading(true);

        getComments(videoId).then((data) => {
            if (!cancelled) {
                setCommentList(data);
                setLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, [open, videoId]);

    // close panel if the feed scrolls while it's open
    useEffect(() => {
        if (!open) return;

        const handleScroll = () => onClose();

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [open, onClose]);

    const handleSubmit = async () => {
        const trimmed = newComment.trim();
        if (!trimmed || posting) return;
        console.log('editingComment:', editingComment);
        setPosting(true);

        if (editingComment) {
            const saved = await editComment(editingComment.id, trimmed);
            setPosting(false);

            if (saved) {
                setCommentList((prev) =>
                    prev.map((c) => (c.id === editingComment.id ? { ...c, text: trimmed } : c))
                );
                setEditingComment(null);
                setNewComment('');
            }
        } else {
            const saved = await postComment(videoId, trimmed);
            setPosting(false);

            if (saved) {
                setCommentList((prev) => [...prev, saved]);
                setNewComment('');
            }
        }
    };

    const handleDelete = async (comment) => {
        console.log(`deleting ${JSON.stringify({ comment })}`);
        const success = deleteComment(comment);

        if (success) {
            setCommentList((prev) => prev.filter((c) => c.id !== comment.id));
        } else {
            console.error('Failed to delete comment, leaving it in the list');
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                height: "50vh",
                backgroundColor: "rgba(20, 20, 20, 0.95)",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                display: "flex",
                flexDirection: "column",
                transform: open ? "translateY(0%)" : "translateY(100%)",
                transition: "transform 0.25s ease-out",
                zIndex: 1300,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography variant="subtitle1" sx={{ color: "white" }}>Comments</Typography>
                <IconButton onClick={onClose} sx={{ color: "white" }} aria-label="Close comments">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", padding: "8px 16px" }}>
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    </Box>
                )}

                {!loading && commentList.length === 0 && (
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", textAlign: "center", padding: 4 }}>
                        No comments yet.
                    </Typography>
                )}

                {!loading && commentList.map((comment) => (
                    <Box key={comment.id} sx={{ display: "flex", gap: 1.5, py: 1, alignItems: "flex-start" }}>
                        <Box sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                            <AvatarButton user={comment.userId} />
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", textAlign: "left" }}>
                                {comment.text}
                            </Typography>
                        </Box>

                        {user?.user_id === comment.userId.user_id && (

                            <Box sx={{ minWidth: 0, flex: 1, textAlign: "right" }}>
                                <IconButton onClick={() => startEdit(comment)} sx={{ color: "white" }} aria-label="Edit Comment">
                                    <EditNoteIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(comment)} sx={{ color: "red" }} aria-label="Delete comments">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}

                    </Box>
                ))}


            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={posting}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            borderRadius: 3,
                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
                            "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                        },
                    }}
                />
                <IconButton
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || posting}
                    sx={{ color: newComment.trim() ? "white" : "rgba(255,255,255,0.3)" }}
                    aria-label="Post comment"
                >
                    {posting ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon />}
                </IconButton>
            </Box>
        </Box>
    );
}