// this component is a main view
// teachers can view the progress of
// a specific student on this screen

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    marginTop: '100px',
  },
}));

function TeacherProgressDetails() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the mui styles with the custom hook
  const { container, table } = useStyles();

  // grab the student_class_id from the params
  const { student_class_id } = useParams();

  // get the progress details for this student from the redux store
  const studentProgress = useSelector(
    (store) => store.classStore.studentProgress
  );

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Student Progress ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the details for this student
    dispatch({ type: 'FETCH_STUDENT_PROGRESS', payload: student_class_id });
  }, []);

  console.log(`studentProgress`, studentProgress);

  return (
    <Container className={container}>
      <Box>
        <Typography variant="h4">
          Details for Student:{' '}
          {studentProgress.length > 0 && studentProgress[0].first_name}{' '}
          {studentProgress.length > 0 && studentProgress[0].last_name}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5">Completed Attempts:</Typography>
      </Box>
      <TableContainer component={Paper} className={table}>
        <Table aria-label="Student Progress">
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Cards Learned</TableCell>
              <TableCell align="center">Cards Reviewed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {last_name: 'student1', first_name: 'student1', cards_learned: 2, cards_reviewed: 3, timestamp: '2021-11-20T03:09:52.173Z'} */}
            {studentProgress &&
              studentProgress.map((session) => (
                <TableRow key={session.student_class_session_id}>
                  <TableCell align="center">
                    {new Date(session.timestamp).getMonth() + 1}/
                    {new Date(session.timestamp).getDate()}/
                    {new Date(session.timestamp).getFullYear()}
                  </TableCell>
                  <TableCell align="center">{session.cards_learned}</TableCell>
                  <TableCell align="center">{session.cards_reviewed}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TeacherProgressDetails;
