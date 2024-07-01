### README.md

# Recipe Blog API and Client

## Overview
This project is a recipe blog that includes a RESTful API and a ReactJS single-page application (SPA). The API provides functionality to manage recipes, ingredients, and comments. The client allows users to interact with the API through a user-friendly interface.

## Getting Started

### Prerequisites
- Node.js
- MySQL
- Git

### Installation

1. **Clone the repository**
   git clone https://github.coventry.ac.uk/kuzmict/6003CEM_Recipe_Blog_Resit.git
   cd 6003CEM_Recipe_Blog_Resit

2. **Setup the database**
   - Create a MySQL database named `recipe_blog`.
   - Import the schema and data:
     mysql -u root -p recipe_blog < db/schema.sql
     mysql -u root -p recipe_blog < db/data.sql

3. **Setup the API**
   cd 6003CEM_webapi
   cp config.js.template config.js
   # Edit config.js with your MySQL database credentials
   npm install
   npm start

4. **Setup the Client**
   cd ../6003cem_client
   npm install
   npm start

## API Documentation
The API documentation is available at `https://genuineplato-investgenetic-3001.codio-box.uk/`.

## Testing with Postman

### Endpoints

#### Recipes
- **GET** `/api/v1/recipes` - Get all recipes
- **GET** `/api/v1/recipes/:id` - Get a single recipe by ID
- **POST** `/api/v1/recipes` - Create a new recipe
- **PUT** `/api/v1/recipes/:id` - Update a recipe by ID
- **DELETE** `/api/v1/recipes/:id` - Delete a recipe by ID

#### Ingredients
- **GET** `/api/v1/ingredients?recipe_id=:recipe_id` - Get ingredients for a recipe

#### Comments
- **GET** `/api/v1/comments/:id` - Get a comment by ID
- **POST** `/api/v1/comments` - Create a new comment
- **DELETE** `/api/v1/comments/:id` - Delete a comment by ID

### Postman Collection
1. Open Postman.
2. Create a new collection and add the above endpoints.
3. Some examples:

#### Create Recipe
```json
{
  "title": "New Recipe",
  "instructions": "These are the instructions.",
  "allText": "This is the full recipe text.",
  "summary": "This is a summary.",
  "published": true,
  "authorID": 1,
  "ingredients": [
    { "name": "Ingredient 1", "amount": "2 cups" },
    { "name": "Ingredient 2", "amount": "1 tsp" }
  ]
}
```

#### Create Comment
```json
{
  "allText": "This is a test comment.",
  "recipeID": 1,
  "authorID": 1
}
```

## Demonstration Video
A demonstration video showcasing the API and client can be found .

## Contributors
- Toma Kuzmic 10210411
