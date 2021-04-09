import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar as MaterialSnackbar, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { snackbarClose } from '../../store/actions/snackbar';

const Snackbar = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector((state: any) => state.snackbar);

  const onClose = () => {
    dispatch(snackbarClose());
  };

  return (
    <MaterialSnackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
      onClose={onClose}
    >
      {type && (<Alert variant="filled" severity={type} closeText={null}>{message}</Alert>)}
    </MaterialSnackbar>
  );
};

export default Snackbar;
