import React, { createContext, useState, useEffect } from 'react';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.log('Error checking auth state:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (username, password) => {
        try {
            const user = await signIn({ username, password });
            console.log('Sign in successful:', user);
            setUser(user);
            setError(null);
            return user;
        } catch (error) {
            console.error('Error signing in:', error);
            setError(error.message);
            throw error;
        }
    };

    const handleSignUp = async (username, password, attributes) => {
        try {
            const { user } = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email: attributes.email,
                        given_name: attributes.given_name,
                        family_name: attributes.family_name
                    }
                }
            });
            setError(null);
            return user;
        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message);
            throw error;
        }
    };

    const handleConfirmSignUp = async (username, code) => {
        try {
            await confirmSignUp({ username, confirmationCode: code });
            setError(null);
        } catch (error) {
            console.error('Error confirming sign up:', error);
            setError(error.message);
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Error signing out:', error);
            setError(error.message);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        signOut: handleSignOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 