import React, { useState, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import UserContext from '../contexts/user';

const { TextArea } = Input;

const CommentForm = ({ recipeID, onCommentSubmit }) => {
  const [form] = Form.useForm();  // Initialize Ant Design form
  const { user } = useContext(UserContext);  // Access user context

  // Handle form submission
  const onFinish = async (values) => {
    const comment = {
      ...values,
      recipeID: recipeID,
      authorID: user.ID,
    };

    try {
      const response = await axios.post(
        'https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/comments',
        comment,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error('Network response was not ok.');
      }

      message.success('Comment posted successfully!');
      form.resetFields();  // Reset form fields after successful submission
      onCommentSubmit();  // Call parent component's callback
    } catch (error) {
      message.error('Error posting comment: ' + error.message);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="allText" label="Comment" rules={[{ required: true, message: 'Please input your comment!' }]}>
        <TextArea rows={2} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
