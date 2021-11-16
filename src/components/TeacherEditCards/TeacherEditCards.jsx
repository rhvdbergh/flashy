// this component is a main view
// teachers can add or edit card stacks on this screen

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { useSelector } from 'react-redux';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
  table: {
    marginTop: '30px',
  },
  textfield: {
    width: '250px',
  },
}));

function TeacherEditCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the current stack to be edited from the redux store
  const editStack = useSelector((store) => store.stackStore.editStack);

  // set up the local state
  const [stackName, setStackName] = useState('');

  // set up the mui styles
  const { container, table, textfield } = useStyles();

  // fetch the id for this stack from the useParams hook
  const { stack_id } = useParams();

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: `Editing Stack` });
    // ensure that the back button is displayed on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the current stack that's being edited
    dispatch({ type: 'FETCH_STACK', payload: stack_id });
  }, []);

  // every time the stack name changes, do a dispatch to set the nav title
  useEffect(() => {
    dispatch({
      type: 'SET_NAV_TITLE',
      payload: `Editing Stack${stackName !== '' ? ': ' + stackName : ''}`,
    });
  }, [stackName]);

  useEffect(() => {
    // set the stackName to the name of the stack in the redux store
    setStackName(editStack.stack_name);
  }, [editStack]);

  console.log(`this is stackName`, stackName);
  console.log('this is editStack', editStack);

  return (
    <Container className={container}>
      <TextField
        type="text"
        label="Card Stack Name"
        size="small"
        autoFocus
        required
        className={textfield}
        value={
          stackName !== '' && stackName !== null
            ? stackName
            : `New Card Stack ${stack_id}`
        }
        onChange={(event) => {
          setStackName(event.target.value);
        }}
        // this will select the text in the name box when selected
        onFocus={(event) => {
          event.currentTarget.select();
          console.log('focus achieved');
        }}
        // this will send a dispatch whenever the TextField loses focus
        onBlur={() => {
          // if the stackName is empty, we do not want to update the name
          stackName &&
            stackName !== '' &&
            dispatch({
              type: 'UPDATE_STACK',
              payload: { id: stack_id, name: stackName },
            });
        }}
      />
    </Container>
  );
}

export default TeacherEditCards;
