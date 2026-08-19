import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function QwikCard({title, category, body}) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 180 }}>
      <CardContent sx={{ flexGrow: 1, color: 'rgba(0, 0, 0, 0.87)' }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h5" sx={{ marginTop: 1 }}>{category}</Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>{body}</Typography>
      </CardContent>
    </Card>
  );
}
