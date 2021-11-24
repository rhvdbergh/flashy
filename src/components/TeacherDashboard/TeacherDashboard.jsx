// this component is a main view
// it is the home screen for teachers
// teachers can add classes and stacks of cards
// they can manage these items

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

// import custom components
import TeacherClassTableRow from '../TeacherClassTableRow/TeacherClassTableRow';
import TeacherStackTableRow from '../TeacherStackTableRow/TeacherStackTableRow';

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
  const classes = useSelector((store) => store.classStore.classes);
  const stacks = useSelector((store) => store.stackStore.stacks);

  // set up the useHistory hook
  const history = useHistory();

  // get the mui styles
  const { container, table, addStackBox } = useStyles();

  // on page load, set nav bar title
  // also retrieve all the classes for this teacher
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // don't display the back button on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: false });
    dispatch({ type: 'FETCH_CLASSES' });
    dispatch({ type: 'FETCH_STACKS' });
  }, []);

  return (
    <Container className={container}>
      <Box>
        <Button
          variant="contained"
          value="add_class"
          onClick={() =>
            dispatch({ type: 'CREATE_CLASS', payload: { history: history } })
          }
        >
          Add Class
        </Button>
        <TableContainer component={Paper} className={table}>
          <Table aria-label="Classes">
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Stack Assigned</TableCell>
                <TableCell align="center">Students Enrolled</TableCell>
                <TableCell align="center">View Progress</TableCell>
                <TableCell align="center">Settings</TableCell>
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
      <Box className={addStackBox} sx={{ pb: '50px' }}>
        <Button
          variant="contained"
          value="add_stack"
          onClick={() =>
            dispatch({ type: 'CREATE_STACK', payload: { history: history } })
          }
        >
          Add Stack
        </Button>
        <TableContainer component={Paper} className={table}>
          <Table aria-label="Stacks">
            <TableHead>
              <TableRow>
                <TableCell>Card Stack Name</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Edit Stack</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stacks.map((stack) => {
                return <TeacherStackTableRow key={stack.id} stack={stack} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default TeacherDashboard;
