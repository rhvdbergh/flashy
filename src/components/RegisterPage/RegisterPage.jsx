import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

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

function RegisterPage() {
  const history = useHistory();

  // get the mui styles
  const { registrationBox } = useStyles();

  return (
    <Box className={registrationBox}>
      <RegisterForm />
    </Box>
  );
}

export default RegisterPage;
