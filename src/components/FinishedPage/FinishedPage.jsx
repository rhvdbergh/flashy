// import mui
import { Box, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

function FinishedPage({ class_id }) {
  // set up the useHistory hook to navigate
  const history = useHistory();

  return (
    <Box
      sx={{
        marginTop: '10vh',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h2">Finished!</Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          Congratulations! You've reviewed all your cards for this class.
        </Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => history.push(`/reviewstats/${class_id}`)}
          sx={{ height: '70px' }}
        >
          <Typography variant="h5">Continue</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default FinishedPage;
