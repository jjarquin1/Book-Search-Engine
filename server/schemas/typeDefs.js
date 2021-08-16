const { gql } = require('apollo-server-express')


// defining object types
const typeDefs = gql`
type Query {
    me: User
}

type Mutation {
    login(email: String!, password:String!): Auth
    addUser(usernme: String!, email:String!, password: String!): Auth
    saveBook(bookToSave: BookInput): User
}

type User{
    _id: ID
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

type Auth {
    token: ID!
    user:User
}

input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}`;

module.exports = typeDefs;