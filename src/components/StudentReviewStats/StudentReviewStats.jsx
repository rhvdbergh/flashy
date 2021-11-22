// this component is a main view where
// students can review their stats after
// they have reviewed cards

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '78vh',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  table: {
    display: 'flex',
    justifyConten: 'center',
  },
  heading: {
    paddingBottom: '30px',
  },
}));

function StudentReviewStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the useHistory hook to navigate
  const history = useHistory();

  // grab the class id from the params
  const { class_id } = useParams();

  // get the mui styles
  const { container, main, buttonBox, table, heading } = useStyles();

  // get the old card numbers from the redux store
  const { cards_learned, cards_reviewed } = useSelector(
    (store) => store.stackStore.latestSessionNumbers
  );
  const totalNumCards = useSelector((store) => store.stackStore.totalNumCards);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Review Stats' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the number of all the cards in this class already made available to the student
    dispatch({ type: 'FETCH_TOTAL_NUM_CARDS', payload: class_id });
  }, []);
  return (
    <Container
      className={container}
      sx={{
        display: 'flex',
      }}
    >
      <Box className={main}>
        <Typography variant="h2" className={heading}>
          Good job!
        </Typography>
        <Typography variant="h5">Today's Stats</Typography>
      </Box>
      <Table className={table}>
        <TableBody>
          <TableRow>
            <TableCell>New cards learned:</TableCell>
            <TableCell>{cards_learned}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards reviewed: </TableCell>
            <TableCell>{cards_reviewed}</TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Total cards learned: </TableCell>
          <TableCell>{totalNumCards}</TableCell>
        </TableBody>
      </Table>
      <Box className={buttonBox}>
        <Button variant="contained" onClick={() => history.push(`/`)}>
          Continue
        </Button>
      </Box>
    </Container>
  );
}

export default StudentReviewStats;
