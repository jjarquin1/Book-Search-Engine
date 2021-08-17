import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login ($email: STRING!, $passowrd: String!) {
    login(email:$email, passowrd:$password){
        token
        user {
            _id
            username
            email
        }
    }
}`;

export const ADD_USER =gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email:$email, passoword: $password){
        token
        user {
            _id
            username
            email
        }
    }
}`;

export const SAVE_BOOK = gql`
mutation saveBook($bookToSave: BookInput) {
    saveBook(bookToSave: $bookToSave) {
        _id
        username
        bookCount
        savedBooks{
            bookId
            authors
            description
            title
            image
            link
        }
    }
}`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId:ID!){
    removeBook(bookId: $bookId){
        _id
        username
        bookCount
        savedBooks{
            bookId
            authors
            description
            title
            image
            link
        }
    }
}`