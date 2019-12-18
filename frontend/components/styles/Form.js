import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid white;
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.green};
    }
  }
  button,
  input[type='submit'] {
    width: auto;
    background: #1ab394;
    color: white;
    border: 0;
    /* font-size: 2rem; */
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  fieldset {
    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: '';
      display: block;
      background-image: linear-gradient(
        to right,
        #19a488 11%,
        #1aa8b3 41%,
        #1ab3a2 100%
      );
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;

const FormDiv = styled.div`
  /* max-width: 300px; */
  box-sizing: border-box;
  margin: 50px 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  form {
    max-height: 350px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
    background: rgba(0, 0, 0, 0.02);
    border: 5px solid white;
    /* padding: 5px; */
    font-size: 1.5rem;
    line-height: 1.5;
    font-weight: 600;
    .close-icon {
      display: block;
      margin-left: auto;
      cursor: pointer;
    }
    fieldset::before {
      height: 1px;
      margin-bottom: 25px;
      margin-top: 10px;
    }
  }
  .formItem {
    position: relative;
    height: auto;
    display: block;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    margin-bottom: 24px;
    .formItem-control {
      position: relative;
      line-height: 40px;
      .input-wrapper {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        font-feature-settings: 'tnum';
        position: relative;
        display: inline-block;
        width: 100%;
        text-align: start;
        input:not(:first-child) {
          padding-left: 30px;
        }
        input {
          position: relative;
          min-height: 100%;
        }
        .input-prefix {
          position: absolute;
          margin-left: 10px;
          top: 50%;
          z-index: 2;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          color: rgba(0, 0, 0, 0.65);
          line-height: normal;
          transform: translateY(-50%);
        }
      }
      input {
        box-sizing: border-box;
        margin: 0;
        font-variant: tabular-nums;
        list-style: none;
        font-feature-settings: 'tnum';
        display: inline-block;
        width: 100%;
        height: 32px;
        padding: 4px 11px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 1.5;
        background-color: #fff;
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        transition: all 0.3s;
      }
    }
  }
  .form-item-children {
    position: relative;
  }
  label {
    font-size: 14px;
  }
  .checkbox-wrapper {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    display: inline-block;
    line-height: unset;
    cursor: pointer;
  }
  span.checkbox {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    top: -0.09em;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
    outline: none;
    cursor: pointer;
    + span {
      padding-right: 8px;
      padding-left: 8px;
    }
  }
  input[type='checkbox'] {
    line-height: normal;
    width: 14px;
    height: 14px;
    box-sizing: border-box;
    padding: 0;
  }
  .checkbox-inner {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    width: 16px;
    height: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-collapse: separate;
    transition: all 0.3s;
  }
  .login-form-forgot {
    float: right;
    font-size: 13px;
  }
  a {
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
    font-style: normal;
    font-weight: 400;
    &:hover {
      color: #1ab394;
      font-weight: 600;
    }
  }
  .login-form-button {
    width: 100%;
  }
`;

export  {Form, FormDiv};
