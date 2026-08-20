import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import { getVideos } from "../data/DataContext.jsx";
import ImageButton from "./ImageButton";
import AvatarButton from './AvatarButton';
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { username } = useParams();
    const location = useLocation();
    const user = location.state?.user;
    const [videoList, setVideoList] = useState([]);

    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
    };

    useEffect(() => {

        const fetchVideos = async () => {
            console.log(`fetching videos for ${JSON.stringify(user)}`);

            const result = await getVideos(user);

            setVideoList(result);
        };

        fetchVideos();

    }, [user]);

    console.log("result", videoList);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <AvatarButton user={user} />
                <IconButton
                    onClick={handleHomeClick}
                    sx={{
                        color: "white",
                    }}
                    aria-label="Home"
                >
                    <HomeIcon />
                </IconButton>
            </Box>
            <ImageList sx={{ width: "100%", height: "90vh" }} cols={3} >
                {videoList.map((item) => (
                    <ImageButton video={item} />
                ))}
            </ImageList>
        </Box>
    );
}