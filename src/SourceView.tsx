import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';

import { actionCreators } from './actions';

import NewsSource, { NewsSourceIdentifier } from './NewsSource';
import { NewsEntryIdentifier } from './NewsEntry';

import EntryView from './EntryView';

interface Props {
  identifier: NewsSourceIdentifier;
  source?: NewsSource;
  entries?: NewsEntryIdentifier[];
  startLoad?: (source: NewsSource) => void;
}

class SourceView extends React.Component<Props> {
  componentDidMount() {
    this._maybeLoadSource();
  }

  componentDidUpdate() {
    this._maybeLoadSource();
  }

  render() {
    if (!this.props.source) {
      return <div />;
    }

    const sourceHeader = <div>{this.props.source.identifier}</div>;

    let detail: JSX.Element | undefined = undefined;
    if (this.props.source.isLoading) {
      detail = <div>Loading...</div>;
    } else if (this.props.source.isLoaded && this.props.entries) {
      const entryViews = this.props.entries.map((identifier) => {
        return <EntryView identifier={identifier} key={identifier} />;
      });
      detail = <div>{entryViews}</div>;
    } else {
      detail = <div />;
    }

    return (
      <div>
        {sourceHeader}
        {detail}
      </div>
    );
  }

  private _maybeLoadSource() {
    if (!this.props.source || !this.props.startLoad) {
      return;
    }

    if (!this.props.source.isLoaded && !this.props.source.isLoading) {
      this.props.startLoad(this.props.source);
    }
  }
}

const mapStateToProps = (state: State, ownProps: Props): Partial<Props> => {
  return {
    source: state.subscribedSources[ownProps.identifier],
    entries: state.sourceEntries[ownProps.identifier],
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<Props> => {
  return {
    startLoad(source: NewsSource) {
      dispatch(actionCreators.startSourceLoad(source.identifier));
      NewsSource.fetchEntries(source).then((entries) => {
        dispatch(actionCreators.stopSourceLoad(source.identifier, entries));
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);