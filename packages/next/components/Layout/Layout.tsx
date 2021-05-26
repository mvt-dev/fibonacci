import React from 'react';
import NextLink from 'next/link';
import {
  Container,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Snackbar from '../Snackbar';
import useStyles from './Layout.style';
import { MENUS } from '../../constants';


const Layout = (props: React.PropsWithChildren<any>): React.ReactElement => {
  const { children } = props;
  const classes = useStyles();

  return (
    <section>
      <Snackbar />
      <nav>
        <List className={classes.listBox}>
          {MENUS.map(menu => (
            <NextLink href={menu.href} key={menu.text}>
              <ListItem button>
                <ListItemText primary={menu.text} />
              </ListItem>
            </NextLink>
          ))}
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
