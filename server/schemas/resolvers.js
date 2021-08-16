const { User } = require('../models/User')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent,args,context) => {
            if(context.user) {
                try {
                    const user = await User.findOne({_id:context.user._id});
                    return user; 
                } catch (error) {
                    console.log('User not found', error);
                }
            }
            throw new AuthenticationError('You must log in')
        },
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            try {
                const user = await User.findOne({email});
                if (!user) {
                    throw new AuthenticationError('No user found with this email adress');
                }
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

        addUser: async (parent, { usernam, email, password }) => {
            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user};
            } catch (error) {
                console.log('Error signing up', error);
            }
        },

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
            throw new AuthenticationError('Please log in')
        },
    },
};