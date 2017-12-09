import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch } from "react-redux";
import { actionCreators } from "./actions";
import { EntryScrollCheckCallback, IState } from "./reducers";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";

import Button from 'material-ui/Button';
import { ListItem } from 'material-ui/List';

import "./EntryView.css";

interface IProps {
  identifier: NewsEntryIdentifier;
  entry?: NewsEntry;
  seen?: boolean;
  addEntryListener?: (cb: EntryScrollCheckCallback) => void;
}

class EntryView extends React.Component<IProps> {
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
         style={{ opacity: this.props.seen ? 0.5 : 1 }}
         disableGutters
        >
        <Button
                href={this.props.entry.url}
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

export default connect(mapStateToProps, mapDispatchToProps)(EntryView);
