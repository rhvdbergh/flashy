import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// import mui
import { Box, Button } from '@mui/material';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Box className="container">
      <RegisterForm />

      <Button variant="contained" className="btn btn_sizeSm" onClick={onLogin}>
        Login
      </Button>
    </Box>
  );
}

export default LandingPage;
