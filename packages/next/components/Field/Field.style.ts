import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  section: {
    position: 'relative'
  },
  colorDisplay: {
    position: 'absolute',
    top: '10px',
    bottom: '10px',
    left: '10px',
    right: '10px',
    borderRadius: '5px',
    color: '#fff',
    textAlign: 'right',
    paddingRight: '15px',
    cursor: 'pointer',
  }
}));

export default useStyles;
