// this component is a main view
// it is the home screen for teachers
// teachers can add classes and stacks of cards
// they can manage these items

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import mui
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
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import TeacherClassTableRow from '../TeacherClassTableRow/TeacherClassTableRow';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
  },
  table: {
    marginTop: '30px',
  },
  addStackBox: {
    marginTop: '50px',
  },
}));

function TeacherDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get state from the redux store
  const classes = useSelector((store) => store.classes);

  // set up the useHistory hook
  const history = useHistory();

  // get the mui styles
  const { container, table, addStackBox } = useStyles();

  // on page load, set nav bar title
  // also retrieve all the classes for this teacher
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    dispatch({ type: 'GET_CLASSES' });
  }, []);

  return (
    <Container className={container}>
      <Box>
        <Button
          variant="contained"
          value="add_class"
          onClick={() => history.push('/editclass')}
        >
          Add Class
        </Button>
        <TableContainer component={Paper} className={table}>
          <Table aria-label="Classes">
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">View Progress</TableCell>
                <TableCell align="center">Settings</TableCell>
                <TableCell align="center">Card Assigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((cl) => {
                return <TeacherClassTableRow key={cl.id} cl={cl} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box className={addStackBox}>
        <Button
          variant="contained"
          value="add_stack"
          onClick={() => history.push('/editstack')}
        >
          Add Stack
        </Button>
      </Box>
    </Container>
  );
}

export default TeacherDashboard;
