// server.js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

// Schemat i resolver
const typeDefs = `#graphql
  type Quiz {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    quizzes: [Quiz!]!
  }
`;

const resolvers = {
    Query: {
        quizzes: () => [
            { id: '1', title: 'React Basics', description: 'Intro to React' },
            { id: '2', title: 'GraphQL 101', description: 'Learn GraphQL basics' }
        ],
    },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(cors({ origin: 'http://localhost:5176' }));
app.use('/graphql', bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
    console.log('🚀 GraphQL server ready at http://localhost:4000/graphql');
});