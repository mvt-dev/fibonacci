import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  search: {
    flexGrow: 1
  },
  footer: {
    fontWeight: 'bold',
    fontSize: '0.875rem'
  },
  header: {
    cursor: 'pointer',
    userSelect: 'none'
  }
}));

export default useStyles;
