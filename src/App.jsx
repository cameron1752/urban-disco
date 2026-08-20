import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { useGlobalData, DataProvider } from './data/DataContext.jsx';
import { AuthProvider, useAuth } from './data/AuthContext.jsx';
import Landing from './landing.jsx';
import Feed from './components/Feed.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile.jsx';
import Video from './components/Video.jsx';



const theme = createTheme({
  palette: {
    text: { primary: '#ffffff' },
  },
});



function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Innards() {
  const { feedRows } = useGlobalData();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Feed feedObjects={feedRows.feedObjects} />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/video/:videoid" element={<Video />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  )
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a spinner/skeleton, your call
  }

  if (!user) {
    console.log("User is not logged in");
    return (
      <Landing />
    );
  }

  return (
    <DataProvider>
      <Innards />
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App