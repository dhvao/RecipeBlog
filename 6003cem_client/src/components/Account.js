// Import necessary modules and components from React and Ant Design
import React, { useEffect, useState, useContext } from 'react';
import { List, Card, Typography } from 'antd';
import UserContext from '../contexts/user';

// Destructure Title from Typography for easier use
const { Title } = Typography;

// Define the Account component
const Account = () => {
  // Access the user object from the UserContext
  const { user } = useContext(UserContext);

  // Define state variables for account data and loading status
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch account data when the component mounts or the user changes
  useEffect(() => {
    // Define an async function to fetch account data
    const fetchAccountData = async () => {
      try {
        // Log the user object for debugging
        console.log('User object:', user);

        // Extract username and password from the user object
        const username = user?.username;
        const password = user?.password;

        // Check if username or password is missing, if so, stop loading and return
        if (!username || !password) {
          console.error('Username or password is missing');
          setLoading(false);
          return;
        }

        // Log the username and password for debugging
        console.log('Username:', username);
        console.log('Password:', password);

        // Prepare headers for the fetch request with basic authentication
        const headers = {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          'Content-Type': 'application/json'
        };

        // Log the headers for debugging
        console.log('Headers:', headers);

        // Make a fetch request to the API to get account data
        const response = await fetch('https://genuineplato-investgenetic-3000.codio-box.uk/api/v1/users/account', {
          headers
        });

        // Check if the response is not ok, log the status, and throw an error
        if (!response.ok) {
          console.error('Response status:', response.status);
          throw new Error('Failed to fetch account data');
        }

        // Parse the response data as JSON
        const data = await response.json();

        // Set the account data in state
        setAccountData(data);
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching account data:', error);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    };

    // Call the fetchAccountData function
    fetchAccountData();
  }, [user]); // Only re-run the effect if the user changes

  // Render a loading indicator if the data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render a message if no account data is available
  if (!accountData) {
    return <div>No account data available</div>;
  }

  // Render the account information using Ant Design components
  return (
    <div>
      <Title level={2}>Account Information</Title>
      <Card title="User Details">
        <p><strong>Username:</strong> {accountData.user.username}</p>
        <p><strong>Email:</strong> {accountData.user.email}</p>
        <p><strong>First Name:</strong> {accountData.user.firstName || 'No data'}</p>
        <p><strong>Last Name:</strong> {accountData.user.lastName || 'No data'}</p>
        <p><strong>About:</strong> {accountData.user.about || 'No data'}</p>
      </Card>
      <Card title="Articles">
        {accountData.articles === 'No data' ? (
          <p>No articles</p>
        ) : (
          <List
            dataSource={accountData.articles}
            renderItem={item => <List.Item>{item.title}</List.Item>}
          />
        )}
      </Card>
      <Card title="Comments">
        {accountData.comments === 'No data' ? (
          <p>No comments</p>
        ) : (
          <List
            dataSource={accountData.comments}
            renderItem={item => <List.Item>{item.content}</List.Item>}
          />
        )}
      </Card>
      <Card title="Recipes">
        {accountData.recipes === 'No data' ? (
          <p>No recipes</p>
        ) : (
          <List
            dataSource={accountData.recipes}
            renderItem={item => <List.Item>{item.title}</List.Item>}
          />
        )}
      </Card>
    </div>
  );
};

// Export the Account component as the default export
export default Account;
