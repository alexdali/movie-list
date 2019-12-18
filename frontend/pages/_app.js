import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import UserContext from '../components/UserContext';
import Page from '../components/Page';
import ErrorBoundary from '../components/ErrorBoundary';
import { CURRENT_USER_QUERY } from '../components/User';
import { ALL_USERS_QUERY } from '../components/LeftSideBar';
import CreateApolloClient from '../lib/CreateApolloClient';

const client = CreateApolloClient({
  ssrForceFetchDelay: 100,
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  state = {
    user: null,
    authors: null,

  };

  subscriptionUser() {
    return client.watchQuery({
      query: CURRENT_USER_QUERY,
    }).subscribe({
      next: ({ data }) => {
        console.log('_app componentDidMount queryUserSubscription data: ', data);
        if (data.me !== 'undefined') { this.setState({ user: data.me }); }
      },
      error: (e) => console.error(e),
    });
  }

  subscriptionAuthors() {
    return client.watchQuery({
      query: ALL_USERS_QUERY,
    }).subscribe({
      next: ({ data }) => {
        console.log('_app componentDidMount queryAuthorsSubscription data: ', data);
        if (data.users !== 'undefined') { this.setState({ authors: data.users }); }
      },
      error: (e) => console.error(e),
    });
  }

  componentDidMount() {
    this.subscriptionUser();
    this.subscriptionAuthors();
  }

  componentWillUnmount() {
    this.subscriptionUser().unsubscribe();
    this.subscriptionAuthors().unsubscribe();
    //console.log('_app componentWillUnmount Subscription.unsubscribe');
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log('_app this.state: ', this.state);
    console.log('_app process.env.ENDPOINT: ', process.env.ENDPOINT);
    console.log('_app process.env.PROD_ENDPOINT: ', process.env.PROD_ENDPOINT);
    const user = this.state.user ? this.state.user : {
      id: '',
      name: '',
      email: '',
      numberOfLists: 0,
      numberOfItems: 0,
    };
    const authors = this.state.authors ? this.state.authors : [];
    return (
    <ErrorBoundary>
        <ApolloProvider client={client}>
          <UserContext.Provider value={{ user, authors }}>
            <Page>
              <Component {...pageProps}/>
            </Page>
            </UserContext.Provider>
        </ApolloProvider>
    </ErrorBoundary>
    );
  }
}

export { client as apolloClient };
export default MyApp;
