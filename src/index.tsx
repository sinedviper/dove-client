import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { Provider } from 'react-redux'
import { setContext } from '@apollo/client/link/context'
import { PersistGate } from 'redux-persist/integration/react'

import { SERVER_LINK } from 'utils/constants'
import { ThemeProvider } from 'utils/context'
import App from './App'
import { persistor, store } from 'store'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const httpLink = createHttpLink({
  uri: `${SERVER_LINK}/graphql`,
})

const authLink = setContext(() => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: token && token,
    },
  }
})

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
})

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>,
)
