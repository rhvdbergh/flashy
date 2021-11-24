// this component is a main view where students
// can see which classes they are enrolled in,
// select new classes, and see which classes have cards
// that need to be reviewed

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import mui
import {
  Box,
  Button,
  Container,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '120px',
    width: '100%',
    height: '78vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  select: {
    width: '100%',
    marginBottom: '20px',
  },
  buttonBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  badge: {
    height: '56px',
    marginTop: '30px',
    maxWidth: '400px',
  },
  button: {
    width: '80vw',
    // minWidth: '200px',
    // maxWidth: '400px',
  },
}));

function StudentDashboard() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the mui styles
  const { container, select, buttonBox, button, badge } = useStyles();

  // fetch the classes this student is enrolled in
  const enrolledClasses = useSelector(
    (store) => store.classStore.enrolledClasses
  );

  // fetch the number of overdue cards for each enrolled class
  // overdueCards is an object with the class id as key and the count as value
  const overdueCards = useSelector(
    (store) => store.classStore.enrolledClassesOverdueCardCount
  );

  // fetch all the availableClasses
  const availableClasses = useSelector(
    (store) => store.classStore.availableClasses
  );

  // set up local state to control which classes the student
  // can join
  const [stillAvailable, setStillAvailable] = useState([]);

  // set up the useHistory hook
  const history = useHistory();

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Dashboard' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: false });
    // get the list of available classes
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES' });
    // get the classes that this student are already enrolled in
    dispatch({ type: 'FETCH_ENROLLED_CLASSES' });
  }, []);

  // when we get back the availableClasses list,
  // set the classes available to this student
  useEffect(() => {
    // filter through; if the user already belongs to these classes,
    // remove them from this list
    const enrolledIds = enrolledClasses.map((enr) => enr.class_id);
    setStillAvailable(
      availableClasses.filter((cl) => {
        console.log(
          `in the filter, cl.id = `,
          cl.id,
          'and enrolledIds = ',
          enrolledIds
        );
        return !enrolledIds.includes(cl.id);
      })
    );
  }, [enrolledClasses, availableClasses]);

  // for each enrolled class, get the cards that the student needs to review
  useEffect(() => {
    // we send a dispatch for each class that the student is enrolled in
    enrolledClasses.forEach((cl) => {
      dispatch({
        type: 'FETCH_ENROLLED_CARDS_TO_REVIEW',
        payload: cl.class_id,
      });
    });
  }, [enrolledClasses]);

  // adds a class for this student
  // cl stands for class
  const addClass = (cl) => {
    // dispatch the new class to the server
    dispatch({ type: 'ADD_CLASS_FOR_STUDENT', payload: cl });
    // and remove it from the classes available to this student
    // we only want to display those that the student has not yet joined
    // this is only in local state
    const index = stillAvailable.findIndex((enr) => enr.id === cl.id);

    const tempArr = stillAvailable.splice(index, 1);
    console.log(`tempArr`, tempArr);
    setStillAvailable(tempArr);
  };

  return (
    <Container className={container}>
      <Box className={select}>
        <FormControl className={select}>
          <InputLabel id="select-class">Add Class</InputLabel>
          <Select
            labelId="select-class"
            label="Add Class"
            value={''}
            className={select}
            onChange={(event) => addClass(event.target.value)}
          >
            {stillAvailable.map((cl) => (
              <MenuItem key={cl.id} value={cl.id}>
                {cl.class_name}
              </MenuItem>
            ))}
            {stillAvailable.length === 0 && (
              <MenuItem disabled hidden>
                No Classes Available
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <Box className={buttonBox}>
        {/* For the badge: the number of overdue cards show up */}
        {/* That number is stored in the overdueCards object with  */}
        {/* the key set as the class_id */}
        {enrolledClasses.map((cl) => (
          <Badge
            key={cl.id}
            badgeContent={overdueCards[cl.class_id]}
            color="error"
            className={badge}
          >
            <Button
              variant="contained"
              className={button}
              onClick={() => history.push(`/class/stats/${cl.class_id}`)}
            >
              {cl.class_name}
            </Button>
          </Badge>
        ))}
      </Box>
    </Container>
  );
}

export default StudentDashboard;
