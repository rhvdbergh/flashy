// this component is a main view
// it is used for students to learn new cards
// and to review cards that have previously been learned

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

// import mui
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
  Typography,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    marginTop: '30px',
    width: '100%',
    maxWidth: '500px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'text.primary',
  },
}));

function StudentReviewCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the class id from the params
  const { class_id } = useParams();

  // get the mui styles
  const { container, cardStyle } = useStyles();

  // grab the cards to review from the redux store
  const cards = useSelector((store) => store.stackStore.cardsToReview);

  // local state to keep track of the two sets of cards that we have
  const [newCards, setNewCards] = useState([]);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [cardsSeen, setCardsSeen] = useState([]);
  const [cardsShortTerm, setCardsShortTerm] = useState([]);
  const [currentCard, setCurrentCard] = useState({});

  // on page load
  useEffect(() => {
    //set nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Cards' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARDS_TO_REVIEW', payload: class_id });
  }, []);

  // when the cards get set, update the local state
  useEffect(() => {
    // these are all new cards that the student has to learn
    setNewCards(cards.filter((card) => card.familiarity === 0));
    // these are all cards that the student has previously learned
    // and now needs to review
    setCardsToReview(cards.filter((card) => card.familiarity !== 0));
  }, [cards]);

  // whenever newCards or cardsToReview changes, pick a new random card
  // to display to the user
  useEffect(() => {
    console.log(`things changed`);
    // if there are older cards to review, review them first
    if (cardsToReview.length > 0) {
      setCurrentCard(pickRandomCardFrom(cardsToReview));
    }
  }, [newCards, cardsToReview]);

  const pickRandomCardFrom = (cardsArray) => {
    // if there's only one card left, return it
    if (cardsArray.length === 1) {
      return cardsArray[0];
    }
    // else pick a random card
    // this will find a random index between 0 and the array length,
    // not including the number of the length (so 0 - length-1)
    const randomIndex = Math.floor(Math.random() * cardsArray.length);
    return cardsArray[randomIndex];
  };

  console.log(`here are your cards to learn`, newCards);
  console.log(`here are your cards to review`, cardsToReview);
  console.log(`here is your random card`, currentCard);

  return (
    <Container className={container}>
      <Paper className={cardStyle}>
        <Box>
          <Typography>{currentCard.front}</Typography>
        </Box>
      </Paper>
      <Box className={cardStyle}>
        <Typography>{currentCard.back}</Typography>
      </Box>
    </Container>
  );
}

export default StudentReviewCards;
