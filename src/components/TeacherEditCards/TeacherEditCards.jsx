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

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
  table: {
    marginTop: '30px',
  },
}));

function TeacherEditCards() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the local state
  const [stackName, setStackName] = useState('');

  // set up the mui styles
  const { container, table } = useStyles();

  // fetch the id for this stack from the useParams hook
  const { stack_id } = useParams();

  // on page load, set nav bar title
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: `Editing Stack` });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
  }, []);

  // every time the stack name changes, do a dispatch to set the nav title
  useEffect(() => {
    dispatch({
      type: 'SET_NAV_TITLE',
      payload: `Editing Stack${stackName !== '' ? ': ' + stackName : ''}`,
    });
  }, [stackName]);

  return (
    <Container className={container}>
      <TextField
        type="text"
        label="Card Stack Name"
        size="small"
        autoFocus
        required
        value={stackName}
        onChange={(event) => {
          setStackName(event.target.value);
        }}
        // this will send a dispatch whenever the TextField loses focus
        onBlur={() =>
          dispatch({
            type: 'UPDATE_STACK',
            payload: { id: stack_id, name: stackName },
          })
        }
      />
    </Container>
  );
}

export default TeacherEditCards;
