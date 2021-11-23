// import mui
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';

function CardBox({ cardText, isRevealed }) {
  return (
    <Paper sx={{ height: '20vh' }}>
      <Box>{isRevealed && <Typography>{cardText}</Typography>}</Box>
    </Paper>
  );
}

export default CardBox;
