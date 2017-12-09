import * as LRU from "lru-cache";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { IState } from "./reducers";

import { actionCreators } from "./actions";

import { NewsEntryIdentifier } from "./NewsEntry";
import NewsSource, { NewsSourceIdentifier } from "./NewsSource";

import { ListItem, ListItemText } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

import EntryView from "./EntryView";

interface IProps {
  identifier: NewsSourceIdentifier;
  source?: NewsSource;
  entries?: NewsEntryIdentifier[];
  startLoad?: (source: NewsSource, seenItems: LRU.Cache<NewsEntryIdentifier, boolean>) => void;
  seenItems?: LRU.Cache<NewsEntryIdentifier, boolean>;
}

class SourceView extends React.Component<IProps> {
  public componentDidMount() {
    this._maybeLoadSource();
  }

  public componentDidUpdate() {
    this._maybeLoadSource();
  }

  public render() {
    if (!this.props.source) {
      return <div />;
    }

    const sourceHeader = <ListSubheader key='subheader'>{this.props.source.identifier}</ListSubheader>;

    let detail: JSX.Element | JSX.Element[] | undefined;
    if (this.props.source.isLoading) {
      detail = <ListItem key='loading'><ListItemText primary='Loading...' /></ListItem>;
    } else if (this.props.source.isLoaded && this.props.entries) {
      const entryViews = this.props.entries.map(identifier => {
        return <EntryView identifier={identifier} key={identifier} />;
      });
      detail = entryViews;
    } else {
      detail = <ListItem key='empty' />;
    }

    return [
      sourceHeader,
      detail,
    ];
  }

  private _maybeLoadSource() {
    if (!this.props.source || !this.props.startLoad || !this.props.seenItems) {
      return;
    }

    if (!this.props.source.isLoaded && !this.props.source.isLoading) {
      this.props.startLoad(this.props.source, this.props.seenItems);
    }
  }
}

const mapStateToProps = (state: IState, ownProps: IProps): Partial<IProps> => {
  return {
    entries: state.sourceEntries[ownProps.identifier],
    seenItems: state.seenItems,    
    source: state.subscribedSources[ownProps.identifier],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<IProps> => {
  return {
    startLoad(source: NewsSource, seenItems: LRU.Cache<NewsEntryIdentifier, boolean>) {
      dispatch(actionCreators.startSourceLoad(source.identifier));
      NewsSource.fetchEntries(source, seenItems).then(entries => {
        dispatch(actionCreators.stopSourceLoad(source.identifier, entries));
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);
