// this component is a main view where students view stats
// about cards in a specific class they are enrolled in

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

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
  headingBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    paddingBottom: '30px',
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function StudentClassStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the mui styles
  const { container, headingBox, heading, buttonBox } = useStyles();

  // grab the class id from the params
  const { class_id } = useParams();

  // set up the useHistory hook to navigate
  const history = useHistory();

  // grab the number of cards to review from the redux store
  const totalNumCards = useSelector((store) => store.stackStore.totalNumCards);
  const totalNumNewCards = useSelector(
    (store) => store.stackStore.totalNumNewCards
  );
  const totalNumReviewCards = useSelector(
    (store) => store.stackStore.totalNumReviewCards
  );
  const currentClass = useSelector((store) => store.classStore.editClass);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Stats' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARD_NUMBERS', payload: class_id });
    // fetch the number of all the cards in this class already made available to the student
    dispatch({ type: 'FETCH_TOTAL_NUM_CARDS', payload: class_id });
    // fetch details about this class (we esp. want the name)
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
  }, []);

  console.log(`class obj`, currentClass);

  return (
    <Container className={container} sx={{ display: 'flex' }}>
      <Box className={headingBox}>
        <Typography variant="h2" className={heading}>
          Class Stats
        </Typography>
        <Typography variant="h5">{currentClass.class_name}</Typography>
      </Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>New cards to learn:</TableCell>
            <TableCell>{totalNumNewCards}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards to review: </TableCell>
            <TableCell>{totalNumReviewCards}</TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Cards already learned:</TableCell>
          <TableCell>
            {totalNumCards - (totalNumNewCards + totalNumReviewCards)}
          </TableCell>
        </TableBody>
      </Table>
      {/* if there are any cards to review show the Review Cards button, else the back */}
      <Box className={buttonBox}>
        {totalNumNewCards + totalNumReviewCards > 0 ? (
          <Button
            variant="contained"
            onClick={() => history.push(`/cards/${class_id}`)}
          >
            Review Cards
          </Button>
        ) : (
          <Button variant="contained" onClick={() => history.goBack()}>
            Back
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default StudentClassStats;
