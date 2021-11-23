// import mui
import { Box, Typography } from '@mui/material';

function Timer({ totalTime, learnTime, currentStage }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6">
        Total Time Left: {Math.round(totalTime / 10)}
      </Typography>
      {/* Only show the Learn Time Left timer in the new stage */}
      {currentStage === 'new' && (
        <Typography variant="h6">
          Learn Time Left: {Math.round(learnTime / 10)}
        </Typography>
      )}
    </Box>
  );
}

export default Timer;
