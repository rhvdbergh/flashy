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
import { useSelector } from 'react-redux';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
}));

function TeacherDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get state from the redux store
  const classes = useSelector((store) => store.classes);

  // set up the useHistory hook
  const history = useHistory();

  // get the mui styles
  const { container } = useStyles();

  // on page load, set nav bar title
  // also retrieve all the classes for this teacher
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    dispatch({ type: 'GET_CLASSES' });
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
