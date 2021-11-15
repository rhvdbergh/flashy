import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
// import mui
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  registrationBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function LoginPage() {
  const history = useHistory();

  // get the mui styles

  const { registrationBox } = useStyles();

  return (
    <Box className={registrationBox}>
      <LoginForm />
    </Box>
  );
}

export default LoginPage;
