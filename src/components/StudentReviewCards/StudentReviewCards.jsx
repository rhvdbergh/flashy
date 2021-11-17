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
    marginTop: '130px',
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
  revealButton: {
    width: '100%',
  },
  yesNoButtons: {
    width: '40%',
  },
  feedback: {
    height: '200px',
    width: '100%',
  },
}));

function StudentReviewCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the class id from the params
  const { class_id } = useParams();

  // get the mui styles
  const { container, cardStyle, revealButton, yesNoButtons, feedback } =
    useStyles();

  // grab the cards to review from the redux store
  const cards = useSelector((store) => store.stackStore.cardsToReview);

  // local state to keep track of the two sets of cards that we have
  const [newCards, setNewCards] = useState([]);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [cardsSeen, setCardsSeen] = useState([]);
  const [cardsShortTerm, setCardsShortTerm] = useState([]);
  const [currentCard, setCurrentCard] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // keeps track of whether the card is revealed or not
  const [isRevealed, setIsRevealed] = useState(false);
  // keeps track of what stage the screen is in
  // options are review, new, seen, shortTerm
  const [currentStage, setCurrentStage] = useState('review');

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
    const tempArr = cards.filter((card) => card.familiarity !== 0);
    setCardsToReview(tempArr);
    // if there are no cards to review, move to the new stage
    if (tempArr.length === 0) {
      setCurrentStage('new');
    } else {
      setCurrentStage('review');
    }
  }, [cards]);

  // whenever any of the state "boxes" of cards changes, pick a new random card
  // to display to the user
  useEffect(() => {
    // if there are older cards to review, review them first
    if (cardsToReview.length > 0) {
      setCurrentCard(pickRandomCardFrom(cardsToReview));
    } else if (currentStage === 'new' && newCards.length > 0) {
      setCurrentCard(pickRandomCardFrom(newCards));
    }
  }, [newCards, cardsToReview, cardsSeen, cardsShortTerm]);

  // things to change when the currentStage changes
  useEffect(() => {
    // if we're entering the new cards stage, the student
    // should see both sides of the cards for all the cards
    if (currentStage === 'new') {
      setIsRevealed(true);
    } else {
      // none of the other states should have the back displayed
      // enforce it by this check
      setIsRevealed(false);
    }
  }, [currentStage]);

  const pickRandomCardFrom = (cardsArray) => {
    // if there's only one card left, return it
    if (cardsArray.length === 1) {
      return cardsArray[0];
    }
    // else pick a random card
    // this will find a random index between 0 and the array length,
    // not including the number of the length (so 0 - length-1)
    const index = Math.floor(Math.random() * cardsArray.length);
    setCurrentCardIndex(index);
    return cardsArray[index];
  };

  // the user has clicked no
  const handleNo = () => {
    // if this is an old card being reviewed,
    // set it back in the new cards to learn box
    // the current stage is "review"
    if (currentStage === 'review') {
      removeCardFromReview();
      // change the card's familiarity back to 0
      currentCard.familiarity = 0;
      // and add it to the newCards box
      setNewCards([...newCards, currentCard]);
      // make sure the next card is not revealed!
      setIsRevealed(false);
      // the useEffect will trigger a new random card pick
    }
  };

  // the user has clicked yes
  const handleYes = () => {
    // if this is in the review stage, we have to send a dispatch
    if (currentStage === 'review') {
      dispatch({
        type: 'UPGRADE_CARD_FAMILIARITY',
        payload: currentCard.student_class_card_id,
      });
      removeCardFromReview();
    }
  };

  // removes cards from the cardsToReview box
  // will move to the next stage if this is the last card
  const removeCardFromReview = () => {
    // if this is the final card in the box
    if (cardsToReview.length === 1) {
      // this box is now empty
      setCardsToReview([]);
      // and we're moving into the new card learning stage
      setCurrentStage('new');
    } else {
      // remove this card from the cardsToReview box
      const beginArr = cardsToReview.slice(0, currentCardIndex);
      const endArr = cardsToReview.slice(currentCardIndex + 1);
      setCardsToReview([...beginArr, ...endArr]);
    }
  };

  // moves a new card from the new box to the seen box
  const moveToSeenBox = () => {
    // if this is the final card in the box
    if (newCards.length === 1) {
      // this box is now empty
      setNewCards([]);
      // and we're moving into the seen review stage
      setCurrentStage('seen');
    } else {
      // remove this card from the newCards box
      const beginArr = newCards.slice(0, currentCardIndex);
      const endArr = newCards.slice(currentCardIndex + 1);
      setNewCards([...beginArr, ...endArr]);
    }
    // update the seenCards
    // no need to change the familiarity yet
    setCardsSeen([...cardsSeen, currentCard]);
  };

  console.log(`here are your cards to learn`, newCards);
  console.log(`here are your cards to review`, cardsToReview);
  console.log(`here are your cards seen`, cardsSeen);
  console.log(`here are your cards in short term`, cardsShortTerm);
  console.log(`here is your random card`, currentCard);
  console.log(`we are in stage`, currentStage);

  return (
    <Container className={container}>
      <Paper className={cardStyle}>
        <Box>
          <Typography>{currentCard.front}</Typography>
        </Box>
      </Paper>
      <Paper>
        <Box className={cardStyle}>
          {isRevealed && <Typography>{currentCard.back}</Typography>}
        </Box>
      </Paper>
      {/* Show different buttons and feedback depending on whether the card is revealed */}
      {!isRevealed ? (
        <Box className={feedback}>
          <Button
            variant="contained"
            className={revealButton}
            onClick={() => setIsRevealed(true)}
          >
            Reveal Card
          </Button>
        </Box>
      ) : // Another conditional render, depending on the stage
      // In the "new" stage, there are no "yes" or "no" buttons
      //  Instead, there's a continue button
      currentStage === 'new' ? (
        <Box className={feedback}>
          <Button
            variant="contained"
            className={revealButton}
            onClick={moveToSeenBox}
          >
            Continue
          </Button>
        </Box>
      ) : (
        <Box className={feedback}>
          <Box>
            <Box>
              <Typography variant="body1">Did you know this card?</Typography>
            </Box>
            <Button
              variant="contained"
              className={yesNoButtons}
              onClick={handleNo}
            >
              No
            </Button>
            <Button
              variant="contained"
              className={yesNoButtons}
              onClick={handleYes}
            >
              Yes
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default StudentReviewCards;
