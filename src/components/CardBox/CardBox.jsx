// import mui
import { Box, Typography, Paper } from '@mui/material';

function CardBox({ cardText, isRevealed, currentStage }) {
  // set the background color depending on the stage
  let bgcol = '#ffecb3'; // the default color
  switch (currentStage) {
    case 'new':
      bgcol = '#ffecb3';
      break;
    case 'seen':
      bgcol = '#fff59d';
      break;
    case 'shortTerm':
      bgcol = '#03a9f4';
      break;
    case 'review':
      bgcol = '#ffab91';
  }

  return (
    <Paper
      sx={{
        height: '20vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: bgcol,
      }}
    >
      <Box>
        {isRevealed && <Typography variant="h6">{cardText}</Typography>}
      </Box>
    </Paper>
  );
}

export default CardBox;
