import React, { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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
  // set up the dispatch
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // don't display the back button on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: false });
  }, []);

  // get the mui styles

  const { registrationBox } = useStyles();

  return (
    <Box className={registrationBox}>
      <LoginForm />
    </Box>
  );
}

export default LoginPage;
