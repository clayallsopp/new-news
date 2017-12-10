import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch } from "react-redux";
import { actionCreators } from "./actions";
import { EntryScrollCheckCallback, IState } from "./reducers";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";

import Button from 'material-ui/Button';
import { ListItem } from 'material-ui/List';
import { Theme, withStyles, WithStyles } from 'material-ui/styles';

import "./EntryView.css";

const styles = (theme: Theme) => ({
  button: {
    borderRadius: 0,
    justifyContent: 'flex-start' as 'flex-start',
    paddingBottom: 16,    
    paddingTop: 16,
    textTransform: 'none',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    width: '100%',

    '&:hover': {
      textDecoration: 'none',
    },
  },
  navLink: {
    display: 'flex',    
    fontWeight: theme.typography.fontWeightRegular,
    paddingBottom: 0,    
    paddingTop: 0,
  },
});

interface IProps {
  identifier: NewsEntryIdentifier;
  entry?: NewsEntry;
  seen?: boolean;
  addEntryListener?: (cb: EntryScrollCheckCallback) => void;
}

class EntryView extends React.Component<IProps & WithStyles<'button' | 'navLink'>> {
  public componentDidMount() {
    if (!this.props.addEntryListener) {
      return;
    }
    this.props.addEntryListener(this.onScroll);
  }

  public render() {
    if (!this.props.entry) {
      return;
    }

    return (
      <ListItem
        className={this.props.classes.navLink}
         style={{ opacity: this.props.seen ? 0.5 : 1 }}
         disableGutters
        >
        <Button
                href={this.props.entry.url}
                className={this.props.classes.button}
                target="_blank">
        {this.props.entry.title}
        </Button>
      </ListItem>
    );
  }

  private onScroll: EntryScrollCheckCallback = () => {
    if (this.props.seen) {
      return {
        entry: this.props.entry,
        seen: true,
        skip: true,
      };
    }

    const node = ReactDOM.findDOMNode(this);
    return {
      entry: this.props.entry,
      seen: node.getBoundingClientRect().bottom < 0,
      skip: false
    };
  };
}

const mapStateToProps = (state: IState, ownProps: IProps): Partial<IProps> => {
  return {
    entry: state.entries[ownProps.identifier],
    seen: state.seenItems.get(ownProps.identifier)
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<IProps> => {
  return {
    addEntryListener(cb: EntryScrollCheckCallback) {
      dispatch(actionCreators.addEntryListener(cb));
    }
  };
};

const Styled = withStyles(styles)(EntryView);

export default connect(mapStateToProps, mapDispatchToProps)(Styled);
