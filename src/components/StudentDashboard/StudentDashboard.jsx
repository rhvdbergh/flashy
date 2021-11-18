// this component is a main view where students
// can see which classes they are enrolled in,
// select new classes, and see which classes have cards
// that need to be reviewed

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
  const availableClasses = [0, 1];

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the list of available classes
    //TODO:
  }, []);

  // adds a class for this student
  // cl stands for class
  const addClass = (cl) => {
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
            value={availableClasses}
            className={select}
            onChange={(event) => addClass(event.target.value)}
          >
            {/* {stacks.map((stack) => (
              <MenuItem key={stack.id} value={stack.id}>
                {stack.stack_name}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
}

export default StudentDashboard;
