import React from 'react';
import List from '../components/List';
import UserRatings from '../components/UserRatings';

const ListPage = ({ query }) => {
  if (query.id) {
    return <List id={query.id}/>;
  }
  return <UserRatings />;
};

export default ListPage;
