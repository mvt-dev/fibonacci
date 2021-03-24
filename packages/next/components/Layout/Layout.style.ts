import { makeStyles } from '@material-ui/core/styles';

const menuSize = '200px';

const useStyles = makeStyles((theme) => ({
  listBox: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    width: menuSize,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0
  },
  container: {
    marginLeft: '200px',
    width: `calc(100% - ${menuSize})`,
    padding: theme.spacing(2)
  }
}));

export default useStyles;
