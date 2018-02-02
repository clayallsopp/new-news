import { createMuiTheme, MuiThemeProvider, Theme } from 'material-ui/styles';
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { actionCreators } from "./actions";
import NavBar from "./NavBar";
import NewsEntry from './NewsEntry';
import NewsView from "./NewsView";
import { EntryScrollCheckCallback, IState } from "./reducers";
import server, { ISerializedState } from "./server";

import grey from 'material-ui/colors/grey';

import "./App.css";

interface IProps {
  nightMode?: boolean;
  scrollCallbacks?: EntryScrollCheckCallback[];
  serverInitialized?: boolean;
  markEntriesAsSeen?: (entries: NewsEntry[]) => void;
  initializeServer?: (serializedState: ISerializedState | null) => void;
}

class App extends React.Component<IProps> {
  private ticking: boolean;
  private theme: Theme;

  public componentDidMount() {
    if (!this.props.serverInitialized && this.props.initializeServer) {
      const initializeServer = this.props.initializeServer;
      server.subscribe((snapshot) => {
        if (server.serverSavingLocally) {
          return;
        }
        if (snapshot) {
          const serializedState = snapshot.val();
          if (!serializedState) {
            initializeServer(null);
          }
          else {
            // Firebase doesn't serialize empty arrays
            serializedState.seenItems = serializedState.seenItems || [];
            serializedState.subscribedSources = serializedState.subscribedSources || [];
            initializeServer(serializedState);
          }
        }
        else {
          initializeServer(null);
        }

      });
    }
  }

  public componentDidUpdate() {
    const htmlNode = document.getElementsByTagName('html')[0];
    htmlNode.style.background = this.theme.palette.background.paper;
  }
  
  public render() {
    this.theme = createMuiTheme({
      palette: {
        primary: this.props.nightMode ? grey : undefined,
        type: this.props.nightMode ? 'dark' : 'light',
      },
    });
    if (!this.props.serverInitialized) {
      return  <MuiThemeProvider theme={this.theme}>
          <div className="App">
          <NavBar />
        </div>
      </MuiThemeProvider>;
    }

    return (
      <MuiThemeProvider theme={this.theme}>
        <div className="App">
          <NavBar />
          <div className='AppContainer' ref={(ref) => ref && ref.addEventListener('scroll', this.onScroll)}>
            <NewsView />
          </div>
        </div>
      </MuiThemeProvider>
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
    nightMode: state.nightMode,
    scrollCallbacks: state.scrollCallbacks,
    serverInitialized: state.serverInitialized,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<{}>): Partial<IProps> => {
  return {
    markEntriesAsSeen(entries: NewsEntry[]) {
      dispatch(actionCreators.markEntriesAsSeen(entries.map(e => e.id)));
    },
    initializeServer(serializedState: ISerializedState | null) {
      dispatch(actionCreators.onServerInitialized(serializedState));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
