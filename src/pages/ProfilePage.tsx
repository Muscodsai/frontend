import {Link} from 'react-router-dom';
import {Edit, Users} from '../asserts/icons';
import PostCard from '../components/post/PostCard';
import {useEffect, useState} from "react";
import {server} from "../utils/address.ts";
import {readCookies} from "../utils/cookies.ts";

const ProfilePage = () => {
    const cookies = readCookies();
    const id = cookies.id;
    const [user, setUser] = useState<any>({id: id})
    const [userPosts, setPost] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getArticle = async (articleId: number) => {
            try {
                let post: any = {
                    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',  // STUB!
                    readTime: 5,  // STUB!
                };
                const response = await fetch(`${server}/v1/article/${articleId}`, {
                    method: 'GET'
                });

                const result = await response.json();

                if (response.ok) {
                    post.id = result.id;
                    post.title = result.title;
                    post.content = result.content;
                    post.author = user;
                    post.publishedAt = result.initialCreateTime;
                    post.likes = result.likes.length;
                    post.isSeries = result.long;
                    return post;
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
            }
        }

        const getUser = async () => {
            let userInfo: any = {
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',  // STUB!
                bio: 'Tech writer and web developer'  // STUB!
            };
            try {
                const response = await fetch(`${server}/v1/user/${id}`, {
                    method: 'GET'
                });

                const result = await response.json();

                if (response.ok) {
                    userInfo.name = result.username;
                    userInfo.email = result.email;
                    userInfo.followers = result.followers.length;
                    userInfo.following = result.following.length;
                    setUser(userInfo);
                    let posts: any[] = [];
                    for (let post of result.publishedArticles) {
                        posts.push(await getArticle(post));
                    }
                    setPost(posts);
                    setLoading(false);
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
            }
        }
        getUser().then(() => {});
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    console.log(userPosts);

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
                                    <Users className="w-5 h-5 text-gray-500"/>
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
                        <Edit className="w-5 h-5"/>
                        <span>Edit Profile</span>
                    </Link>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Published Stories</h2>
                {userPosts.map(post => (
                    <PostCard key={post.id} post={post}/>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;