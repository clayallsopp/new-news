import * as React from "react";
import { connect } from "react-redux";
import { IState } from "./reducers";

import List from 'material-ui/List';
import { Theme, withStyles, WithStyles } from 'material-ui/styles';

import { NewsSourceIdentifier } from "./NewsSource";
import SourceView from "./SourceView";

import "./NewsView.css";

const styles = (theme: Theme) => ({
  listSection: {
    background: 'inherit',
  },
  root: {
    background: theme.palette.background.paper,    
    position: 'relative' as 'relative',
  }
});

interface IProps {
  sources: NewsSourceIdentifier[];
}

class NewsView extends React.Component<IProps & WithStyles<'root' | 'listSection'>> {
  public render() {
    if (this.props.sources.length === 0) {
      return <div>Add sources</div>;
    }

    const sourceViews = this.props.sources.map(sourceIdentifier => {
      return (
        <div className={this.props.classes.listSection} key={sourceIdentifier}>
          <SourceView identifier={sourceIdentifier} />
        </div>
      );
    });

    const buffer = <div style={{ height: "100vh" }} />;

    return (
      <List className={this.props.classes.root}>
        {sourceViews}
        {buffer}
      </List>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return { sources: Object.keys(state.subscribedSources) };
};

const Styled = withStyles(styles)(NewsView);

export default connect(mapStateToProps)(Styled);
