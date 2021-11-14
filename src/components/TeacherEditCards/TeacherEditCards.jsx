// this component is a main view
// teachers can add or edit card stacks on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherEditCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Stack: ' });
  }, []);

  return <p>TeacherEditCards Component</p>;
}

export default TeacherEditCards;
