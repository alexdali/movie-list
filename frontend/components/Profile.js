import React from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Icon, Card, Image,
} from 'semantic-ui-react';
import styled from 'styled-components';
import withUserContext from '../lib/withUserContext';
import DeleteBlock from './DeleteBlock';

const RowDiv = styled.div`
  div.field.title-view > textarea {
    width: 100%;
    max-height: 100%;
    font-size: 2.5em;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    resize: none;
  }
  .post-meta {
    display: flexbox;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1em 2em 0;
    border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  }
  .ui.form > div.field.post-content > textarea {
    font-size: 1.5em;
    border: none;
    max-height: 100%;
    resize: none;
  }
`;

const Profile = (props) => {
  // TO-DO propTypes
  const {
    id, name, email, numberOfItems, numberOfLists,
  } = props.user;
  return (
    <RowDiv>
      <Segment>
      <Card>
      <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
      <Card.Content>
        <Card.Header>Имя: {name}</Card.Header>
        <Card.Meta>
          <span className='date'>
          email: {email}</span>
        </Card.Meta>
        <Card.Description>
          I'm writer and musician, living in Nashville.
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <a>
            <Icon name='wordpress forms' />
            Списки: {numberOfLists}
        </a>
        </Card.Content>
        <Card.Content extra>
        <a>
          <Icon name='comment alternate outline' />
          Фильмы: {numberOfItems}
        </a>
      </Card.Content>
    </Card>
    </Segment>
      {id && <DeleteBlock { ...props} />}
    </RowDiv>
  );
};

export default withUserContext(Profile);
