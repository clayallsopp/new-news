import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import * as React from "react";

export default class NavBar extends React.Component {
  public render() {
    return <AppBar>
      <Toolbar>
        <Typography type="title" color="inherit">
          The New News
        </Typography>
      </Toolbar>
    </AppBar>;
  }
}
