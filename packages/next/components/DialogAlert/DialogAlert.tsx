import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import useStyles from './DialogAlert.style';

interface DialogAlertProps {
  open: boolean;
  close: () => void;
  confirm: () => void;
  title: string;
  description: string;
}

const DialogAlert = (props: DialogAlertProps): React.ReactElement => {
  const { open, close, confirm, title, description } = props;
  const classes = useStyles();

  return (
    <Dialog open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirm} color="primary" variant="contained" autoFocus>Confirmar</Button>
        <Button onClick={close} color="primary" variant="outlined">Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlert;
