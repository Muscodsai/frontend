import { useState } from 'react';
import PostCard from '../components/post/PostCard';
import { BookOpen, Layers } from 'lucide-react';

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<'series' | 'single'>('single');
  
  // Mock data - in a real app, this would come from an API
  const savedPosts = [
    {
      id: '1',
      title: 'The Future of Web Development',
      content: 'Exploring the latest trends and technologies shaping the web...',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      author: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        bio: 'Tech writer and web developer',
        following: 1200,
        followers: 800
      },
      publishedAt: '2024-03-15',
      readTime: 5,
      likes: 234,
      isSeries: false
    }
  ];

  const savedSeries = [
    {
      id: '2',
      title: 'Complete Guide to React',
      content: 'A comprehensive guide to modern React development...',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      author: {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        bio: 'Senior React Developer',
        following: 900,
        followers: 600
      },
      publishedAt: '2024-03-10',
      readTime: 25,
      likes: 567,
      isSeries: true,
      seriesName: 'React Mastery'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === 'single'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Single Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === 'series'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Series</span>
        </button>
      </div>
      
      <div className="grid gap-8">
        {activeTab === 'single'
          ? savedPosts.map(post => <PostCard key={post.id} post={post} />)
          : savedSeries.map(series => <PostCard key={series.id} post={series} />)
        }
      </div>
    </div>
  );
};

export default LibraryPage;