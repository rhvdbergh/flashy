// this component is a main view
// teachers can add or edit classes on this screen

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherEditClass() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class: ' });
  }, []);

  return <p>TeacherEditClass Component</p>;
}

export default TeacherEditClass;
