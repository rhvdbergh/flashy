// this component is a main view
// it is used for students to learn new cards
// and to review cards that have previously been learned

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function StudentReviewCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Learning Cards: ' });
  }, []);
  return <p>StudentReviewCards Component</p>;
}

export default StudentReviewCards;
