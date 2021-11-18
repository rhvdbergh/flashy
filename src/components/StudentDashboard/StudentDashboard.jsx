// this component is a main view where students
// can see which classes they are enrolled in,
// select new classes, and see which classes have cards
// that need to be reviewed

import { useEffect, useState } from 'react';
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

  // fetch the classes this student is enrolled in
  const enrolledClasses = useSelector(
    (store) => store.classStore.enrolledClasses
  );
  // fetch all the availableClasses
  const availableClasses = useSelector(
    (store) => store.classStore.availableClasses
  );

  // set up local state to control which classes the student
  // can join
  const [stillAvailable, setStillAvailable] = useState([]);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the list of available classes
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES' });
    // get the classes that this student are already enrolled in
    dispatch({ type: 'FETCH_ENROLLED_CLASSES' });
  }, []);

  // when we get back the availableClasses list,
  // set the classes available to this student
  useEffect(() => {
    // filter through; if the user already belongs to these classes,
    // remove them from this list
    setStillAvailable(
      availableClasses.filter((cl) => {
        enrolledClasses.map((enr) => enr.id).includes(cl.id);
      })
    );
  }, [availableClasses]);

  // adds a class for this student
  // cl stands for class
  const addClass = (cl) => {
    // dispatch the new class to the server
    dispatch({ type: 'ADD_CLASS_FOR_STUDENT', payload: cl });
    // and remove it from the classes available to this student
    // we only want to display those that the student has not yet joined
    //TODO:
  };

  console.log(`enrolledClasses`, enrolledClasses);

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
      <Box>
        {enrolledClasses.map((cl) => (
          <Button key={cl.id}>{cl.name}</Button>
        ))}
      </Box>
    </Container>
  );
}

export default StudentDashboard;
