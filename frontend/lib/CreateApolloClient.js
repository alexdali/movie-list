import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import 'cross-fetch/polyfill';
import dotenv from 'dotenv';
// import { CURRENT_USER_QUERY } from '../components/User';

const httpLink = createHttpLink({
  // uri: process.env.PROD_ENDPOINT,
  // uri: process.env.ENDPOINT,
  uri: process.env.NODE_ENV === 'development' ? process.env.ENDPOINT : process.env.PROD_ENDPOINT,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) =>
  // return the headers to the context so httpLink can read them
  ({
    headers: {
      ...headers,
    },
  }));

const cache = new InMemoryCache();

function CreateApolloClient() {
  const client = new ApolloClient({
    cache,
    // resolver of mutation for local cache
    resolvers: {
      // Mutation: {
      //   currentUser: (_root, args, { cache }) => {
      //     // read the cartOpen value from the cache
      //     const dataCache = cache.readQuery({
      //       query: CURRENT_USER_QUERY,
      //     });
      //     const user = args;
      //     user.__typename = 'currentUser';
      //     const data = { data: { currentUser: { ...user } } };
      //     cache.writeData(data);
      //     return null;
      //   },
      // },
    },
    link: ApolloLink.from([
      authLink,
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ));
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      httpLink,
    ]),
  });

  // add initial state for local cache
  // cache.writeData({
  //   data: {
  //     currentUser: {
  //       id: '', name: '', email: '', __typename: '',
  //     },
  //   },
  // });

  return client;
}

export default CreateApolloClient;
