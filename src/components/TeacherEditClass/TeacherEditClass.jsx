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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
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
  select: {
    width: '250px',
  },
}));

function TeacherEditClass() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up local state to track inputs
  const [clName, setClName] = useState('');
  const [assignedStack, setAssignedStack] = useState('');

  // draw in the mui styles
  const { container, textfield, select } = useStyles();

  // get the class_id with the useParams hook
  const { class_id } = useParams();

  // get the class being edited from the redux store
  const editClass = useSelector((store) => store.classStore.editClass);
  // get the stacks belonging to this teacher from the redux store
  const stacks = useSelector((store) => store.stackStore.stacks);

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the current stack that's being edited
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
    // get all the cards in this stack
    dispatch({ type: 'FETCH_STACKS' });
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
    setAssignedStack(editClass.stack_id);
  }, [editClass]);

  console.log(`this is stacks`, stacks);

  return (
    <Container className={container}>
      <TextField
        type="text"
        label="Class Name"
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
      <FormControl>
        <InputLabel id="select-card-stack">Select Card Stack</InputLabel>
        <Select
          labelId="select-card-stack"
          label="Select Card Stack"
          value={assignedStack}
          className={select}
          onChange={(event) => setAssignedStack(event.target.value)}
          onBlur={() => {
            dispatch({
              type: 'UPDATE_CLASS',
              payload: { ...editClass, stack_id: assignedStack },
            });
          }}
        >
          {stacks.map((stack) => (
            <MenuItem key={stack.id} value={stack.id}>
              {stack.stack_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
}

export default TeacherEditClass;
