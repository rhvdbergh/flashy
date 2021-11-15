// this component is a main view
// it is the home screen for teachers
// teachers can add classes and stacks of cards
// they can manage these items

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import mui
import { Box, Button, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
}));

function TeacherDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the useHistory hook
  const history = useHistory();

  // get the mui styles
  const { container } = useStyles();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
  }, []);

  return (
    <Container className={container}>
      <Button
        variant="contained"
        value="add_class"
        onClick={() => history.push('/editclass')}
      >
        Add Class
      </Button>
    </Container>
  );
}

export default TeacherDashboard;
