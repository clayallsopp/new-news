import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import { actionCreators } from './actions';

import NewsEntry, { NewsEntryIdentifier } from './NewsEntry';

import './EntryView.css';

interface Props {
  identifier: NewsEntryIdentifier;
  entry?: NewsEntry;
  seen?: boolean;
  markEntryAsSeen?: (entry: NewsEntry) => void;
}

class EntryView extends React.Component<Props> {
  private _ticking: boolean;

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const window = node.ownerDocument.defaultView;
    window.addEventListener('scroll', this._onScroll);    
  }

  componentWillUnmount() {
    const node = ReactDOM.findDOMNode(this);
    const window = node.ownerDocument.defaultView;
    window.removeEventListener('scroll', this._onScroll);    
  }

  render() {
    if (!this.props.entry) {
      return;
    }

    return (
      <div style={{ opacity: this.props.seen ? 0.5 : 1 }}>
        <a className="EntryViewLink" href={this.props.entry.url} target="_blank">{this.props.entry.title}</a>
      </div>
    );
  }

  private _onScroll = () => {
    if (this._ticking || this.props.seen) {
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
      this._ticking = false;
    });
    this._ticking = true;
  }
}

const mapStateToProps = (state: State, ownProps: Props): Partial<Props> => {
  return {
    entry: state.entries[ownProps.identifier],
    seen: state.seenItems.get(ownProps.identifier),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<Props> => {
  return {
    markEntryAsSeen(entry: NewsEntry) {
      dispatch(actionCreators.markEntryAsSeen(entry.id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryView);