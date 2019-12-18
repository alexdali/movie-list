import { Message } from 'semantic-ui-react';

const ErrorMessage = (props) => {
  console.log('ErrorMessage props: ', props);
  const errMess = props.error.message ? props.error.message.replace('GraphQL error: ', '') : props.error;
  return (
  <Message negative>
    <p>{errMess}</p>
</Message>);
};

export default ErrorMessage;
