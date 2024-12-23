import { useParams } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from '../asserts/icons';

const ReadingPage = () => {
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API
  const post = {
    id,
    title: 'The Future of Web Development',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      bio: 'Tech writer and web developer'
    },
    publishedAt: '2024-03-15',
    readTime: 5,
    likes: 234
  };

  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />
      
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-medium">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{post.author.bio}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="prose max-w-none mb-8">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-800 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <ThumbsUp className="w-5 h-5" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <MessageCircle className="w-5 h-5" />
            <span>Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;