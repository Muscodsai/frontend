import React, {useEffect} from "react";
import {Save} from "../asserts/icons";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {server} from "../utils/address";
import {clearCookies, readCookies} from "../utils/cookies"
import {useNavigate} from "react-router-dom";
import {popup} from "../utils/popup.ts";

const settingsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(160, "Bio must be less than 160 characters"),
    avatar: z.string().url("Please enter a valid image URL"),
    emailNotifications: z.object({
        newFollower: z.boolean(),
        newComment: z.boolean(),
        newMessage: z.boolean(),
    }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        watch,
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

    const cookies = readCookies();
    const userId = cookies.id;

    useEffect(() => {
        try {
            fetch(`${server}/v1/user/${userId}`, {
                method: 'GET'
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
                    } else {
                        console.error(`Response code ${res.status}: ${userData.error}`);
                        clearCookies();
                        navigate("/login");
                        popup("Authentication Failed, Please Login Again");
                    }
                });
            }).catch((error) => {
                console.error("Failed to connect:", error);
                popup("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            });
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            clearCookies();
            navigate("/login");
            popup("Authentication Failed, Please Login Again");
        }
    }, [reset, userId]);


    const onSubmit = async (data: SettingsFormData) => {
        try {
            const res = await fetch(`${server}/v1/user/update`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',  // Set the correct content type
                },
                body: JSON.stringify({
                    userId: userId,
                    avatar: data.avatar,
                    username: data.name,
                    bio: data.bio,
                    email: data.email,
                    preference: data.emailNotifications
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
    };

    return (
        <div className="max-w-2xl mx-auto" /* Add some margin (especially marginTop) */ >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    <Save className="w-5 h-5"/>
                    <span>Save Changes</span>
                </button>
            </div>

            <form className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                        </label>
                        <div className="flex items-center space-x-4">
                            <img
                                src={watch('avatar')}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <input  // Maybe remove this input, and let the user click on the avatar to update?
                                {...register("avatar")}
                                type="text"  // Maybe type="file" and upload the avatar to the DB, then use the generated URL to that avatar in the DB?
                                placeholder="Enter image URL"
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                            />
                        </div>
                        {errors.avatar && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.avatar.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            // for all text inputs, add a padding, especially paddingLeft to show cursor.
                            {...register("name")}
                            type="text"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
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
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
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
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
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
        </div>
    );
};

export default SettingsPage;
