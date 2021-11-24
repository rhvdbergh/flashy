// this component is a main view where students can view
// the progress of a specific class

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

// import custom components
import TeacherClassProgressRow from '../TeacherClassProgressRow/TeacherClassProgressRow';

//import mui
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '150px',
  },
  table: {
    marginTop: '30px',
  },
}));

function TeacherClassProgress() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // fetch the id for this stack from the useParams hook
  const { class_id } = useParams();

  // set up the mui styles
  const { container, table } = useStyles();

  // grab the class progress from the redux store
  const classProgress = useSelector((store) => store.classStore.classProgress);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Class Progress' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the progress
    dispatch({ type: 'FETCH_CLASS_PROGRESS', payload: class_id });
  }, []);

  return (
    <Container className={container}>
      {/* If the class is empty, display a message instead of the table */}
      {classProgress.length === 0 || classProgress === undefined ? (
        <Box>
          <Typography variant="h2">
            There are currently no students in this class.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} className={table}>
          <Table aria-label="Classes">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell align="center">Cards Learned</TableCell>
                <TableCell align="center">Cards Not Learned</TableCell>
                <TableCell align="center">Completed Attempts</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classProgress &&
                classProgress.map((student) => (
                  <TeacherClassProgressRow
                    key={student.student_id}
                    student={student}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default TeacherClassProgress;
