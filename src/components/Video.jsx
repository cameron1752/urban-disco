import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Typography, ImageList, ImageListItem } from "@mui/material";
import { getLike } from "../data/DataContext.jsx";
import ImageButton from "./ImageButton";
import Feed from './Feed.jsx';

export default function Video() {

    const location = useLocation();
    const video = location.state?.video;

        console.log("VIDEO:", video);

    if (!video) {
        return <div>Video not found</div>;
    }

const [liked, setLiked] = useState(false);

useEffect(() => {
    async function checkLike() {
        const result = await getLike(video.id);

        setLiked(result.value === "true");

    }

    checkLike();
}, [video.id]);

useEffect(() => {
    console.log("do I like this:", liked);
}, [liked]);

const feedObjects = [{ video, liked }];

console.log("PASSING TO FEED:", feedObjects);

    return (
        <Feed feedObjects={feedObjects} />
    );
}