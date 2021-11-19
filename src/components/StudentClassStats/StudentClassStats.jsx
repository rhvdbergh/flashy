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
  Paper,
  Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '200px',
    width: '100%',
  },
}));

function StudentClassStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the mui styles
  const { container } = useStyles();

  // grab the class id from the params
  const { class_id } = useParams();

  // set up the useHistory hook to navigate
  const history = useHistory();

  // grab the cards to review from the redux store
  const cardsToReview = useSelector((store) => store.stackStore.cardsToReview);
  const totalNumCards = useSelector((store) => store.stackStore.totalNumCards);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Stats:' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARDS_TO_REVIEW', payload: class_id });
    // fetch the number of all the cards in this class already made available to the student
    dispatch({ type: 'FETCH_TOTAL_NUM_CARDS', payload: class_id });
  }, []);

  return (
    <Container className={container}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>New cards to learn:</TableCell>
            {/* calculating the length of the array containing cards with familiarity of 0 */}
            <TableCell>
              {cardsToReview.filter((card) => card.familiarity === 0).length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards to review: </TableCell>
            <TableCell>
              {/* calculating the length of the array containing cards with familiarity of 0 */}
              {cardsToReview.filter((card) => card.familiarity !== 0).length}
            </TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Cards already learned:</TableCell>
          <TableCell>{totalNumCards - cardsToReview.length}</TableCell>
        </TableBody>
      </Table>
      {/* if there are any cards to review show the Review Cards button, else the back */}
      {cardsToReview.length > 0 ? (
        <Button
          variant="contained"
          onClick={() => history.push(`/cards/${class_id}`)}
        >
          Review Cards
        </Button>
      ) : (
        <Button variant="contained" onClick={() => history.back()}>
          Back
        </Button>
      )}
    </Container>
  );
}

export default StudentClassStats;
