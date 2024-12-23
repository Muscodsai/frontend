import { ThumbsUp, Bookmark } from '../../asserts/icons';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
}

const PostCard = ({ post, showFullContent = false }: PostCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
        </Link>
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-600">{post.author.name}</span>
        </div>
        <p className="text-gray-600 mb-4">
          {showFullContent ? post.content : `${post.content.slice(0, 150)}...`}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gray-500">
              <Bookmark className="w-4 h-4 mr-1" />
              {post.readTime} min read
            </span>
            <span className="flex items-center text-gray-500">
              <ThumbsUp className="w-4 h-4 mr-1" />
              {post.likes}
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;