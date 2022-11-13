import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { Provider } from "react-redux";
import { setContext } from "@apollo/client/link/context";
import { PersistGate } from "redux-persist/integration/react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import App from "./App";
import { persistor, store } from "./store";

import "./index.css";
import ThemeProvider from "context/ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = createHttpLink({
  uri: `http://localhost:3001/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:$3001/subscriptions`,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(() => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: token && token,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);
