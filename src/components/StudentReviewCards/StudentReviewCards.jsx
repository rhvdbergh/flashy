// this component is a main view
// it is used for students to learn new cards
// and to review cards that have previously been learned

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// confetti for the end effect
import Confetti from 'react-confetti';

// import custom components
import CardBox from '../CardBox/CardBox';
import Timer from '../Timer/Timer';
import Feedback from '../Feedback/Feedback';
import FeedbackButtons from '../FeedbackButtons/FeedbackButtons';
import FinishedPage from '../FinishedPage/FinishedPage';

// import mui
import { Box, Container } from '@mui/material';

function StudentReviewCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the class id from the params
  const { class_id } = useParams();

  // grab the cards to review from the redux store
  const cards = useSelector((store) => store.stackStore.cardsToReview);
  // grab the current class from the redux store
  const currentClass = useSelector((store) => store.classStore.editClass);

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
  // options are review, new, seen, shortTerm, complete
  const [currentStage, setCurrentStage] = useState('');
  // timers; these are just the initial default values, but the
  // class values get loaded
  const [totalTime, setTotalTime] = useState(1000);
  const [learnTime, setLearnTime] = useState(100);
  // grab the numbers of cards to review from the redux store so we can calculate
  // on complete how many were actually reviewed
  const totalNumReviewCards = useSelector(
    (store) => store.stackStore.totalNumReviewCards
  );
  // keep track of all the new cards that made it into the next familiarity stage
  const [numNewCardsLearnedInSession, setNumNewCardsLearnedInSession] =
    useState(0);

  // on page load
  useEffect(() => {
    //set nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Cards' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARDS_TO_REVIEW', payload: class_id });
    // fetch the class so we can set the times
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
  }, []);

  // note: to update state correctly, these timers need to be in a
  // repeating useEffect (i.e., without empty array!)
  useEffect(() => {
    // fire up the timers, decrease each second
    // we do it here because we now have the cards returned from the store
    const timer = setTimeout(() => {
      // only decrease the counters if they're not already 0
      if (totalTime > 0) {
        setTotalTime(totalTime - 1);
      }
      if (learnTime > 0) {
        setLearnTime(learnTime - 1);
      }
    }, 100);
    // clear the timer
    return () => clearTimeout(timer);
  });

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

  // when the class returns in the store, we want to set the initial times
  useEffect(() => {
    // the database stores seconcds
    // but we speed the seconds up with * 10
    // this is so user interaction doesn't slow down the timers
    // otherwise, the timers starts refreshing from last
    // user interaction (in the useEffect hook!)
    // this slowing down effect is not as noticeable at 100 than at 1000 intervals
    setTotalTime(currentClass.total_time * 10);
    setLearnTime(currentClass.initial_time * 10);
  }, [currentClass]);

  // whenever any of the state "boxes" of cards changes, pick a new random card
  // to display to the user
  useEffect(() => {
    // if there are older cards to review, review them first
    if (cardsToReview.length > 0) {
      setCurrentCard(pickRandomCardFrom(cardsToReview));
    } else if (currentStage === 'new' && newCards.length > 0) {
      setCurrentCard(pickRandomCardFrom(newCards));
    } else if (currentStage === 'seen' && cardsSeen.length > 0) {
      setCurrentCard(pickRandomCardFrom(cardsSeen));
    } else if (currentStage === 'shortTerm' && cardsShortTerm.length > 0) {
      setCurrentCard(pickRandomCardFrom(cardsShortTerm));
    } else {
      // // this means we're through all the cards!
      // setCurrentStage('complete');
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
    if (currentStage === 'complete') {
      // reset the state
      setCurrentCard({});
      setCurrentCardIndex(0);
      // calculate how many cards the user reviewed during this session, and
      const totalNumCardsReviewedInSession =
        totalNumReviewCards - cardsToReview.length;
      // set this in the redux store
      // also set the number of new cards learned in this session
      dispatch({
        // grabbing the student_class_id from the first card in cards
        type: 'CREATE_SESSION_INFO',
        payload: {
          cards_reviewed: totalNumCardsReviewedInSession,
          cards_learned: numNewCardsLearnedInSession,
          student_class_id: cards[0].student_class_id,
        },
      });
    }

    // change the nav bar heading
    switch (currentStage) {
      case 'new':
        dispatch({ type: 'SET_NAV_TITLE', payload: 'Learn' });
        break;
      case 'seen':
        dispatch({ type: 'SET_NAV_TITLE', payload: 'First Review' });
        break;
      case 'shortTerm':
        dispatch({ type: 'SET_NAV_TITLE', payload: 'Final Review' });
        break;
      case 'review':
        dispatch({ type: 'SET_NAV_TITLE', payload: 'Review' });
        break;
      case 'complete':
        dispatch({ type: 'SET_NAV_TITLE', payload: 'Congratulations!' });
        break;
    }
  }, [currentStage]);

  const pickRandomCardFrom = (cardsArray) => {
    // if there's only one card left, return it
    if (cardsArray.length === 1) {
      return cardsArray[0];
    }
    // else pick a random card
    // this will find a random index between 0 and the array length,
    // not including the number of the length (so 0 to length-1)
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
      resetCardToNew();
    } else if (currentStage === 'seen') {
      // remove the card
      removeCardFromSeen();
      // place this card in the newCard box
      resetCardToNew();
    } else if (currentStage === 'shortTerm') {
      // remove the card
      removeCardFromShortTerm();
      // this card will have to be reviewed as a new card in
      // the next session
      dispatch({
        type: 'UPDATE_CARD_FAMILIARITY',
        payload: {
          id: currentCard.student_class_card_id,
          familiarity: 0,
        },
      });
    }
    setIsRevealed(false);
    // if the total timer has run out and we're in the seen stage,
    // move on to the shortTerm stage
    // it's time to review all the cards we've learned in this session
    if (currentStage === 'seen' && totalTime === 0) {
      setCurrentStage('shortTerm');
    }
  };

  const resetCardToNew = () => {
    setNewCards([...newCards, currentCard]);
    // make sure the next card is not revealed!
    setIsRevealed(false);
    // the useEffect will trigger a new random card pick
  };

  // the user has clicked yes
  const handleYes = () => {
    // if this is in the review stage, we have to send a dispatch
    if (currentStage === 'review') {
      dispatch({
        type: 'UPDATE_CARD_FAMILIARITY',
        payload: {
          id: currentCard.student_class_card_id,
          familiarity:
            currentCard.familiarity < 10 && currentCard.familiarity + 1,
        },
      });
      removeCardFromReview();
    } else if (currentStage === 'seen') {
      moveToShortTermBox();
      removeCardFromSeen();
      setIsRevealed(false);
    } else if (currentStage === 'shortTerm') {
      // the user knows this card; it needs to be reviewed later
      // so upgrade its familiarity with 1
      // but don't ever have more than 10
      dispatch({
        type: 'UPDATE_CARD_FAMILIARITY',
        payload: {
          id: currentCard.student_class_card_id,
          familiarity:
            currentCard.familiarity < 10 && currentCard.familiarity + 1,
        },
      });
      removeCardFromShortTerm();
      setIsRevealed(false);
      // update the counter that keeps track of how many new cards have been learned
      setNumNewCardsLearnedInSession(numNewCardsLearnedInSession + 1);
    }
    // if the total timer has run out and we're in the seen stage,
    // move on to the shortTerm stage
    // it's time to review all the cards we've learned in this session
    if (currentStage === 'seen' && totalTime === 0) {
      setCurrentStage('shortTerm');
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
      refreshTimer();
    } else {
      // remove this card from the cardsToReview box
      const beginArr = cardsToReview.slice(0, currentCardIndex);
      const endArr = cardsToReview.slice(currentCardIndex + 1);
      setCardsToReview([...beginArr, ...endArr]);
    }
  };

  // removes the card from the seen box
  const removeCardFromSeen = () => {
    // if this is the final card in the box
    if (cardsSeen.length === 1) {
      // this box is now empty
      setCardsSeen([]);
      // and we're moving into a different stage
      if (newCards.length > 0) {
        // there's still more new cards to learn
        setCurrentStage('new');
        refreshTimer();
      } else {
        // we're moving to the shortTerm review stage
        setCurrentStage('shortTerm');
      } // end if newCards.length
    } else {
      // remove this card from the cardsSeen box
      const beginArr = cardsSeen.slice(0, currentCardIndex);
      const endArr = cardsSeen.slice(currentCardIndex + 1);
      setCardsSeen([...beginArr, ...endArr]);
    }
  };

  // removes the card from the shortTerm box
  const removeCardFromShortTerm = () => {
    // if this is the final card in the box
    if (cardsShortTerm.length === 1) {
      // this box is now empty
      setCardsShortTerm([]);
      //we've gone through all the cards
      setCurrentStage('complete');
      // set the timers to 0
      setTotalTime(0);
      setLearnTime(0);
    } else {
      // remove this card from the cardsShortTerm box
      const beginArr = cardsShortTerm.slice(0, currentCardIndex);
      const endArr = cardsShortTerm.slice(currentCardIndex + 1);
      setCardsShortTerm([...beginArr, ...endArr]);
    }
  };

  // moves a new card from the new box to the seen box
  const handleContinue = () => {
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

    // if the timer has run out, move on to the seen stage
    if (learnTime === 0) {
      setCurrentStage('seen');
    }
  };

  // moves a seen card from the seen box to the shortTerm box
  const moveToShortTermBox = () => {
    // if this is the final card in the box
    if (cardsSeen.length === 1) {
      // this box is now empty
      setCardsSeen([]);
      // and we're moving into the seen shortTerm stage
      setCurrentStage('shortTerm');
    } else {
      removeCardFromSeen();
    }
    // update the cardsShortTerm
    // no need to change the familiarity yet
    setCardsShortTerm([...cardsShortTerm, currentCard]);
  };

  const refreshTimer = () => {
    // refresh the timer
    if (totalTime > currentClass.initial_time * 10) {
      setLearnTime(currentClass.initial_time * 10);
    } else {
      setLearnTime(totalTime);
    }
  };

  // leaving these console.logs here for feedback
  // component refreshes frequently

  // console.log(`here are your cards to learn`, newCards);
  // console.log(`here are your cards to review`, cardsToReview);
  // console.log(`here are your cards seen`, cardsSeen);
  // console.log(`here are your cards in short term`, cardsShortTerm);
  // console.log(`here is your random card`, currentCard);
  // console.log(`we are in stage`, currentStage);
  // console.log(`time`, totalTime);
  // console.log(`current class`, currentClass);
  // console.log('currentClass.initial_time', currentClass.initial_time);

  return (
    <Container
      container
      sx={{
        height: '90vh',
        paddingTop: '45px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Conditional rendering of components based on whether  */}
      {/* we are complete or not */}
      {/* else show the congrats button */}
      {currentStage !== 'complete' ? (
        <>
          {/* In this container, there are five sections:
          {/* the front of the card, the back of the card, */}
          {/* the timer, the feedback section, and */}
          {/* the feedback buttons */}
          {/* This is the first and second section */}
          {/* The sx needs to be set in the card, it is 20vh */}
          <Box>
            <Box sx={{ pb: '15px' }}>
              <CardBox
                cardText={currentCard.front}
                isRevealed={true}
                currentStage={currentStage}
              />
            </Box>
            <Box>
              <CardBox
                cardText={currentCard.back}
                isRevealed={isRevealed}
                currentStage={currentStage}
              />
            </Box>
          </Box>
          {/* This is the third section */}
          <Box sx={{ height: '10vh' }}>
            <Timer
              totalTime={totalTime}
              learnTime={learnTime}
              initialTotalTime={currentClass.total_time * 10}
              initialLearnTime={currentClass.initial_time * 10}
              currentStage={currentStage}
            />
          </Box>
          {/* This is the fourth section */}
          <Box sx={{ height: '3vh' }}>
            <Feedback currentStage={currentStage} isRevealed={isRevealed} />
          </Box>
          {/* This is the fifth section */}
          {/* Show different buttons depending on whether the card is revealed */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FeedbackButtons
              isRevealed={isRevealed}
              setIsRevealed={setIsRevealed}
              currentStage={currentStage}
              handleNo={handleNo}
              handleYes={handleYes}
              handleContinue={handleContinue}
            />
          </Box>
        </>
      ) : (
        <FinishedPage class_id={class_id} />
      )}
      {currentStage === 'complete' && <Confetti />}
    </Container>
  );
}

export default StudentReviewCards;
