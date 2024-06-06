import * as React from 'react';
import './style.css';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Task {
  title: string;
  description: string;
  deadline: dayjs.Dayjs;
  priority: string;
  isComplete: boolean;
}

function Body() {
  const [titleValidatorMessage, setTitleValidatorMessage] =
    React.useState<string>('');
  const [descriptionValidatorMessage, setDescriptionValidatorMessage] =
    React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [value, setValue] = React.useState<dayjs.Dayjs>(dayjs());
  const [priority, setPriority] = React.useState<string>('low');
  const [toDoList, setToDoList] = React.useState<Task[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [update, setUpdate] = React.useState<boolean>(false);
  const [toastOne, setToastOne] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const newTask: Task = {
    title,
    description,
    deadline: value,
    priority,
    isComplete: false,
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  const validateTitle = (value: string) => {
    if (!value) {
      setTitleValidatorMessage('Title is required!');
    } else {
      const index = toDoList.findIndex((task) => task.title === value);
      if (index < 0 || update) {
        setTitleValidatorMessage('');
      } else {
        setTitleValidatorMessage('Duplicate title!');
      }
    }
  };

  const validateDescription = (value: string) => {
    if (!value) {
      setDescriptionValidatorMessage('Description is required!');
    } else {
      setDescriptionValidatorMessage('');
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    validateTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    validateDescription(value);
  };

  const handleToastOpen = (value: string) => {
    setToastOne(true);
    setMessage(value);
  };

  const handleToastClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOne(false);
  };

  const handleClickOpen = (updateButton: boolean) => {
    setUpdate(updateButton);
    setOpen(true);
  };

  const handleUpdateOpen = (taskTitle: string) => {
    const task = toDoList.find((task) => task.title === taskTitle);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setValue(task.deadline);
      setPriority(task.priority);
      setUpdate(true);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setValue(dayjs());
    setPriority('low');
    setTitleValidatorMessage('');
    setDescriptionValidatorMessage('');
    setUpdate(false);
  };

  const handleChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const handleCheckChange = (taskTitle: string) => {
    setToDoList((prevList) =>
      prevList.map((task) =>
        task.title === taskTitle
          ? { ...task, isComplete: !task.isComplete }
          : task
      )
    );
  };

  const deleteTasks = (taskTitle: string) => {
    setToDoList((prevList) =>
      prevList.filter((task) => task.title !== taskTitle)
    );
    handleToastOpen('Task deleted successfully!');
  };

  const handleAdd = () => {
    if (!title || !description || titleValidatorMessage) {
      if (!title) setTitleValidatorMessage('Title is required!');
      if (!description)
        setDescriptionValidatorMessage('Description is required!');
      return;
    }

    if (update) {
      setToDoList((prevList) =>
        prevList.map((task) =>
          task.title === title
            ? { ...task, description, deadline: value, priority }
            : task
        )
      );
      handleToastOpen('Task updated successfully!');
    } else {
      setToDoList((prevList) => [...prevList, newTask]);
      handleToastOpen('Task added successfully!');
    }
    handleClose();
  };

  const LightButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  }));

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuIcon />
              <Typography variant="h6" component="div">
                FRAMEWORKS
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', right: 16 }}>
              <LightButton onClick={() => handleClickOpen(false)}>
                <AddCircleIcon sx={{ fontSize: 20 }} />
                Add
              </LightButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Is Complete</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toDoList.map((row) => (
              <TableRow key={row.title}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">
                  {row.deadline.format('MM/DD/YY')}
                </TableCell>
                <TableCell align="center">{row.priority}</TableCell>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    checked={row.isComplete}
                    onChange={(e) => handleCheckChange(row.title)}
                  ></input>
                </TableCell>
                <TableCell align="center">
                  {!row.isComplete ? (
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleUpdateOpen(row.title);
                          handleClickOpen(true);
                        }}
                      >
                        <EditIcon sx={{ mr: 1 }} />
                        Update
                      </Button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={(e) => deleteTasks(row.title)}
                    >
                      <ClearIcon sx={{ mr: 1 }} /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'left', position: 'relative' }}>
            {update ? (
              <EditIcon sx={{ mr: 1 }} />
            ) : (
              <AddCircleIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="h6" component="div">
              {update ? 'Edit Task' : 'Add Task'}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            {!update && (
              <TextField
                error={!!titleValidatorMessage}
                helperText={titleValidatorMessage}
                margin="normal"
                fullWidth
                required
                id="Title"
                label="Title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            )}
            <TextField
              error={!!descriptionValidatorMessage}
              helperText={descriptionValidatorMessage}
              margin="normal"
              fullWidth
              required
              id="Description"
              label="Description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
            <Box mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  className="date"
                  label="Deadline"
                  value={value}
                  onChange={handleChange}
                />
              </LocalizationProvider>
            </Box>
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Priority</FormLabel>
              <RadioGroup
                row
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <FormControlLabel value="low" control={<Radio />} label="Low" />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="high"
                  control={<Radio />}
                  label="High"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={update ? <EditIcon /> : <AddCircleIcon />}
          >
            {update ? 'Update' : 'Add'}
          </Button>
          <Button
            onClick={handleClose}
            color="error"
            variant="contained"
            startIcon={<BlockIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOne}
        autoHideDuration={5000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Body />
    </div>
  );
}
