import { Box, Typography, ImageList, Button, ImageListItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';

export default function ImageButton({ video }) {
    const navigate = useNavigate();
    const handlePictureClick = () => {
        console.log(`fetching ${JSON.stringify(video)}`);
        navigate(`/video/${video.id}`, {
            state: { video }
        });
    };

    return (

            <ImageListItem key={video.id} sx={{
                width: '100%',
                height: '100%',
            }}>
                        <Button onClick={handlePictureClick} sx={{
            padding: 0,
            minWidth: 0,
            width: '100%',
            height: '100%',
        }}>
                <img
                    srcSet={`${video.thumbnailUrl}`}
                    src={`${video.thumbnailUrl}`}
                    alt={video.caption}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        display: "block", objectFit: "cover"
                    }}
                />
                
        </Button>
            </ImageListItem>
    )
}