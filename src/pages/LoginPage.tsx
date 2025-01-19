import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import AuthLayout from '../components/auth/AuthLayout';
import {server} from "../utils/address.ts";
import {SHA256} from "crypto-js";
import {clearCookies, readCookies, setCookies} from "../utils/cookies.ts";
import {useEffect} from "react";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {

    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        const cookies = readCookies();
        if (!cookies) {
            clearCookies();
            return;
        }
        if (cookies.expires < Date.now()) {
            clearCookies();
            return;
        }
        if (cookies.remember) {
            navigate("/");
            return;
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await fetch(`${server}/v2/auth/login/-1`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        email: data.email,
                        password: SHA256(data.password).toString(),
                    },
                    responseFields: [],
                })
            });
            // const response = await fetch(`${server}/v1/signin`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: data.email,
            //         password: SHA256(data.password).toString(),
            //     })
            // });

            const result = await response.json();

            if (response.ok) {
                console.log("Session Info: \n" + result);
                const cookies = {
                    id: result.id,
                    remember: data.rememberMe,
                    expires: Date.now() + 6e8
                };
                setCookies(cookies);
                navigate('/');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            popup("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle={
                <>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-gray-900 hover:text-gray-800">
                        Sign up
                    </Link>
                </>
            }
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            {...register('rememberMe')}
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-gray-900 hover:text-gray-800">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

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
                                <p className="text-nowrap">Signing in</p>
                            </div>
                                :
                            <div>
                                <p className="text-nowrap">Sign in</p>
                            </div>
                        }
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;