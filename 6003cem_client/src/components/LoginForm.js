import React from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import UserContext from '../contexts/user';

// Layout settings for the form items
const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

// Validation rules
const passwordRules = [{ required: true, message: 'Please input your password!' }];
const usernameRules = [{ required: true, message: 'Please input your username!', whitespace: true }];

class LoginForm extends React.Component {
  static contextType = UserContext;  // Access UserContext

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { username, password } = values;
    console.log(`Logging in user: ${username}`);

    axios.post('https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/users/login', { username, password })
      .then(response => {
        console.log('Response status:', response.status);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then(user => {
        console.log('Logged in successfully');
        console.log(user);
        // Include username and password in user context
        this.context.login({ ...user, username, password });
      })
      .catch(error => {
        console.log('Login failed');
        console.error(error);
      });
  }

  render() {
    return (
      <Form {...formItemLayout} name="login" onFinish={this.handleSubmit} scrollToFirstError>
        <Form.Item name="username" label="Username" rules={usernameRules}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
