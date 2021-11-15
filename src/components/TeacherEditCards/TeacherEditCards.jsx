// this component is a main view
// teachers can add or edit card stacks on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherEditCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Stack: ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  return <p>TeacherEditCards Component</p>;
}

export default TeacherEditCards;
