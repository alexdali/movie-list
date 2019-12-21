import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Divider, Header, Segment, Button, Icon, Accordion, Item, Dropdown, Input,
} from 'semantic-ui-react';
import { CURRENT_USER_QUERY } from './User';
import ListCreateForm from './ListCreateForm';
import ListsByUser from './ListsByUser';
import ErrorMessage from './ErrorMessage';
import LoadingBar from './LoadingBar';

const IndexDiv = styled.div`
  margin: 52px 0 0;
`;

let switchVal = false;
function searchShow() {
  switchVal = !switchVal;
  return switchVal;
}

// const wrapListCreateForm = () => (
//   <ListCreateForm id={data.me.id}/>
// );

// const panels = [
//   {
//     key: 'Add new rating',
//     title: 'Add new rating',
//     content: wrapListCreateForm,
//   },
// ];

const AddNewRating = () => (
  <Accordion defaultActiveIndex={0} panels={panels} />
);


const UserRatings = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingBar count={2}/>;
      if (error) return <ErrorMessage error={'Ошибка! Отсутствует соединение с базой данных'}/>;
      if ((typeof data === 'undefined') || (data.me === null)) return <LoadingBar count={2}/>;
      console.log(`UserRatings switchVal: ${switchVal}`);
      const panels = [
        {
          key: 'Add new rating',
          title: 'Add new rating',
          content: <ListCreateForm id={data.me.id}/>,
        },
      ];
      /* let searchShow = false; */
      return (
        <>
          <Header as='h1'>Личные рейтинги</Header>
          <Header as='h3'>Пользователь: {data.me.name}</Header>
          <Divider horizontal></Divider>

          <Segment raised>
          <Accordion defaultActiveIndex={10} panels={panels} />
              {/* <Button.Group basic fluid>
                <Button basic onClick={() => searchShow()}>
                  <Header as='h4' textAlign='center'>
                    <Icon size='mini' name='dropdown' />
                    <Header.Content>Add new rating</Header.Content>
                  </Header>
                </Button>
                {!!switchVal
                && <Button basic onClick={() => (!searchShow)}>
                  <Header as='h4' textAlign='center'>
                    <Icon name='close' />
                    <Header.Content>Close search</Header.Content>
                  </Header>
                </Button>
                }
              </Button.Group> */}
          {/* <Header as='h2'>Добавить новый список</Header> */}
          {switchVal && <ListCreateForm id={data.me.id}/>}
          </Segment>
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
