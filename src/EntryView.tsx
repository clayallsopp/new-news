import * as React from 'react';

import NewsEntry from './NewsEntry';

interface Props {
  entry: NewsEntry;
}

export default class EntryView extends React.Component<Props> {
  render() {
    return (
      <div>
        <a href={this.props.entry.url} target="_blank">{this.props.entry.title}</a>
      </div>
    );
  }
}