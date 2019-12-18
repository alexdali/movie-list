import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import { Menu, Label, Icon } from 'semantic-ui-react';
import withUserContext from '../lib/withUserContext';
import { CURRENT_USER_QUERY } from './User';
import SignOut from './SignOut';
import Login from './Login';
import ErrorMessage from './ErrorMessage';


const MenuDiv = styled.div`
  .ui.simple.dropdown .menu {
    opacity: 0;
  }
  .ui.simple.active.dropdown > .menu,
  .ui.simple.dropdown:hover > .menu {
    opacity: 1;
    top: 95% !important;
    margin-top: 0;
  }
  .ui.menu .ui.dropdown .menu > .selected.item:active {
    color: rgba(0, 0, 0, 0.95) !important;
  }
`;


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
      login: false,
    };
  }

  handleRes = (res) => {
    if (res) {
      this.setState({
        login: false,
      });
    }
  };

  closeLoginForm = () => {
    this.setState({
      login: false,
    });
  };

  handleItemClick = (e, data) => {
    const { name } = data;
    if (name === 'login') {
      this.setState({
        login: true,
      });
    }
    if (name === 'logout') {
      Router.push({
        pathname: '/',
      });
    }
  };


  render() {
    const { login } = this.state;
    const { user } = this.props;
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data, loading, error }) => {
          if (error) return (<ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>);
          if (typeof data === 'undefined') return null;
          return (
            <>
            <MenuDiv>
              <Menu secondary borderless floated="right">
                <Menu.Menu position="right" as="ul">
                  <Menu.Item
                    name="home"
                    as="li"
                    onClick={this.handleItemClick}
                  >
                    <div className="MenuItem">
                      <Link href="/">
                        <a>Home</a>
                      </Link>
                    </div>
                  </Menu.Item>

                  { loading
                    ? <i className="spinner icon"></i>
                    : <>
                  {data.me
                    && (
                      <>
                        <Menu.Item
                            name="myrating"
                            as="li"
                            onClick={this.handleItemClick}
                        >
                            <div className="MenuItem">
                              <Link href="/list">
                                <a>My rating</a>
                              </Link>
                            </div>
                        </Menu.Item>
                        <Menu.Item
                            name="account"
                            as="li"
                            onClick={this.handleItemClick}
                        >
                          <div className="MenuItem">
                            <Link href="/profile">
                              <a>
                              <Label>
                                <Icon name='user outline' />
                                {user ? user.name : ''}
                              </Label>
                              </a>
                            </Link>
                          </div>
                        </Menu.Item>
                        <Menu.Item
                            name="logout"
                            as="li"
                            onClick={this.handleItemClick}
                        >
                            <div className="MenuItem">
                              <Link href="#">
                                <a>
                                  <SignOut />
                                </a>
                              </Link>
                            </div>
                        </Menu.Item>
                      </>
                    )
                  }
                  {!data.me
                  && (
                    <Menu.Item
                      name="login"
                      as="li"
                      onClick={this.handleItemClick}
                    >
                      <div className="MenuItem">
                        <Link href="#">
                        <a>Войти</a>
                        </Link>
                      </div>
                    </Menu.Item>
                  )}
                    </>
                  }
                </Menu.Menu>
              </Menu>
            </MenuDiv>
            {login
            && <Login handleRes={this.handleRes} closeLoginForm={this.closeLoginForm}/>
            }
            </>
          );
        }}
      </Query>
    );
  }
}

export default withUserContext(NavBar);
