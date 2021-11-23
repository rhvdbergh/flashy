// import mui
import { Box, Typography, Paper } from '@mui/material';

function CardBox({ cardText, isRevealed }) {
  return (
    <Paper
      sx={{
        height: '20vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        {isRevealed && <Typography variant="h6">{cardText}</Typography>}
      </Box>
    </Paper>
  );
}

export default CardBox;
