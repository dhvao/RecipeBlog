import React, { useState, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import UserContext from '../contexts/user';
import axios from 'axios';

const { TextArea } = Input;

const NewRecipe = () => {
  const { user } = useContext(UserContext);  // Access user context
  const [form] = Form.useForm();  // Initialize Ant Design form
  const [error, setError] = useState(null);  // State for error handling

  // Handle form submission
  const onFinish = async (values) => {
    const recipe = {
      ...values,
      authorID: user.ID,
      published: true,
      ingredients: [
        { name: values.ingredient1, amount: values.amount1 },
        { name: values.ingredient2, amount: values.amount2 },
        { name: values.ingredient3, amount: values.amount3 },
      ].filter(ingredient => ingredient.name && ingredient.amount),
    };

    try {
      const response = await axios.post(
        'https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/recipes',
        recipe,
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

      message.success('Recipe created successfully!');
      form.resetFields();  // Reset form fields after successful submission
    } catch (error) {
      setError('There was a problem with the fetch operation: ' + error.message);
      message.error('Error creating recipe: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Create New Recipe</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="title" label="Recipe Title" rules={[{ required: true, message: 'Please input the title of the recipe!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="instructions" label="Instructions" rules={[{ required: true, message: 'Please input the instructions!' }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="allText" label="Full Recipe Text" rules={[{ required: true, message: 'Please input the full recipe text!' }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="summary" label="Summary" rules={[{ required: true, message: 'Please input the summary!' }]}>
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item name="ingredient1" label="Ingredient 1 Name">
          <Input />
        </Form.Item>

        <Form.Item name="amount1" label="Ingredient 1 Amount">
          <Input />
        </Form.Item>

        <Form.Item name="ingredient2" label="Ingredient 2 Name">
          <Input />
        </Form.Item>

        <Form.Item name="amount2" label="Ingredient 2 Amount">
          <Input />
        </Form.Item>

        <Form.Item name="ingredient3" label="Ingredient 3 Name">
          <Input />
        </Form.Item>

        <Form.Item name="amount3" label="Ingredient 3 Amount">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Create Recipe</Button>
        </Form.Item>
      </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NewRecipe;
