// src/components/RecipesList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, List, Typography, Divider } from 'antd';
import CommentForm from './CommentForm';
import DeleteCommentButton from './DeleteCommentButton';
import UserContext from '../contexts/user';

const { Title, Paragraph } = Typography;

const RecipesList = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/recipes');
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const fetchComments = async (recipeID) => {
    try {
      const response = await axios.get(
        `https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/comments?recipeID=${recipeID}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`,
          },
        }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [recipeID]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching comments for recipe ${recipeID}:`, error);
    }
  };

  const handleCommentSubmit = (recipeID) => {
    fetchComments(recipeID);
  };

  const handleCommentDelete = (recipeID) => {
    fetchComments(recipeID);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={recipes}
      renderItem={item => (
        <List.Item>
          <Card
            title={item.title}
            cover={<img alt="recipe" src={item.imageURL} />}
          >
            <Title level={4}>{item.summary}</Title>
            <Paragraph>{item.instructions}</Paragraph>
            <Title level={5}>Ingredients:</Title>
            <List
              dataSource={item.ingredients}
              renderItem={ingredient => (
                <List.Item>{ingredient.name}: {ingredient.amount}</List.Item>
              )}
            />
            <Divider />
            <Title level={5}>Comments:</Title>
            <List
              dataSource={comments[item.recipe_id] || []}
              renderItem={comment => (
                <List.Item>
                  {comment.allText}
                  <DeleteCommentButton commentID={comment.id} onCommentDelete={() => handleCommentDelete(item.recipe_id)} />
                </List.Item>
              )}
            />
            <CommentForm recipeID={item.recipe_id} onCommentSubmit={() => handleCommentSubmit(item.recipe_id)} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default RecipesList;
