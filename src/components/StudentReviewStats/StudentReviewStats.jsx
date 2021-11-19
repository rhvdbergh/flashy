// this component is a main view where
// students can review their stats after
// they have reviewed cards

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
  Typography,
  Paper,
  Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
    width: '100%',
  },
}));

function StudentReviewStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the useHistory hook to navigate
  const history = useHistory();

  // get the mui styles
  const { container } = useStyles();

  // get the old card numbers from the redux store

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Review Stats:' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);
  return (
    <Container className={container}>
      <Box>
        <Typography variant="h2">Good job!</Typography>
        <Typography variant="h5">Today's Stats</Typography>
      </Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>New cards learned:</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards reviewed: </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Total cards learned: </TableCell>
          <TableCell></TableCell>
        </TableBody>
      </Table>
      <Button variant="contained" onClick={() => history.push(`/`)}>
        Continue
      </Button>
    </Container>
  );
}

export default StudentReviewStats;
