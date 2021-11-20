// this component is a main view
// teachers can view the progress of
// a specific student on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

//import mui
import {
  Box,
  Button,
  Container,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '150px',
  },
  textfield: {
    width: '250px',
  },
  select: {
    width: '250px',
  },
  checkbox: {
    alignSelf: 'center',
  },
  spacing: {
    margin: '20px',
  },
}));

function TeacherProgressDetails() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the mui styles with the custom hook
  const { container, table } = useStyles();

  // grab the student_class_id from the params
  const { student_class_id } = useParams();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Student Progress ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the details for this student
    dispatch({ type: 'FETCH_STUDENT_PROGRESS', payload: student_class_id });
  }, []);

  return (
    <Container className={container}>
      <Box>
        <Typography variant="h4">Details for Student: </Typography>
      </Box>
      <Box>
        <Typography variant="h5">Completed Attempts:</Typography>
      </Box>
      <TableContainer component={Paper} className={table}>
        <Table aria-label="Student Progress">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Cards Learned</TableCell>
              <TableCell align="center">Cards Not Learned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TeacherProgressDetails;
