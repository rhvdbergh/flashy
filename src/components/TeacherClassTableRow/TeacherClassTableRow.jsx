// a row in the class table on the teacher dashboard

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// import mui
import { TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// the cl prop is the class displayed in this row
function TeacherClassTableRow({ cl }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the history hook
  const history = useHistory();

  return (
    <TableRow>
      <TableCell>{cl.class_name}</TableCell>
      <TableCell align="center">
        <DeleteIcon
          onClick={() => dispatch({ type: 'DELETE_CLASS', payload: cl.id })}
        />
      </TableCell>
      <TableCell align="center">
        <DonutLargeIcon
          onClick={() => history.push(`/class/progress/${cl.id}`)}
        />
      </TableCell>
      <TableCell align="center">
        <FormatListBulletedIcon
          onClick={() => history.push(`/editclass/${cl.id}`)}
        />
      </TableCell>
      {/* Conditional render based on whether a stack is assigned or not */}
      <TableCell align="center">
        {cl.stack_id ? <CheckCircleIcon /> : <CancelIcon />}
      </TableCell>
    </TableRow>
  );
}

export default TeacherClassTableRow;
