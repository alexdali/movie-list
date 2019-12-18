import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Divider, Header } from 'semantic-ui-react';
import { CURRENT_USER_QUERY } from './User';
import ListCreateForm from './ListCreateForm';
import ListsByUser from './ListsByUser';
import ErrorMessage from './ErrorMessage';
import LoadingBar from './LoadingBar';

const IndexDiv = styled.div`
  margin: 52px 0 0;
`;

const UserRatings = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingBar count={2}/>;
      if (error) return <ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>;
      if ((typeof data === 'undefined') || (data.me === null)) return <LoadingBar count={2}/>;
      return (
        <>
          <Header as='h1'>Личные рейтинги</Header>
          <Header as='h3'>Пользователь: {data.me.name}</Header>
          <Divider horizontal></Divider>
          <Header as='h2'>Добавить новый список</Header>
          <ListCreateForm id={data.me.id}/>
          <IndexDiv>
            <Header as='h2'>Все рейтинги</Header>
            <ListsByUser id={data.me.id}/>
          </IndexDiv>
        </>
      );
    }}
  </Query>
);

export default UserRatings;
