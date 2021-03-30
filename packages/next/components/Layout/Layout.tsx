import React from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Snackbar from '../Snackbar';
import useStyles from './Layout.style';


const Layout = (props: React.PropsWithChildren<any>): React.ReactElement => {
  const { children } = props;
  const classes = useStyles();

  return (
    <section>
      <Snackbar />
      <nav>
        <List className={classes.listBox}>
          <ListItem button>
            <ListItemText primary="Contas" />
          </ListItem>
        </List>
      </nav>
      <main className={classes.container}>
        <Container maxWidth="lg">
          { children }
        </Container>
      </main>
    </section>
  );
};

export default Layout;
