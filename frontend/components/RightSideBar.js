import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import withUserContext from '../lib/withUserContext';
import ProfileSidebar from './ProfileSidebar';

class RightSideBar extends Component {
  render() {
    const user = this.props.user ? this.props.user : {
      id: '',
      name: '',
      email: '',
    };
    return (
      <div>
        <Sticky enabled top={20}>
          <ProfileSidebar user={user} />
        </Sticky>
      </div>
    );
  }
}

export default withUserContext(RightSideBar);
