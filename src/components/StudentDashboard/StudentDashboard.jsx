// this component is a main view where students
// can see which classes they are enrolled in,
// select new classes, and see which classes have cards
// that need to be reviewed

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function StudentDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);
  return <p>StudentDashboard Component</p>;
}

export default StudentDashboard;
