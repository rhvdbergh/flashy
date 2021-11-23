// import mui
import { Box, Typography } from '@mui/material';

function Feedback({ currentStage, isRevealed }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant="h6">
        {/* In the new stage, there is no text here */}
        {currentStage !== 'new' && isRevealed && 'Did you know this card?'}
      </Typography>
    </Box>
  );
}

export default Feedback;
