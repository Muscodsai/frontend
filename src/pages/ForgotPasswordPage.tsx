import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import AuthLayout from '../components/auth/AuthLayout';
import {useForgotPassword} from '../hooks/useForgotPassword';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
    const {sendResetLink, isLoading, isSuccess} = useForgotPassword();
    const {register, handleSubmit, formState: {errors}} = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        await sendResetLink(data.email);
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent you instructions to reset your password."
            >
                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        Didn't receive the email?{' '}
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="font-medium text-gray-900 hover:text-gray-800"
                        >
                            Click to resend
                        </button>
                    </p>
                    <Link
                        to="/login"
                        className="mt-4 inline-block font-medium text-gray-900 hover:text-gray-800"
                    >
                        Return to login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </button>
                </div>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="font-medium text-gray-900 hover:text-gray-800"
                    >
                        Back to login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;