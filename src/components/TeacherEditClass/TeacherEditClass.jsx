// this component is a main view
// teachers can add or edit classes on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherEditClass() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class: ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  return <p>TeacherEditClass Component</p>;
}

export default TeacherEditClass;
