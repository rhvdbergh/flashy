// this component is a main view where
// students can review their stats after
// they have reviewed cards

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// import charts
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// set up chartjs
ChartJS.register(ArcElement, Tooltip, Legend);

// import responsive hook from mui
import useMediaQuery from '@mui/material/useMediaQuery';
import json2mq from 'json2mq';

// import mui
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

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
  main: {
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
  table: {
    display: 'flex',
    justifyConten: 'center',
  },
  heading: {
    paddingBottom: '30px',
  },
}));

function StudentReviewStats() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the useHistory hook to navigate
  const history = useHistory();

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

  // get the mui styles
  const { container, main, buttonBox, button, table, heading } = useStyles();

  // get the old card numbers from the redux store
  const { cards_learned, cards_reviewed } = useSelector(
    (store) => store.stackStore.latestSessionNumbers
  );
  const totalNumCards = useSelector((store) => store.stackStore.totalNumCards);

  // on page load, set nav bar title
  useEffect(() => {
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Review Stats' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // fetch the number of all the cards in this class already made available to the student
    dispatch({ type: 'FETCH_TOTAL_NUM_CARDS', payload: class_id });
  }, []);
  return (
    <Container
      className={container}
      sx={{
        display: 'flex',
      }}
    >
      <Box className={main}>
        {/* Adjust text size based on screen height */}
        {matchesMediumAndUp ? (
          <Typography variant="h2" className={heading}>
            Good job!
          </Typography>
        ) : matchesSmallAndUp ? (
          <Typography variant="h3" className={heading}>
            Good job!
          </Typography>
        ) : (
          <Typography variant="h4" className={heading}>
            Good job!
          </Typography>
        )}
      </Box>
      <Pie
        data={{
          labels: [
            'New Cards Learned',
            'Cards reviewed',
            'Total cards learned',
          ],
          datasets: [
            {
              data: [cards_learned, cards_reviewed, totalNumCards],
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
      <Box className={buttonBox}>
        <Button
          variant="contained"
          onClick={() => history.push(`/`)}
          className={button}
        >
          <Typography variant="h6">Continue</Typography>
        </Button>
      </Box>
    </Container>
  );
}

export default StudentReviewStats;
