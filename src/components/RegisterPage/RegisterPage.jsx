import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

// import mui
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';

// set up the mui styles
const useStyles = makeStyles(() => ({
  registrationBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function RegisterPage() {
  // set up the dispatch
  const dispatch = useDispatch();
  const history = useHistory();

  // get the mui styles
  const { registrationBox } = useStyles();

  // turn off the back button on this page
  useEffect(() => {
    // don't display the back button on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: false });
  }, []);

  return (
    <Box className={registrationBox}>
      <RegisterForm />
    </Box>
  );
}

export default RegisterPage;
