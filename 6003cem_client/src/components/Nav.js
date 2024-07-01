import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/user';

const Nav = () => (
  <UserContext.Consumer>
    {({ user, logout }) => (
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/account">Account</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/post/new">New Post</Link></Menu.Item>
        <Menu.Item key="4"><Link to="/recipes">Recipes</Link></Menu.Item> 
        {!user.loggedIn && <Menu.Item key="5"><Link to="/register">Register</Link></Menu.Item>}
        {!user.loggedIn && <Menu.Item key="6"><Link to="/login">Login</Link></Menu.Item>}
        {user.loggedIn && <Menu.Item key="7" onClick={logout}><Link to="/">Logout</Link></Menu.Item>}
      </Menu>
    )}
  </UserContext.Consumer>
);

export default Nav;
