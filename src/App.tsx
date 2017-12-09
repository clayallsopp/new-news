import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { actionCreators } from "./actions";
import NavBar from "./NavBar";
import NewsEntry from './NewsEntry';
import NewsView from "./NewsView";
import { EntryScrollCheckCallback, IState } from "./reducers";

import "./App.css";

interface IProps {
  scrollCallbacks?: EntryScrollCheckCallback[];
  markEntriesAsSeen?: (entries: NewsEntry[]) => void;
}

class App extends React.Component<IProps> {
  private ticking: boolean;
  
  public render() {
    return (
      <div className="App">
        <NavBar />
        <div className='AppContainer' ref={(ref) => ref && ref.addEventListener('scroll', this.onScroll)}>
          <NewsView />
        </div>
      </div>
    );
  }

  private onScroll = () => {
    if (this.ticking) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (this.props.scrollCallbacks) {
        const results = this.props.scrollCallbacks.map(cb => cb());
        const entriesToSet = results.filter((r) => r.entry && r.seen && !r.skip).map((r) => r.entry) as NewsEntry[];
        if (this.props.markEntriesAsSeen) {
          this.props.markEntriesAsSeen(entriesToSet);
        }
      }
      this.ticking = false;      
    });
    this.ticking = true;
  };
}

const mapStateToProps = (state: IState, ownProps: IProps): Partial<IProps> => {
  return {
    scrollCallbacks: state.scrollCallbacks,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<IProps> => {
  return {
    markEntriesAsSeen(entries: NewsEntry[]) {
      dispatch(actionCreators.markEntriesAsSeen(entries.map(e => e.id)));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
