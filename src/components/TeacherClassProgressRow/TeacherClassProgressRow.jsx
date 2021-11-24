// a row in the class progress table

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// import mui
import { TableCell, TableRow } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

// the cl prop is the class displayed in this row
function TeacherClassProgressRow({ student }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the history hook
  const history = useHistory();

  return (
    <TableRow>
      <TableCell>{student.first_name}</TableCell>
      <TableCell>{student.last_name}</TableCell>
      <TableCell align="center">{student.learned_cards}</TableCell>
      <TableCell align="center">{student.not_learned_cards}</TableCell>
      <TableCell align="center">{student.completed_sessions}</TableCell>
      <TableCell align="center">
        <DonutLargeIcon
          color="secondary"
          onClick={() =>
            history.push(`/class/progress/details/${student.student_class_id}`)
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default TeacherClassProgressRow;
