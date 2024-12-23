import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Save from '../assets/Save';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must be less than 160 characters'),
  avatar: z.string().url('Please enter a valid image URL'),
  emailNotifications: z.object({
    newFollower: z.boolean(),
    newComment: z.boolean(),
    newMessage: z.boolean(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      bio: 'Tech writer and web developer passionate about creating content that helps others learn and grow.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      emailNotifications: {
        newFollower: true,
        newComment: true,
        newMessage: true,
      },
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    console.log('Settings updated:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <Save className="w-5 h-5" />
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
                src={register('avatar').value}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <input
                {...register('avatar')}
                type="text"
                placeholder="Enter image URL"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              {...register('name')}
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
              {...register('email')}
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
              {...register('bio')}
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
                {...register('emailNotifications.newFollower')}
                type="checkbox"
                id="newFollower"
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <label htmlFor="newFollower" className="ml-3 text-sm text-gray-700">
                Someone follows you
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register('emailNotifications.newComment')}
                type="checkbox"
                id="newComment"
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <label htmlFor="newComment" className="ml-3 text-sm text-gray-700">
                Someone comments on your post
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register('emailNotifications.newMessage')}
                type="checkbox"
                id="newMessage"
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <label htmlFor="newMessage" className="ml-3 text-sm text-gray-700">
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