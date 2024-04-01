import moment from 'moment';
import Container from './container';

import classes from './main-footer.module.scss';

export default function MainFooter() {
  return (
    <footer className={classes.mainFooter}>
      <Container md>
        <p>Perfectapp {moment().format('YYYY')}. Derechos Reservados.</p>
      </Container>
    </footer>
  );
}
