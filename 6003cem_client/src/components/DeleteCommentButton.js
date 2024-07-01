// src/components/DeleteCommentButton.js
import React, { useContext } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import UserContext from '../contexts/user';

const DeleteCommentButton = ({ commentID, onCommentDelete }) => {
  const { user } = useContext(UserContext);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/comments/${commentID}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Comment deleted successfully!');
        onCommentDelete(); // Refresh the comments list
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      message.error('Error deleting comment: ' + error.message);
    }
  };

  return (
    <Button type="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCommentButton;
