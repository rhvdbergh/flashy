// this component is a main view where students view stats
// about cards in a specific class they are enrolled in

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

  // grab the cards to review from the redux store
  const cards = useSelector((store) => store.stackStore.cardsToReview);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Stats:' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARDS_TO_REVIEW', payload: class_id });
  }, []);

  return (
    <Container className={container}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>New cards to learn:</TableCell>
            {/* calculating the length of the array containing cards with familiarity of 0 */}
            <TableCell>
              {cards.filter((card) => card.familiarity === 0).length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards to review: </TableCell>
            <TableCell>
              {/* calculating the length of the array containing cards with familiarity of 0 */}
              {cards.filter((card) => card.familiarity !== 0).length}
            </TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Cards already learned:</TableCell>
          <TableCell></TableCell>
        </TableBody>
      </Table>
      <Button variant="contained">Review Cards</Button>
    </Container>
  );
}

export default StudentClassStats;
