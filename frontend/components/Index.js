import React from 'react';
import { Grid } from 'semantic-ui-react';
import Sticky from 'react-stickynode';
import Main from './Main';
import LeftSideBar from './LeftSideBar';

const Index = () => (
      <Grid celled='internally'>
        <Grid.Row>
          <Grid.Column width={3}>
            <Sticky enabled top={20}>
              <LeftSideBar />
            </Sticky>
          </Grid.Column>
          <Grid.Column width={13}>
            <Main />
          </Grid.Column>
        </Grid.Row>
      </Grid>
);

export default Index;
