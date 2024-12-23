import { useState } from 'react';

export const useForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const sendResetLink = async (email: string) => {
        setIsLoading(true);
        try {
            // Here you would typically make an API call to send the reset link
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setIsSuccess(true);
        } catch (error) {
            console.error('Failed to send reset link:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendResetLink,
        isLoading,
        isSuccess,
    };
};