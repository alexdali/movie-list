import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import {
  Segment, Image, Icon, Button,
} from 'semantic-ui-react';
import LoadingBar from './LoadingBar';

class ProfileSidebar extends Component {
   handleClick = () => {
     Router.push({
       pathname: '/list',
     });
   };

   render() {
     const { asPath } = this.props.router;
     const user = this.props.user ? this.props.user : {
       id: '',
       name: '',
       email: '',
       numberOfLists: 0,
       numberOfItems: 0,
     };
     const { name } = user;
     if (typeof this.props.user === 'undefined' || this.props.user === null) return <LoadingBar count={3}/>;
     return (
        <Segment>
          {name && <>
            <Segment textAlign='center'>
              <div>
                <Icon name="user outline" circular size='big' />
              </div>
              <div>{user.name}</div>
            </Segment>
            <Segment>Списков на сайте: {user.numberOfLists}</Segment>
            <Segment>Фильмов на сайте: {user.numberOfItems}</Segment>
          </>}
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
          {(asPath !== '/list' && name) && <Segment>
            <Button
            fluid
            onClick={this.handleClick}
            >
              Добавить список
            </Button>
          </Segment>}
        </Segment>
     );
   }
}

export default withRouter(ProfileSidebar);
