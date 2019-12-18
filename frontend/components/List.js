import React from 'react';
import { Query } from 'react-apollo';
// import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withUserContext from '../lib/withUserContext';
import LoadingBar from './LoadingBar';
import ListBlock from './ListBlock';
import { LIST_QUERY } from './ItemsListQueries';
import ErrorMessage from './ErrorMessage';


const List = (props) => {
  let { authors } = props;
  if (authors === null) authors = [];
  return (
    <Query query={LIST_QUERY}
      variables={{ id: props.id }}
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingBar count={1}/>;
        if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
        if ((typeof data === 'undefined') || (data.list === null)) return null;
        let author = authors.find((el) => el.id === data.list.userId);
        if (typeof author === 'undefined') {
          author = {
            id: '',
            name: '',
            email: '',
            numberOfLists: 0,
            numberOfItems: 0,
          };
        }
        const list = { ...data.list };
        list.author = { ...author };
        return (
            <div>
              <ListBlock listblock={list} />
            </div>
        );
      }}
    </Query>
  );
};

export default withUserContext(List);
