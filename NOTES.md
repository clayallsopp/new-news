- Data structure to store "News items"
- Data structure to store "News source"

- Redux store
  - "subscribed" sources
   - unseen items list
  - "seen items" LRU cache


When you open app
  - Check if you have any subscribed sources
    - If not, display the CTA
      - Opens a page that lets you check off discrete sources (i.e. CNN) or dynamic sources (i.e. Subreddits)
      - Discrete are labels + switches
      - Dynamic are buttons (i.e. "Add Subreddit") that add a discrete-looking source with a text field instead of label
  - When you have new subscribed sources, fetch their entries
    - Make sure we assign each an ID like `{source}{entry id}`
    - Don't add ones we've already seen to the redux store
  - Show in the UI
  - When we scroll, detect if the entry is hidden and mark it as seen
    - If we've "seen" this entry and it is visible, grey it out/drop opacity
  - Don't cache the current list of entries

AppView
  -> AppBar
    -> Plus button
    - position: fixed
  -> Content
    -> NewsView
      -> ...SourceView
        -> componentDidMount
          - Check if loaded, else start loading
        -> ...ItemView
          - On component mount, store the layout position(?)
      - On window scroll, update redux
    -> SubscribeView
      -> ...DiscreteSubscriptionView
      -> ...DynamicSubscriptionView