// this component is a main view where students view stats
// about cards in a specific class they are enrolled in

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

// import charts
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// set up chartjs
ChartJS.register(ArcElement, Tooltip, Legend);

// import responsive hook from mui
import useMediaQuery from '@mui/material/useMediaQuery';
import json2mq from 'json2mq';

// import mui
import { Box, Button, Container, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '100px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '78vh',
  },
  headingBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    height: '70px',
    width: '200px',
  },
}));

function StudentClassStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // get the mui styles
  const { container, headingBox, buttonBox, button } = useStyles();

  // grab the class id from the params
  const { class_id } = useParams();

  // set up responsive breakpoints for font sizes
  const matchesMediumAndUp = useMediaQuery(
    json2mq({
      minHeight: 800,
    })
  );

  const matchesSmallAndUp = useMediaQuery(
    json2mq({
      minHeight: 600,
    })
  );

  // set up the useHistory hook to navigate
  const history = useHistory();

  // grab the number of cards to review from the redux store
  const totalNumCards = useSelector((store) => store.stackStore.totalNumCards);
  const totalNumNewCards = useSelector(
    (store) => store.stackStore.totalNumNewCards
  );
  const totalNumReviewCards = useSelector(
    (store) => store.stackStore.totalNumReviewCards
  );
  const currentClass = useSelector((store) => store.classStore.editClass);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Stats' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the cards to review for this student in this class
    dispatch({ type: 'FETCH_CARD_NUMBERS', payload: class_id });
    // fetch the number of all the cards in this class already made available to the student
    dispatch({ type: 'FETCH_TOTAL_NUM_CARDS', payload: class_id });
    // fetch details about this class (we esp. want the name)
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
  }, []);

  console.log(`class obj`, currentClass);

  return (
    <Container className={container} sx={{ display: 'flex' }}>
      <Box className={headingBox} overflow="hidden">
        {/* If the screen is not big enough, display smaller text here */}
        {matchesMediumAndUp ? (
          <Typography variant="h5">{currentClass.class_name}</Typography>
        ) : matchesSmallAndUp ? (
          <Typography variant="h6">{currentClass.class_name}</Typography>
        ) : (
          <Typography variant="body1">{currentClass.class_name}</Typography>
        )}
      </Box>
      <Box sx={{ height: '-180px' }}>
        <Pie
          data={{
            labels: [
              'New Cards to Learn',
              'Cards to Review',
              'Cards already Learned',
            ],
            datasets: [
              {
                data: [
                  totalNumNewCards,
                  totalNumReviewCards,
                  totalNumCards - (totalNumNewCards + totalNumReviewCards),
                ],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)',
                ],
                hoverOffset: 12,
              },
            ],
          }}
        />
      </Box>
      {/* <Table>
        <TableBody>
          <TableRow>
            <TableCell>New cards to learn:</TableCell>
            <TableCell>{totalNumNewCards}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cards to review: </TableCell>
            <TableCell>{totalNumReviewCards}</TableCell>
          </TableRow>
          <TableRow></TableRow>
          <TableCell>Cards already learned:</TableCell>
          <TableCell>
            {totalNumCards - (totalNumNewCards + totalNumReviewCards)}
          </TableCell>
        </TableBody>
      </Table> */}
      {/* if there are any cards to review show the Review Cards button, else the back */}
      <Box className={buttonBox}>
        {totalNumNewCards + totalNumReviewCards > 0 ? (
          <Button
            variant="contained"
            onClick={() => history.push(`/cards/${class_id}`)}
            className={button}
          >
            <Typography variant="h6">Review Cards</Typography>
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => history.goBack()}
            className={button}
          >
            Back
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default StudentClassStats;
