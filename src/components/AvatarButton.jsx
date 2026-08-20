import { Box, Typography, IconButton, Avatar, CircularProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';


export default function AvatarButton({ user }) {

    const navigate = useNavigate();

    const handleAvatar = () => {
        navigate(`/profile/${user.username}`,{
            state: { user }
        });
    };

    return (
        <Box >
          <IconButton onClick={() => handleAvatar()} >
            <Avatar
                src={user.avatar_url}
                alt={user.username}
                sx={{ width: 32, height: 32, border: "1px solid white" }}
            />
            <Typography variant="body2" sx={{ color: "white", fontWeight: 600, textAlign: "left", ml: 1}} >
                {user.username}
            </Typography>

            </IconButton>
        </Box>
    );
}