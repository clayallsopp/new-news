import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch } from "react-redux";
import { actionCreators } from "./actions";
import { IState } from "./reducers";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";

import "./EntryView.css";

interface IProps {
  identifier: NewsEntryIdentifier;
  entry?: NewsEntry;
  seen?: boolean;
  markEntryAsSeen?: (entry: NewsEntry) => void;
}

class EntryView extends React.Component<IProps> {
  private ticking: boolean;

  public componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const window = node.ownerDocument.defaultView;
    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this);
    const window = node.ownerDocument.defaultView;
    window.removeEventListener("scroll", this.onScroll);
  }

  public render() {
    if (!this.props.entry) {
      return;
    }

    return (
      <div style={{ opacity: this.props.seen ? 0.5 : 1 }}>
        <a
          className="EntryViewLink"
          href={this.props.entry.url}
          target="_blank"
        >
          {this.props.entry.title}
        </a>
      </div>
    );
  }

  private onScroll = () => {
    if (this.ticking || this.props.seen) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (!this.props.markEntryAsSeen || !this.props.entry) {
        return;
      }

      const node = ReactDOM.findDOMNode(this);
      if (node.getBoundingClientRect().bottom < 0) {
        this.props.markEntryAsSeen(this.props.entry);
      }
      this.ticking = false;
    });
    this.ticking = true;
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
    markEntryAsSeen(entry: NewsEntry) {
      dispatch(actionCreators.markEntryAsSeen(entry.id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryView);
