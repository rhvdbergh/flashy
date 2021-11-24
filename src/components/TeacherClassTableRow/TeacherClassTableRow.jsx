// a row in the class table on the teacher dashboard

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// import mui
import { TableCell, TableRow, Typography } from '@mui/material';
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
          color="error"
          onClick={() => dispatch({ type: 'DELETE_CLASS', payload: cl.id })}
        />
      </TableCell>
      {/* Conditional render based on whether a stack is assigned or not */}
      <TableCell align="center">
        {cl.stack_id ? (
          <CheckCircleIcon color="primary" />
        ) : (
          <CancelIcon color="warning" />
        )}
      </TableCell>
      <TableCell align="center">
        <Typography variant="body1">{cl.num_students}</Typography>
      </TableCell>
      <TableCell align="center">
        {/* Only show icon if there is at least one student enrolled in the class */}
        {cl.num_students > 0 && (
          <DonutLargeIcon
            color="secondary"
            onClick={() => history.push(`/class/progress/${cl.id}`)}
          />
        )}
      </TableCell>
      <TableCell align="center">
        <FormatListBulletedIcon
          color="success"
          onClick={() => history.push(`/editclass/${cl.id}`)}
        />
      </TableCell>
    </TableRow>
  );
}

export default TeacherClassTableRow;
