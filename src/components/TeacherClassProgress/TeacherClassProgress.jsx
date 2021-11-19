// this component is a main view where students can view
// the progress of a specific class

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

//import mui
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
  table: {
    marginTop: '30px',
  },
  textfield: {
    width: '250px',
  },
}));

function TeacherClassProgress() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // fetch the id for this stack from the useParams hook
  const { class_id } = useParams();

  // set up the mui styles
  const { container, table } = useStyles();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Class Progress' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  return (
    <Container className={container}>
      <TableContainer component={Paper} className={table}>
        <Table aria-label="Classes">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Cards Learned</TableCell>
              <TableCell>Cards Not Learned</TableCell>
              <TableCell>Completed Attempts</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TeacherClassProgress;
