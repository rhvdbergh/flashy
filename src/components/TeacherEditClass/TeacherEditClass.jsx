// this component is a main view
// teachers can add or edit classes on this screen

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

//import mui
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
  textfield: {
    width: '250px',
  },
}));

function TeacherEditClass() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up local state to track inputs
  const [clName, setClName] = useState('');

  // draw in the mui styles
  const { container, textfield } = useStyles();

  // get the class_id with the useParams hook
  const { class_id } = useParams();

  // get the class being edited from the redux store
  const editClass = useSelector((store) => store.classStore.editClass);

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the current stack that's being edited
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
    // get all the cards in this stack
  }, []);

  // every time the class name changes, do a dispatch to set the nav title
  useEffect(() => {
    dispatch({
      type: 'SET_NAV_TITLE',
      payload: `Editing Class${clName !== '' ? ': ' + clName : ''}`,
    });
  }, [clName]);

  useEffect(() => {
    // set the class name to the name of the class in the redux store
    setClName(editClass.class_name);
  }, [editClass]);

  console.log(`this is clName`, clName);

  return (
    <Container className={container}>
      <TextField
        type="text"
        label="Class Name"
        size="small"
        required
        className={textfield}
        value={clName}
        onChange={(event) => {
          setClName(event.target.value);
        }}
        // this will select the text in the name box when selected
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        // this will send a dispatch whenever the TextField loses focus
        onBlur={() => {
          // if the clName is empty, we do not want to update the name
          clName !== '' &&
            dispatch({
              type: 'UPDATE_CLASS',
              payload: { ...editClass, class_name: clName },
            });
        }}
      />
    </Container>
  );
}

export default TeacherEditClass;
