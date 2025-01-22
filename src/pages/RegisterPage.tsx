import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import AuthLayout from '../components/auth/AuthLayout';
import {server} from "../utils/address";
import {SHA256} from "crypto-js"
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";
import {clearCookies} from "../utils/cookies.ts";
import {useState} from "react";
import {HidePassword, ShowPassword} from "../asserts/icons.tsx";

const registerSchema = z.object({
    name: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    document.title = 'Register';
    clearCookies();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // const response = await fetch(`${server}/v1/signup`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: data.email,
            //         username: data.name,
            //         password: SHA256(data.password).toString(),
            //     })
            // });
            const response = await fetch(`${server}/v2/auth/register/-1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        email: data.email,
                        username: data.name,
                        password: SHA256(data.password).toString(),
                    },
                    responseFields: [],
                })
            });

            const result = await response.json();

            if (response.ok) {
                popup("Registration successful!");
                navigate('/login');
            } else {
                popup("Registration failed.\n" + result.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
            popup("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-gray-900 hover:text-gray-800">
                        Sign in
                    </Link>
                </>
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('name')}
                            id="name"
                            type="text"
                            autoComplete="name"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                </div>

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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            {...register('password')}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-12"
                        />
                        <button
                            type="button"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseLeave={() => setShowPassword(false)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        >
                            { showPassword?
                                <HidePassword className="w-5 h-5"/> :
                                <ShowPassword className="w-5 h-5"/>
                            }
                        </button>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            {...register('confirmPassword')}
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-12"
                        />
                        <button
                            type="button"
                            onMouseDown={() => setShowConfirmPassword(true)}
                            onMouseUp={() => setShowConfirmPassword(false)}
                            onMouseLeave={() => setShowConfirmPassword(false)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        >
                            { showConfirmPassword?
                                <HidePassword className="w-5 h-5"/> :
                                <ShowPassword className="w-5 h-5"/>
                            }
                        </button>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        {...register('acceptTerms')}
                        id="accept-terms"
                        type="checkbox"
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <a href="#" className="font-medium text-gray-900 hover:text-gray-800">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-gray-900 hover:text-gray-800">
                            Privacy Policy
                        </a>
                    </label>
                </div>
                {errors.acceptTerms && (
                    <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {
                            isSubmitting ?
                                <div className="flex flex-row items-center space-x-2">
                                    <Loading message="" scale={0.2} color="#fff"/>
                                    <p className="text-nowrap">Creating account...</p>
                                </div>
                                :
                                <div>
                                    <p className="text-nowrap">Create account</p>
                                </div>
                        }
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;