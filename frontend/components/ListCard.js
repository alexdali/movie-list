import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment';
import {
  Icon, Item, Divider, Label,
} from 'semantic-ui-react';

const ItemContent = styled.p`
    max-height: 80px;
    overflow: hidden;
`;
const ItemBlock = styled.div`
  div.item > div.content > .list-meta {
      display: flexbox;
      justify-content: space-between;
   }
   .extra {
      margin-top: 10px;
    }
`;

class ListCard extends Component {
  static propTypes = {
    listcard: PropTypes.shape({
      id: PropTypes.string,
      userId: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      numberOfItems: PropTypes.number,
      userAverageRating: PropTypes.number,
      createdDate: PropTypes.string,
    }).isRequired,
  };

  render() {
    const {
      id, userId, title, description, createdDate, numberOfItems, userAverageRating, author,
    } = this.props.listcard;
    return (
      <Link
        href={{
          pathname: './list',
          query: { id },
        }}
      >
        <a>
          <ItemBlock>
          <Item>
            <Item.Content>
              <Item.Header as='h3'>{title}</Item.Header>
              <Divider clearing />

              <div className="list-meta">
                <p><Label as='span' color='orange'>{author.name}</Label></p>
                <p><Label as='span' color='orange' ribbon='right'>
                  {moment(createdDate).format('DD MMMM YYYY')}
                </Label></p>
              </div>

              <Item.Description>
                <ItemContent clasName='item-content'>{description}</ItemContent>
              </Item.Description>

              <Item.Extra>
                <Label size="medium" >
                  <Icon name='film'/> {numberOfItems}
                </Label>
                <Label size="medium" >
                  <Icon name='star outline'/> {userAverageRating}
                </Label>
              </Item.Extra>
            </Item.Content>
          </Item>
          </ItemBlock>
        </a>
      </Link>
    );
  }
}
export default ListCard;
