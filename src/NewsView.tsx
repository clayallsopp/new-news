import * as React from "react";
import { connect } from "react-redux";
import { IState } from "./reducers";

import { NewsSourceIdentifier } from "./NewsSource";
import SourceView from "./SourceView";

import "./NewsView.css";

interface IProps {
  sources: NewsSourceIdentifier[];
}

class NewsView extends React.Component<IProps> {
  public render() {
    if (this.props.sources.length === 0) {
      return <div>Add sources</div>;
    }

    const sourceViews = this.props.sources.map(sourceIdentifier => {
      return (
        <SourceView identifier={sourceIdentifier} key={sourceIdentifier} />
      );
    });

    const buffer = <div style={{ height: "100vh" }} />;

    return (
      <div className="NewsView">
        {sourceViews}
        {buffer}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return { sources: Object.keys(state.subscribedSources) };
};

export default connect(mapStateToProps)(NewsView);
