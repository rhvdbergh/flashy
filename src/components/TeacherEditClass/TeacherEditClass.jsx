// this component is a main view
// teachers can add or edit classes on this screen

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
  const [clName, setClName] = useState();

  // draw in the mui styles
  const { container, textfield } = useStyles();

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class: ' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

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
          // if the stackName is empty, we do not want to update the name
          dispatch({
            type: 'UPDATE_CLASS',
            payload: { id: user_id, name: clName },
          });
        }}
      />
    </Container>
  );
}

export default TeacherEditClass;
