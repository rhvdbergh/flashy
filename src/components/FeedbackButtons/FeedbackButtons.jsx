// import mui
import { Box, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  wideButton: {
    width: '100%',
    height: '70px',
  },
  yesNoButtons: {
    width: '40vw',
    height: '70px',
  },
}));

function FeedbackButtons({
  isRevealed,
  setIsRevealed,
  currentStage,
  handleContinue,
  handleNo,
  handleYes,
}) {
  // get the mui styles
  const { wideButton, yesNoButtons } = useStyles();

  return (
    <>
      {!isRevealed ? (
        <Button
          variant="contained"
          onClick={() => setIsRevealed(true)}
          className={wideButton}
        >
          <Typography variant="h5">Reveal Card</Typography>
        </Button>
      ) : currentStage === 'new' ? (
        <Button
          variant="contained"
          onClick={handleContinue}
          className={wideButton}
        >
          <Typography variant="h5">Continue</Typography>
        </Button>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'space-between',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="contained"
            onClick={handleNo}
            className={yesNoButtons}
            sx={{ marginRight: '20px', marginLeft: '20px' }}
          >
            <Typography variant="h5">No</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleYes}
            className={yesNoButtons}
            sx={{ marginRight: '20px', marginLeft: '20px' }}
          >
            <Typography variant="h5">Yes</Typography>
          </Button>
        </Box>
      )}
    </>
  );
}

export default FeedbackButtons;
