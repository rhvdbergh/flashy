// this component is a main view where students
// can see which classes they are enrolled in,
// select new classes, and see which classes have cards
// that need to be reviewed

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import mui
import {
  Box,
  Button,
  Container,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '150px',
    width: '100%',
  },
  select: {
    width: '100%',
  },
}));

function StudentDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the mui styles
  const { container, select } = useStyles();

  // TODO: fetch this from the redux store instead
  // hardcoded at present
  const availableClasses = useSelector(
    (store) => store.classStore.availableClasses
  );

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the list of available classes
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES' });
  }, []);

  // adds a class for this student
  // cl stands for class
  const addClass = (cl) => {
    // dispatch the new class to the server
    dispatch({ type: 'ADD_CLASS_FOR_STUDENT', payload: cl });
    // and remove it from the classes available to this student
    // we only want to display those that the student has not yet joined
    //TODO:
  };

  return (
    <Container className={container}>
      <Box className={select}>
        <FormControl className={select}>
          <InputLabel id="select-class">Add Class</InputLabel>
          <Select
            labelId="select-class"
            label="Add Class"
            value={''}
            className={select}
            onChange={(event) => addClass(event.target.value)}
          >
            {availableClasses.map((cl) => (
              <MenuItem key={cl.id} value={cl.id}>
                {cl.class_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
}

export default StudentDashboard;
