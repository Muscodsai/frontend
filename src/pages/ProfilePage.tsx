import {Link, useNavigate, useParams} from 'react-router-dom';
import {Edit, Users} from '../asserts/icons';
import PostCard from '../components/post/PostCard';
import {useEffect, useState} from "react";
import {server} from "../utils/address.ts";
import {readCookies} from "../utils/cookies.ts";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";

const ProfilePage = () => {
    const cookies = readCookies();
    const loginUserId = cookies.id;
    let profileUserId = parseInt(useParams().id || loginUserId);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>();
    const [userPosts, setPost] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getArticle = async (articleId: number, user: any) => {
            try {
                let post: any = {};
                // const response = await fetch(`${server}/v1/article/${articleId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/article/get/${articleId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Set the correct content type
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["title", "content", "publishTime", "likes", "isSeries", "readTime", "cover"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    post.id = articleId;
                    post.title = result.title;
                    post.content = result.content;
                    post.author = user;
                    post.publishedTime = result.publishTime;
                    post.likes = result.likes;
                    post.isSeries = result.isSeries;
                    post.readTime = result.readTime;
                    post.cover = result.cover;

                    post.state = user.library.indexOf(post.id) > -1;
                    return post;
                } else {
                    navigate("/");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/");
                popup("Unable to Fetch Article Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const getUser = async () => {
            let user: any = {};
            try {
                // const response = await fetch(`${server}/v1/user/${profileUserId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/user/get/${profileUserId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["username", "email", "followers", "following", "avatar", "bio", "library", "publications"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    user.id = profileUserId;
                    user.username = result.username;
                    user.email = result.email;
                    user.followers = result.followers.length;
                    user.following = result.following.length;
                    user.avatar = result.avatar;
                    user.bio = result.bio;
                    user.library = result.library;
                    user.publications = result.publications;
                    setUser(user);
                    return user;
                } else {
                    navigate("/login");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
                popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const init = async () => {
            try {
                const user = await getUser();
                let postsPromise: any[] = [];
                for (let post of user.publications) {
                    postsPromise.push(getArticle(post, user));
                }
                setPost(await Promise.all(postsPromise));
            } catch (ignore) {}  // already handled
        }

        init().then(() => { setLoading(false); });
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
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
                        {
                            profileUserId === loginUserId ?
                            <Link
                                to="/settings"
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit className="w-5 h-5"/>
                                <span>Edit Profile</span>
                            </Link> : null
                        }
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Published Stories</h2>
                {userPosts.map(post => (
                    <PostCard key={post.id} post={post} userId={profileUserId} state={post.state}/>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;