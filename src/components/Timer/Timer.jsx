// import mui
import { Box, Typography, LinearProgress } from '@mui/material';

function Timer({
  totalTime,
  learnTime,
  initialTotalTime,
  initialLearnTime,
  currentStage,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2">
        Total Time Left: {Math.round(totalTime / 10)}
      </Typography>
      <Box sx={{ width: '100%', mb: '10px' }}>
        <LinearProgress
          variant="determinate"
          value={100 - (totalTime / initialTotalTime) * 100}
          sx={{ height: '4vh', borderRadius: '10px' }}
        />
      </Box>
      {/* Only show the Learn Time Left timer in the new stage */}
      {currentStage === 'new' && (
        <>
          <Typography variant="body2">
            Time to Learn New Cards: {Math.round(learnTime / 10)}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={100 - (learnTime / initialLearnTime) * 100}
              sx={{ height: '4vh', borderRadius: '10px', color: '#304ffe' }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Timer;
