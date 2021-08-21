const { User } = require('../models/User')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent,args,context) => {
            if(context.user) {
                try { 
                    // find user though id
                    const user = await User.findOne({_id:context.user._id});
                    return user; 
                } catch (error) {
                    console.log('User not found', error);
                }
            } 
            // throw error if user is not logged in
            throw new AuthenticationError('You must log in')
        },
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            try { 
                //find user through email 
                const user = await User.findOne({email});
                if (!user) {
                    throw new AuthenticationError('No user found with this email adress');
                }
                //verify if user password is correct
                const correctPW = await user.isCorrectPassword(password);
                if(!correctPW){
                    throw new AuthenticationError('Incorrect Password, try again');
                }
                const token = signToken(user);
                return { token, user };
            } catch (error) {
                console.log('Error Loging in', error);
            }
        },
        //creates user from input values  
        addUser: async (parent, { username, email, password }) => {
            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user};
            } catch (error) {
                console.log('Error signing up', error);
            }
        },
        // save book to user 
        saveBook: async (parent, { bookToSave }, context) => {
            if (context.user) {
                try {
                const user = await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $addToSet: {savedBooks: bookToSave}},
                    { new: true, runValidators: true }
                ); 
                return user;
                } catch (error) {
                    console.log('Save book error', error);
                }
            }
            throw new AuthenticationError('Please log in');
        },
        // delete book from user 
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                try {
                    const user = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: {saveBooks: {bookId: bookId }}},
                        { new: true }
                    );
                    return user;
                } catch (error) {
                    console.log('Failed to remove book', error);
                }
            }
            // throw error if user is not logged in 
            throw new AuthenticationError('Please log in')
        },
    },
};

module.exports= resolvers;