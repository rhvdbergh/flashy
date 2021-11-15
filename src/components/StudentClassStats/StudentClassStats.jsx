// this component is a main view where students view stats
// about cards in a specific class they are enrolled in

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function StudentClassStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Stats:' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  return <p>StudentClassStats Component</p>;
}

export default StudentClassStats;
