// this component is a main view where students can view
// the progress of a specific class

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function TeacherClassProgress() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Class Progress:' });
  }, []);

  return <p>TeacherClassProgress Component</p>;
}

export default TeacherClassProgress;
