// this component is a main view
// it is used for students to learn new cards
// and to review cards that have previously been learned

import { useEffect } from 'react';
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
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

function StudentReviewCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // grab the class id from the params
  const { class_id } = useParams();

  // grab the cards to review from the redux store
  const cards = useSelector((store) => store.stackStore.cardsToReview);

  // on page load
  useEffect(() => {
    //set nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Cards' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARDS_TO_REVIEW', payload: class_id });
  }, []);

  console.log(`here are your cards`, cards);
  return <p>StudentReviewCards Component</p>;
}

export default StudentReviewCards;
