import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/post/PostCard';
import type { Post, User } from '../types';

import Edit from '../assets/Edit';
import Users from '../assets/User';

const ProfilePage = () => {
  // Mock data - in a real app, this would come from an API
  const user: User = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    bio: 'Tech writer and web developer passionate about creating content that helps others learn and grow.',
    following: 1200,
    followers: 800
  };

  const userPosts: Post[] = [
    {
      id: '1',
      title: 'The Future of Web Development',
      content: 'Exploring the latest trends and technologies shaping the web...',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      author: user,
      publishedAt: '2024-03-15',
      readTime: 5,
      likes: 234,
      isSeries: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.bio}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>{user.followers}</strong> followers
                  </span>
                  <span className="text-sm text-gray-600">·</span>
                  <span className="text-sm text-gray-600">
                    <strong>{user.following}</strong> following
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/settings"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Published Stories</h2>
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;