import {Like, Bookmark, BookOpen, Bookmarked, Liked} from '../../asserts/icons';
import { Link } from 'react-router-dom';
import type { Article } from '../../types';
import {useState} from "react";
import {bookmark, like} from "../../hooks/Interaction.ts";


interface PostCardProps {
    post: Article;
    userId: number;
    bookmarkState: boolean;
    likedState: boolean;
}

const PostCard = ({ post, userId, bookmarkState, likedState }: PostCardProps) => {
    const [bookmarked, setBookmarked] = useState<boolean>(bookmarkState);
    const [liked, setLiked] = useState<boolean>(likedState);
    return (
        <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/post/${post.id}`}>
                <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                />
            </Link>
            <div className="p-6">
                <Link to={`/post/${post.id}`}>
                    <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
                </Link>
                <Link to={`/profile/${post.author.id}`}>
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-600 hover:underline">{post.author.username}</span>
                    </div>
                </Link>
                <Link to={`/post/${post.id}`}>
                    <p className="text-gray-600 mb-4">
                        {post.content.length <= 150 ? post.content : `${post.content.slice(0, 150)}...`}
                    </p>
                </Link>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-gray-500">
                            <BookOpen className="w-4 h-4 mr-1"  />
                            {post.readTime} min read
                        </span>
                        <button
                            onClick={async () => await like(liked, setLiked, post, userId)}
                            className="flex items-center text-gray-500"
                        >
                            { liked
                                ? <Liked className="w-4 h-4 mr-1"/>
                                : <Like className="w-4 h-4 mr-1"/>
                            }
                            {post.likes}
                        </button>
                    </div>
                    <button onClick={async () => await bookmark(bookmarked, setBookmarked, post.id, userId)} className="text-gray-500 hover:text-gray-700">
                        { bookmarked
                            ? <Bookmarked className="w-5 h-5" />
                            : <Bookmark className="w-5 h-5" />
                        }
                    </button>
                </div>
            </div>
        </article>
    );
};

export default PostCard;