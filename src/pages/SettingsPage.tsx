import React, {useEffect, useState} from "react";
import {AlertTriangle, KeyRound, Save, Trash, Lock, HidePassword, ShowPassword} from "../asserts/icons";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {server} from "../utils/address";
import {clearCookies, readCookies} from "../utils/cookies"
import {useNavigate} from "react-router-dom";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";
import {SHA256} from "crypto-js";
import ImageUpload from "../components/post/ImageUpload.tsx";

const settingsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().max(160, 'Bio must be less than 160 characters'),
    avatar: z.string().url('Invalid image URL'),
    emailNotifications: z.object({
        newFollower: z.boolean(),
        newComment: z.boolean(),
        newMessage: z.boolean(),
    }),
});

const verifyPasswordSchema = z.object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const passwordUpdateSchema = z.object({
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;
type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>;
type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
    document.title = 'Settings';
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: {errors},
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: "",
            email: "",
            bio: "",
            avatar: "",
            emailNotifications: {
                newFollower: false,
                newComment: false,
                newMessage: false,
            },
        },
    });

    const {
        register: registerPasswordUpdate,
        handleSubmit: handleSubmitPasswordUpdate,
        formState: { errors: passwordUpdateErrors }
    } = useForm<PasswordUpdateFormData>({
        resolver: zodResolver(passwordUpdateSchema),
    });

    const {
        register: registerVerify,
        handleSubmit: handleSubmitVerify,
        formState: { errors: verifyErrors }
    } = useForm<VerifyPasswordFormData>({
        resolver: zodResolver(verifyPasswordSchema),
    });

    const avatarUrl = watch('avatar');

    const cookies = readCookies();
    const userId = cookies.id;
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);

    const [verifying, setVerifying] = useState<boolean>(false);
    const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [showDangerZone, setShowDangerZone] = useState<boolean>(false);
    const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState<boolean>(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    useEffect(() => {
        try {
            // fetch(`${server}/v1/user/${userId}`, {
            //     method: 'GET'
            fetch(`${server}/v2/user/get/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {},
                    responseFields: ["username", "email", "bio", "avatar", "emailPreference", "password"],
                })
            }).then(res => {
                res.json().then((userData) => {
                    if (res.ok) {
                        reset({
                            name: userData.username || "",
                            email: userData.email || "",
                            bio: userData.bio || "",
                            avatar: userData.avatar || "",
                            emailNotifications: userData.emailPreference || {
                                newFollower: false,
                                newComment: false,
                                newMessage: false,
                            },
                        });

                        setLoading(false);
                    } else {
                        console.error(`Response code ${res.status}: ${userData.error}`);
                        clearCookies();
                        navigate("/login");
                        popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
                    }
                });
            }).catch((error) => {
                console.error("Failed to connect:", error);
                navigate("/login");
                popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            });
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            clearCookies();
            navigate("/login");
            popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        }
    }, [reset, userId]);

    const onSubmit = async (data: SettingsFormData) => {
        setUpdating(true);
        try {
            // const res = await fetch(`${server}/v1/user/update`, {
            //     method: "PUT",
            const res = await fetch(`${server}/v2/user/update/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        avatar: data.avatar,
                        username: data.name,
                        bio: data.bio,
                        email: data.email,
                        preference: data.emailNotifications,
                    },
                    responseFields: [],
                })
            });

            let error = ``;
            if (!res.ok) {
                try {
                    const userData = await res.json();
                    error=`Status code ${res.status} (${res.statusText}): ${userData.error}`;
                } catch (err) {
                    error=`${res.url} responded ${res.status}`;
                }
            }

            if (error) {
                console.error(error);
                popup("Failed to update all settings:\n\n" + error);
            } else {
                popup("Settings updated successfully!");
            }
        } catch (err) {
            console.error("Error updating settings:", err);
            popup("Failed to update settings.");
        }
        setUpdating(false);
    };

    const verifyPassword = async (data: { currentPassword: string }) => {
        try {
            setVerifying(true);
            const res = await fetch(`${server}/v2/user/passwordVerify/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        password: SHA256(data.currentPassword).toString(),
                    },
                    responseFields: [],
                })
            });

            const result = await res.json();
            if (res.ok) {
                if (result.verified) {
                    setShowDangerZone(true);
                } else {
                    setShowDangerZone(false);
                    popup("Incorrect Password");
                }
            } else {
                setShowDangerZone(false);
                console.error(result.error);
                popup("Unable to Verify Password, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        } catch (error) {
            setShowDangerZone(false);
            console.error(error);
            popup("Unable to Verify Password, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        } finally {
            setVerifying(false);
        }
    };

    const updatePassword = async (data: PasswordUpdateFormData) => {
        try {
            setUpdatingPassword(true);
            const res = await fetch(`${server}/v2/user/passwordUpdate/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        password: SHA256(data.newPassword).toString(),
                    },
                    responseFields: [],
                })
            });

            const result = await res.json();
            if (res.ok) {
                popup("Password Successfully Updated");
            } else {
                console.error(result.error);
                popup("Unable to Update Your Password, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Update Your Password, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const deleteAccount = async () => {
        try {
            setDeleting(true);
            const res = await fetch(`${server}/v2/user/deleted/${userId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {},
                    responseFields: [],
                })
            });

            const result = await res.json();
            if (res.ok) {
                clearCookies();
                navigate("/login");
                popup("Your Account Was Successfully Deleted");
            } else {
                console.error(result.error);
                popup("Unable to Delete Your Account, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Delete Your Account, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="max-w-2xl mx-auto" >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {
                        updating ?
                            <div className="flex flex-row items-center space-x-2">
                                <Loading message="" scale={0.2} color="#fff"/>
                                <p className="text-nowrap">Saving</p>
                            </div>
                            :
                            <div className="flex flex-row items-center space-x-2">
                                <Save className="w-5 h-5"/>
                                <p className="text-nowrap">Save Changes</p>
                            </div>
                    }
                </button>
            </div>

            <form className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                        </label>
                        <ImageUpload
                            onUpload={(url) => setValue('avatar', url)}
                            defaultImage={avatarUrl}
                            className="w-32 h-32 flex-shrink-0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            {...register("bio")}
                            rows={3}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                        />
                        {errors.bio && (
                            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Email Notifications</h2>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                {...register("emailNotifications.newFollower")}
                                type="checkbox"
                                id="newFollower"
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                            />
                            <label
                                htmlFor="newFollower"
                                className="ml-3 text-sm text-gray-700"
                            >
                                Someone follows you
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                {...register("emailNotifications.newComment")}
                                type="checkbox"
                                id="newComment"
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                            />
                            <label
                                htmlFor="newComment"
                                className="ml-3 text-sm text-gray-700"
                            >
                                Someone comments on your post
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                {...register("emailNotifications.newMessage")}
                                type="checkbox"
                                id="newMessage"
                                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                            />
                            <label
                                htmlFor="newMessage"
                                className="ml-3 text-sm text-gray-700"
                            >
                                Someone sends you a message
                            </label>
                        </div>
                    </div>
                </div>
            </form>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mt-8">
                <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-500"/>
                    <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
                </div>

                {!showDangerZone ? (
                    <form onSubmit={handleSubmitVerify(verifyPassword)} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Please verify your password to access account management options.
                        </p>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Lock className="w-5 h-5 text-gray-400"/>
                                <div className="relative w-full">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        {...registerVerify('currentPassword')}
                                        placeholder="Enter your current password"
                                        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1 w-full"
                                    />
                                    <button
                                        type="button"
                                        onMouseDown={() => setShowCurrentPassword(true)}
                                        onMouseUp={() => setShowCurrentPassword(false)}
                                        onMouseLeave={() => setShowCurrentPassword(false)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                    >
                                        {showCurrentPassword ?
                                            <HidePassword className="w-5 h-5"/> :
                                            <ShowPassword className="w-5 h-5"/>
                                        }
                                    </button>
                                </div>
                            </div>
                            {verifyErrors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{verifyErrors.currentPassword.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 justify-items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={verifying}
                        >
                            {verifying ?
                                <div className="flex flex-row space-x-2 w-fit">
                                <Loading message="" scale={0.2} color="#fff"/>
                                    <p className="text-nowrap">Verifying...</p>
                                </div>
                                :
                                <div>
                                    <p className="text-nowrap">Verify Password</p>
                                </div>
                            }
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <button
                                    className="flex items-center space-x-2 w-full"
                                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                                >
                                    <KeyRound className="w-5 h-5 text-gray-500"/>
                                    <h3 className="font-medium">Reset Password</h3>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswordReset ? 'Cancel' : 'Change'}
                                </button>
                            </div>

                            {showPasswordReset && (
                                <form onSubmit={handleSubmitPasswordUpdate(updatePassword)} className="space-y-4">
                                    <div className="relative w-full">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            {...registerPasswordUpdate('newPassword')}
                                            placeholder="New password"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                                        />
                                        <button
                                            type="button"
                                            onMouseDown={() => setShowNewPassword(true)}
                                            onMouseUp={() => setShowNewPassword(false)}
                                            onMouseLeave={() => setShowNewPassword(false)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNewPassword ?
                                                <HidePassword className="w-5 h-5"/> :
                                                <ShowPassword className="w-5 h-5"/>
                                            }
                                        </button>
                                        {passwordUpdateErrors.newPassword && (
                                            <p className="mt-1 text-sm text-red-600">{passwordUpdateErrors.newPassword.message}</p>
                                        )}
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...registerPasswordUpdate('confirmPassword')}
                                            placeholder="Confirm new password"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                                        />
                                        <button
                                            type="button"
                                            onMouseDown={() => setShowConfirmPassword(true)}
                                            onMouseUp={() => setShowConfirmPassword(false)}
                                            onMouseLeave={() => setShowConfirmPassword(false)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ?
                                                <HidePassword className="w-5 h-5"/> :
                                                <ShowPassword className="w-5 h-5"/>
                                            }
                                        </button>
                                        {passwordUpdateErrors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{passwordUpdateErrors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 justify-items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updatingPassword}
                                    >
                                        {updatingPassword ?
                                            <div className="flex flex-row space-x-2 w-fit">
                                                <Loading message="" scale={0.2} color="#fff"/>
                                                <p className="text-nowrap">Updating Your Password...</p>
                                            </div>
                                            :
                                            <div>
                                                <p className="text-nowrap">Update Password</p>
                                            </div>
                                        }
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="p-4 border border-red-200 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <button
                                    className="flex items-center space-x-2 w-full"
                                    onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                                >
                                    <Trash className="w-5 h-5 text-red-500"/>
                                    <h3 className="font-medium text-red-500">Delete Account</h3>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    {showDeleteAccount ? 'Cancel' : 'Delete'}
                                </button>
                            </div>

                            {showDeleteAccount && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        This action cannot be undone. All your data will be permanently deleted.
                                        To confirm, please type <span className="font-bold">{"Permanently Delete Account"}</span> below:
                                    </p>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        placeholder="Permanently Delete Account"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 px-2 py-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deleteAccount()}
                                        disabled={deleteConfirmation !== "Permanently Delete Account" || deleting}
                                        className={`w-full px-4 py-2 rounded-lg justify-items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                            deleteConfirmation === "Permanently Delete Account"
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        { deleting ?
                                            <div className="flex flex-row space-x-2 w-fit">
                                                <Loading message="" scale={0.2} color="#fff"/>
                                                <p className="text-nowrap">Deleting...</p>
                                            </div>
                                            :
                                            <div>
                                                <p className="text-nowrap">Delete My Account</p>
                                            </div>
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;