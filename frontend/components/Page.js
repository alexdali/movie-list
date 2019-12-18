import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme, GlobalStyle } from './styles/GlobalStyle';
import Header from './Header';
import Meta from './Meta';
import RightSideBar from './RightSideBar';

const StyledPage = styled.div`
  background: white;
  color: ${(props) => props.theme.black};
`;

const Inner = styled.div`
  {/*max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;*/}
`;

const IndexDiv = styled.div`
  margin: 52px 0 0;
  max-width: ${(props) => props.theme.maxWidth};
  padding: 2rem;
  .ui.celled.grid>.row>.column {
    padding: 0 1rem;
}
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <IndexDiv>
            <Grid celled='internally'>
              <Grid.Row>
                <Grid.Column width={13}>
                  <Inner>{this.props.children}</Inner>
                </Grid.Column>
                <Grid.Column width={3}>
                  <RightSideBar/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </IndexDiv>
          <GlobalStyle />
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
