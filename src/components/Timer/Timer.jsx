// import mui
import { Box, Typography, LinearProgress } from '@mui/material';

function Timer({
  totalTime,
  learnTime,
  initialTotalTime,
  initialLearnTime,
  currentStage,
}) {
  console.log(`totalTime %:`, (totalTime / initialTotalTime) * 100);

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
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={100 - (totalTime / initialTotalTime) * 100}
          sx={{ height: '3vh' }}
        />
      </Box>
      {/* Only show the Learn Time Left timer in the new stage */}
      {currentStage === 'new' && (
        <>
          <Typography variant="h6">
            Learn Time Left: {Math.round(learnTime / 10)}
          </Typography>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={100 - (learnTime / initialLearnTime) * 100}
              sx={{ height: '3vh' }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Timer;
