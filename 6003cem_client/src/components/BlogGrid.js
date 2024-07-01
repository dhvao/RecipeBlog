// src/components/BlogGrid.js
import React, { Component } from 'react';
import PostCard from './PostCard';

class BlogGrid extends Component {
  state = { posts: [] };

  componentDidMount() {
    fetch('https://genuineplato-investgenetic-3000.codio-box.uk/articles')
      .then(response => response.json())
      .then(data => this.setState({ posts: data }))
      .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div>
        {this.state.posts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    );
  }
}

export default BlogGrid;
