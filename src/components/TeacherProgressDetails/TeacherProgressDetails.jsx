// this component is a main view
// teachers can view the progress of
// a specific student on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherProgressDetails() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Student Progress: ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  return <p>TeacherProgressDetails Component</p>;
}

export default TeacherProgressDetails;
