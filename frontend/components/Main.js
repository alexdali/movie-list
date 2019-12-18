import React, { Component } from 'react';
import withUserContext from '../lib/withUserContext';
import RatingList from './RatingList';

class Main extends Component {
  render() {
    const user = this.props.user ? this.props.user : {
      id: '',
      name: '',
      email: '',
    };
    return (
        <RatingList user={user} />
    );
  }
}

export default withUserContext(Main);
