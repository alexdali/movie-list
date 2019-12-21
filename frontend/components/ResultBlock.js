import React, { Component } from 'react';
// import withApollo from 'next-with-apollo';
import { ApolloConsumer } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Accordion, Item, Dropdown, Input,
} from 'semantic-ui-react';
// import TextareaAutosize from 'react-textarea-autosize';
// import Router from 'next/router';
import styled from 'styled-components';
// import moment from 'moment';
import withUserContext from '../lib/withUserContext';
// import { ALL_LISTS_QUERY } from './RatingList';
// import { CURRENT_USER_QUERY } from './User';
import AddToListBlock from './AddToListBlock';

const RowDiv = styled.div`
`;


class ResultBlock extends Component {
  // static propTypes = {
  //   searchblock: PropTypes.shape({
  //     id: PropTypes.string,
  //     userId: PropTypes.string,
  //     title: PropTypes.string,
  //     description: PropTypes.string,
  //     items: PropTypes.array,
  //     numberOfItems: PropTypes.number,
  //     userAverageRating: PropTypes.number,
  //     createdDate: PropTypes.string,
  //   }).isRequired,
  // };

  state = {
    // searchblock: this.props.searchblock,
    addToListShow: false,
    // readOnly: false,
    // firstParamText: 'by Title',
    // firstParamName: 'title',
    // searchByID: false,
    // firstParamVal: '',
    // searchblock: {
    //   title: '',
    //   imdbID: '',
    //   year: '',
    //   genre: '',
    // },
    // showEdit: '',
    resultSearch: [],
  };

  handleChange = (e, {
    value, name, type, id,
  }) => {
    // console.log(`handleChange data: ${JSON.stringify(data)}`);
    // console.log(`handleChange value: ${value}, name: ${name}`);
    // console.log(`handleChange id: ${id}, type: ${type}`);
    // const { name, type, value } = e.target;

    const val = value;
    const nam = name;
    if (id === 'firstParam') {
      this.setState({
        firstParamVal: val,
      });
    }

    const { searchblock } = this.state;
    searchblock[nam] = val;
    this.setState({ searchblock });
  };

  addToListShow = () => {
    const { addToListShow } = this.state;
    this.setState({ addToListShow: !addToListShow });
  };


  render() {
    const { item } = this.props;
    if (!item) return null;
    const {
      // searchblock: {
      //   title, itemId, year, genre,
      // },
      addToListShow,
      // firstParamName,
      // firstParamVal,
      // // readOnly,
      // // showEdit,
      // resultSearch,
    } = this.state;

    return (
      <ApolloConsumer>
        {(client) => (
          <Item.Group divided>
            <Segment>
              <Item>
                {/* <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' /> */}
                <Item.Content>
                  <Item.Header as='h3'>{item.title}</Item.Header>
                  <Item.Meta>
                    <span className='cinema'>{item.year || ''}</span>
                    <span className='cinema'>{item.released || ''}</span>
                    <span className='cinema'>{item.genre || ''}</span>
                    <span className='cinema'>{item.imdbRating || ''}</span>
                    <span className='cinema'>{item.imdbVotes || ''}</span>
                    <span className='cinema'>{item.type || ''}</span>
                    <span className='cinema'>{item.country || ''}</span>
                    <span className='cinema'>{item.language || ''}</span>
                    <span className='cinema'>{item.rated || ''}</span>
                  </Item.Meta>
                  <Item.Description>Plot: {item.plot || ''}</Item.Description>
                  <Item.Description>Director: {item.director || ''}</Item.Description>
                  <Item.Description>Actors: {item.actors || ''}</Item.Description>
                  <Item.Extra>
                    <Segment basic>
                      <Accordion styled>
                        <Accordion.Title
                          active={addToListShow}
                          onClick={this.addToListShow}
                        >
                          <Icon name='dropdown' />
                            Rate the film and Add to list
                        </Accordion.Title>
                        <Accordion.Content active={addToListShow}>
                          <AddToListBlock addToListShow={this.addToListShow} item={item}/>
                        </Accordion.Content>
                      </Accordion>
                    </Segment>
                  </Item.Extra>
                </Item.Content>

              </Item>
            </Segment>

            {/* <Segment attached='bottom'>
              <Button
              onClick={(e) => this.searchRequest(e, client)}
              >
                  Search
              </Button>
              <Button onClick={() => this.resetInput()}>Reset</Button>
            </Segment> */}
            {/* </Form> */}
          </Item.Group>
        )}
      </ApolloConsumer>
    );
  }
}

export default ResultBlock;
