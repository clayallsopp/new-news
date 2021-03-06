import * as firebase from "firebase";
import * as LRU from "lru-cache";

import { NewsEntryIdentifier } from "./NewsEntry";

const config = {
  apiKey: "AIzaSyAstruHsZLy_mbEPqMMGCNkD51VBUhYLlQ",
  authDomain: "new-news-535d2.firebaseapp.com",
  databaseURL: "https://new-news-535d2.firebaseio.com",
  messagingSenderId: "858423801819",
  projectId: "new-news-535d2",
  storageBucket: "new-news-535d2.appspot.com"
};
firebase.initializeApp(config);

if (!firebase.database) {
  throw new Error("firebase.database undefined");
}

const database = firebase.database();

export interface ISerializedState {
  subscribedSources: string[];
  seenItems: Array<LRU.LRUEntry<NewsEntryIdentifier, boolean>>;
}

const userId = window.location.pathname.split("/")[1];
const reference = database.ref("users/" + userId);

interface IDataSnapshot extends firebase.database.DataSnapshot {
  val(): ISerializedState | null;
}

const serverApi = {
  save: (datum: ISerializedState) => reference.set(datum),
  serverSavingLocally: false,
  subscribe: (cb: (a: IDataSnapshot | null, b?: string | null | undefined) => any) => {
    return reference.on("value", cb);
  }
};
export default serverApi;
