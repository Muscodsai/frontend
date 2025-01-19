import {Link, useNavigate, useParams} from 'react-router-dom';
import {Bookmark, Bookmarked, Like, Liked, MessageCircle, Share2} from '../asserts/icons';
import {server} from "../utils/address.ts";
import {useEffect, useState} from "react";
import {popup} from "../utils/popup.ts";
import {bookmark, like} from "../hooks/Interaction.ts";
import {readCookies} from "../utils/cookies.ts";
import {Loading} from "../asserts/loading.tsx";

const ReadingPage = () => {
    const {id} = useParams();
    const cookies = readCookies();
    const navigate = useNavigate();
    const userId = cookies.id;
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [loadingArticle, setLoadingArticle] = useState<boolean>(true);
    const [post, setPost] = useState<any>({
        id,
        title: '',
        content: '',
        cover: '',
        author: {
            name: '',
            avatar: '',
            bio: ''
        },
        publishTime: '',
        readTime: 0,
        likes: 0
    });
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        const getInitialState = async (): Promise<boolean> => {
            try {
                // const response = await fetch(`${server}/v1/user/${userId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/user/get/${userId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["library"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    setLoadingUser(false);
                    return result.library.indexOf(parseInt(`${id}`)) > -1;
                } else {
                    navigate("/login");
                    popup(result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                navigate("/login");
                popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
            return false;
        }

        const getAuthor = async (uid: number) => {
            let author: any = {};
            try {
                // const response = await fetch(`${server}/v1/user/${uid}`, {
                //     method: 'GET'
                // });

                const response = await fetch(`${server}/v2/user/get/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["username", "avatar", "bio"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    author.id = uid;
                    author.name = result.username;
                    author.avatar = result.avatar;
                    author.bio = result.bio;
                } else {
                    navigate("/");
                    popup(result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                navigate("/");
                popup("Unable to Fetch Author's Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
            return author;
        }

        const getArticle = async () => {
            try {
                // const response = await fetch(`${server}/v1/article/${id}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/article/get/${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["title", "content", "publishTime", "readTime", "likes", "author", "cover"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    post.title = result.title;
                    post.content = result.content;
                    post.publishTime = result.publishTime;
                    post.readTime = result.readTime;
                    post.likes = result.likes.length;
                    post.author = await getAuthor(result.author);
                    post.cover = result.cover;
                    setLoadingArticle(false);

                    setLiked(result.likes.indexOf(userId) !== -1);
                    return post;
                } else {
                    navigate("/");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/");
                popup("Unable to Access the Article, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const init = async () => {
            const [bookmark, post] = await Promise.all([getInitialState(), getArticle()]);
            setBookmarked(bookmark);
            setPost(post);
        }

        init().then();
    }, []);

    if (loadingUser || loadingArticle) {
        console.time("Loading...");
        return <Loading/>
    }
    console.timeEnd("Loading...");
    return (
        <div className="max-w-3xl mx-auto">
            <img
                src={post.cover}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
            />

            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            <div className="flex items-center justify-between mb-8">
                <Link to={`/profile/${post.author.id}`}>
                    <div className="flex items-center space-x-4">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <h3 className="font-medium hover:underline">{post.author.name}</h3>
                            <p className="text-sm text-gray-500">{post.author.bio}</p>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-700">
                        <Share2 className="w-5 h-5"/>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700" onClick={async () => await bookmark(bookmarked, setBookmarked, post.id, userId)}>
                        { bookmarked?
                            <Bookmarked className="w-5 h-5"/>:
                            <Bookmark className="w-5 h-5"/>
                        }
                    </button>
                </div>
            </div>

            <div className="prose max-w-none mb-8">
                {post.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                        {paragraph}
                    </p>
                ))}
            </div>

            <div className="flex items-center justify-between border-t pt-6">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={async () => await like(liked, setLiked, post, userId)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                    >
                        { liked?
                            <Liked className="w-5 h-5"/>:
                            <Like className="w-5 h-5"/>
                        }
                        <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                        <MessageCircle className="w-5 h-5"/>
                        <span>Comments</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadingPage;