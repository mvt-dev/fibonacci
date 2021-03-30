import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: '500px',
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
}));

export default useStyles;
