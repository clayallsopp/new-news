import AppBar from 'material-ui/AppBar';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { actionCreators } from "./actions";
import { IState } from "./reducers";

interface IProps {
  nightMode?: boolean;
  setNightMode?: (nightMode: boolean) => void;
}

class NavBar extends React.Component<IProps> {
  public render() {
    return <AppBar>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography type="title" color="inherit">
          The New News
        </Typography>
        <Switch checked={this.props.nightMode} onChange={this.onSwitchChange} />
      </Toolbar>
    </AppBar>;
  }

  private onSwitchChange = () => {
    if (!this.props.setNightMode) {
      return;
    }
    this.props.setNightMode(!this.props.nightMode);
  }

}

const mapStateToProps = (state: IState): Partial<IProps> => {
  return {
    nightMode: state.nightMode,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<IProps> => {
  return {
    setNightMode(nightMode: boolean) {
      dispatch(actionCreators.setNightMode(nightMode));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
