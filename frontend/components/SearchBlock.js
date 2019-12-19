import React, { Component } from 'react';
// import withApollo from 'next-with-apollo';
import { ApolloConsumer } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {
  Message, Segment, Button, Icon, Form, Divider, Item, Dropdown, Input, Header,
} from 'semantic-ui-react';
// import TextareaAutosize from 'react-textarea-autosize';
// import Router from 'next/router';
import styled from 'styled-components';
// import moment from 'moment';
import withUserContext from '../lib/withUserContext';
// import { ALL_LISTS_QUERY } from './RatingList';
// import { CURRENT_USER_QUERY } from './User';
import ResultBlock from './ResultBlock';


const RowDiv = styled.div`
  /* div.field.title-view > textarea {
    width: 100%;
    max-height: 100%;
    font-size: 2.5em;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    resize: none;
  }
  .list-meta {
    display: flexbox;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1em 2em 0;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  }
  div.field.description-view > textarea {
    width: 100%;
    max-height: 100%;
    font-size: 1.5em;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    resize: none;
  }
  .ui.form > div.field.list-content > textarea {
    font-size: 1.5em;
    border: none;
    max-height: 100%;
    resize: none;
  } */
`;


const SEARCH_ITEM_QUERY = gql`
  query SEARCH_ITEM_QUERY(
    $title: String
    $imdbID: String
    $year: String
    $genre: String
  ) {
    searchItem(
      title: $title
      imdbID: $imdbID
      year: $year
      genre: $genre
      ) {
        imdbID
        title
        year
        rated
        released
        genre
        director
        actors
        language
        plot
        country
        imdbRating
        imdbVotes
        type
    }
  }
`;

class SearchBlock extends Component {
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
    firstParamText: 'by Title',
    firstParamName: 'title',
    firstParamPlaceholder: 'Title of film',
    searchByID: false,
    firstParamVal: '',
    searchShow: false,
    searchblock: {
      title: '',
      imdbID: '',
      year: '',
      genre: '',
    },
    resultSearch: [],
  };

  searchShow = () => {
    const { searchShow } = this.state;
    this.setState({
      searchShow: !searchShow,
    });
  }

  resetInput = () => {
    this.setState({
      firstParamText: 'by Title',
      firstParamName: 'title',
      firstParamPlaceholder: 'Title of film',
      searchByID: false,
      firstParamVal: '',
      searchblock: {
        title: '',
        imdbID: '',
        year: '',
        genre: '',
      },
      resultSearch: [],
    });
  }

  handleChange = (e, {
    value, name, type, id,
  }) => {
    // console.log(`handleChange data: ${JSON.stringify(data)}`);
    // console.log(`handleChange value: ${value}, name: ${name}`);
    // console.log(`handleChange id: ${id}, type: ${type}`);
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

  handleItemClick = (e, data) => {
    // console.log('NavBar handleItemClick: e', e);
    // console.log('handleItemClick data: ', data);
    const {
      name, value, text, placeholder,
    } = data;
    // console.log('handleItemClick: value: ', value);
    this.setState({
      firstParamText: text,
      firstParamName: value,
      firstParamPlaceholder: placeholder,
    });
    if (value === 'imdbID') {
      this.setState({
        searchByID: true,
      });
    }
  };

  searchRequest = async (e, client) => {
    e.preventDefault();
    const {
      title, imdbID, year, genre,
    } = this.state.searchblock;

    const res = await client.query({
      query: SEARCH_ITEM_QUERY,
      variables: {
        title, imdbID, year, genre,
      },
    });
    console.log(`q searchItem res.data.searchItem: ${JSON.stringify(res.data.searchItem)}`);
    // TO-DO handle key press: Enter
    this.setState({
      firstParamText: 'by Title',
      firstParamName: 'title',
      firstParamPlaceholder: 'Title of film',
      searchByID: false,
      firstParamVal: '',
      searchblock: {
        title: '',
        imdbID: '',
        year: '',
        genre: '',
      },
      // showEdit: '',
      resultSearch: res.data.searchItem,
    });
  };


  render() {
    // const { client } = this.props;
    const options = [
      {
        key: 'title', text: 'by Title', name: 'title', value: 'title', placeholder: 'Title of film', onClick: this.handleItemClick,
      },
      {
        key: 'ID', text: 'by ID', name: 'imdbID', value: 'imdbID', placeholder: 'ID of film', onClick: this.handleItemClick,
      },
    ];
    const {
      searchblock: {
        title, itemId, year, genre,
      },
      firstParamText,
      firstParamName,
      firstParamVal,
      firstParamPlaceholder,
      searchShow,
      resultSearch,
    } = this.state;

    return (
      <>
          {/* <Segment placeholder> */}
            <Header>
              {/* <Icon name='search' /> */}
              Create movie ratings, share and comment
            </Header>
            <Divider hidden />
            <Segment raised>
              <Button.Group basic fluid>
                <Button basic onClick={() => this.searchShow()}>
                  <Header as='h4' textAlign='center'>
                    <Icon name='search' />
                    <Header.Content>Find and add movies</Header.Content>
                  </Header>
                </Button>
                {!!searchShow
                && <Button basic onClick={() => this.searchShow()}>
                  <Header as='h4' textAlign='center'>
                    <Icon name='close' />
                    <Header.Content>Close search</Header.Content>
                  </Header>
                </Button>
                }
              </Button.Group>

            {searchShow
              && <Segment basic>
                <Form>
                {/* <Form.Group widths='equal'> */}
                  <Input
                    label={<Dropdown text={firstParamText} options={options} />}
                    id='firstParam'
                    name={firstParamName}
                    value={firstParamVal}
                    labelPosition='right'
                    placeholder={firstParamPlaceholder}
                    onChange={this.handleChange}
                    // fluid
                    // width={6}
                  />

                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label="Year of release"
                      id="year"
                      name="year"
                      // disabled={loading}
                      width={6}
                      // required
                      value={year}
                      onChange={this.handleChange}
                    />
                    <Form.Input
                      fluid
                      label="Genre"
                      name="genre"
                      value={genre}
                      width={6}
                      // required
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  {/* </Form.Group> */}
                  {/* <Divider hidden /> */}

                  {/* <Segment attached='bottom'> */}
                  <ApolloConsumer>
                    {(client) => (
                      <Button.Group basic fluid>
                        <Button
                          compact
                          toggle
                          floated='right'
                          onClick={(e) => this.searchRequest(e, client)}
                        >
                            Search
                        </Button>
                        <Button
                          onClick={() => this.resetInput()}
                          floated='right'
                        >
                          Reset
                        </Button>
                      </Button.Group>
                    )}
                  </ApolloConsumer>
                  {/* </Segment> */}
                </Form>
             </Segment>
            }
          </Segment>
          <Item.Group divided>
            {
              resultSearch.map((item) => (<ResultBlock key={item.imdbID} item={item} />))
            }
          </Item.Group>
      </>
    );
  }
}

export default SearchBlock;
