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
  }, []);
  return <p>StudentReviewStats Component</p>;
}

export default StudentReviewStats;
