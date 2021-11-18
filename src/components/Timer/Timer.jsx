import { useEffect } from 'react';

// import mui
import { Box, Typography } from '@mui/material';

function Timer({
  totalTime,
  learnTime,
  setTotalTime,
  setLearnTime,
  currentStage,
}) {
  // note: to update state correctly, these timers need to be in a
  // repeating useEffect (i.e., without empty array!)
  useEffect(() => {
    // fire up the timers, decrease each second
    // we do it here because we now have the cards returned from the store
    const timer = setTimeout(() => {
      // only decrease the counters if they're not already 0
      if (totalTime > 0) {
        setTotalTime(totalTime - 1);
      }
      if (learnTime > 0) {
        setLearnTime(learnTime - 1);
      }
    }, 100);
    // clear the timer
    return () => clearTimeout(timer);
  });

  return (
    <Box>
      <Typography>Total Time Left: {Math.round(totalTime / 10)}</Typography>
      {/* Only show the Learn Time Left timer in the new stage */}
      {currentStage === 'new' && (
        <Typography>Learn Time Left: {Math.round(learnTime / 10)}</Typography>
      )}
    </Box>
  );
}

export default Timer;
