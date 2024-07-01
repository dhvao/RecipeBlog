import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import UserContext from './contexts/user';
import Nav from './components/Nav';
import Home from './components/Home';
import Account from './components/Account';
import Post from './components/Post';
import Register from './components/Register';
import Login from './components/LoginForm';
import NewRecipe from './components/NewRecipe';
import RecipesList from './components/RecipesList';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { loggedIn: false }
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user) {
    console.log("User is now being set on the context");
    user.loggedIn = true;
    this.setState({ user: user });
  }

  logout() {
    console.log("Removing user from the app context");
    this.setState({ user: { loggedIn: false } });
  }

  render() {
    const context = {
      user: this.state.user,
      login: this.login,
      logout: this.logout
    };

    return (
      <UserContext.Provider value={context}>
        <Router>
          <Layout className="layout">
            <Header>
              <Nav />
            </Header>
            <Content style={{ padding: '0 50px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/post/new" element={<NewRecipe />} />
                <Route path="/recipes" element={<RecipesList />} />
              </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Created for Web API Development
            </Footer>
          </Layout>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
