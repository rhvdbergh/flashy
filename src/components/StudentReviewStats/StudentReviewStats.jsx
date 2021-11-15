// this component is a main view where
// students can review their stats after
// they have reviewed cards

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function StudentReviewStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Review Stats:' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);
  return <p>StudentReviewStats Component</p>;
}

export default StudentReviewStats;
