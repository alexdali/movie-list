import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Segment } from 'semantic-ui-react';
import withUserContext from '../lib/withUserContext';
import LoadingBar from './LoadingBar';
import ErrorMessage from './ErrorMessage';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      numberOfLists
      numberOfItems
    }
  }
`;

const LeftSideBar = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingBar count={3}/>;
      if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
      if ((typeof data === 'undefined') || (data.users.length === 0)) return null;
      const { users } = data;
      const totalLists = users.reduce((sum, item) => sum + item.numberOfLists, 0);
      const totalItems = users.reduce((sum, item) => sum + item.numberOfItems, 0);
      return (
        <>
          <Segment>Зарегистрировано пользователей: {data.users.length}</Segment>
          <Segment>Списков на сайте: {totalLists}</Segment>
          <Segment>Фильмов на сайте: {totalItems}</Segment>
        </>
      );
    }}
  </Query>
);

export { ALL_USERS_QUERY };
export default withUserContext(LeftSideBar);
