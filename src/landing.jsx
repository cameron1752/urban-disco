import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function GithubButton() {
  return (
    <a href="http://localhost:8080/oauth2/authorization/github">
      <Button variant="outlined" startIcon={<FaGithub />}>Login with Github</Button>
    </a>
  );
}

function GoogleButton(){
    return (
        <a href="http://localhost:8080/oauth2/authorization/google">
            <Button variant="outlined" startIcon={<FcGoogle />}>Login with Google</Button>
        </a>
    );
}

function Landing(){
    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Stack spacing={2} direction="column" alignItems="center">
        <h2>Welcome to the Qwik Finance App</h2>
        <GithubButton />
        <GoogleButton />
        </Stack>
    </div>
    );
}


export default Landing;