import * as LRU from "lru-cache";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { IState } from "./reducers";

import { actionCreators } from "./actions";

import { NewsEntryIdentifier } from "./NewsEntry";
import NewsSource, { NewsSourceIdentifier } from "./NewsSource";

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

    const sourceHeader = <div>{this.props.source.identifier}</div>;

    let detail: JSX.Element | undefined;
    if (this.props.source.isLoading) {
      detail = <div>Loading...</div>;
    } else if (this.props.source.isLoaded && this.props.entries) {
      const entryViews = this.props.entries.map(identifier => {
        return <EntryView identifier={identifier} key={identifier} />;
      });
      detail = <div>{entryViews}</div>;
    } else {
      detail = <div />;
    }

    return (
      <div>
        {sourceHeader}
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
          {detail}
        </div>
      </div>
    );
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
