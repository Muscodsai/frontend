import {Dispatch, SetStateAction} from "react";
import {server} from "../utils/address.ts";
import {popup} from "../utils/popup.ts";

export async function bookmark (bookmarked: boolean, setBookmarked: Dispatch<SetStateAction<boolean>>, articleId: number, userId: number) {
    setBookmarked(!bookmarked);
    try {
        const res = await fetch(`${server}/v2/article/bookmark/${articleId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestFields: {
                    id: userId,
                },
                responseFields: [],
            })
        });
        const result = await res.json();

        if (res.ok) {
            console.log("ok");
        } else {
            setBookmarked(bookmarked);
            console.error(result.error);
            popup("Unable to change bookmark status");
        }
    } catch (error) {
        setBookmarked(bookmarked);
        console.error(error);
        popup("Unable to change bookmark status");
    }
}

export async function follow (following: boolean, setFollowing: Dispatch<SetStateAction<boolean>>, user: any, followerId: number) {
    setFollowing(!following);
    if (following) {
        user.followers--;
    } else {
        user.followers++;
    }
    try {
        const res = await fetch(`${server}/v2/user/follow/${user.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestFields: {
                    id: followerId,
                },
                responseFields: [],
            })
        });
        const result = await res.json();

        if (res.ok) {
            console.log("ok");
        } else {
            setFollowing(following);
            if (following) {
                user.followers++;
                popup("Cannot unfollow the user");
            } else {
                user.followers--;
                popup("Cannot follow the user");
            }
            console.error(result.error);
        }
    } catch (error) {
        setFollowing(following);
        if (following) {
            user.followers++;
            popup("Cannot unfollow the user");
        } else {
            user.followers--;
            popup("Cannot follow the user");
        }
        console.error(error);
    }
}


export async function like (liked: boolean, setLiked: Dispatch<SetStateAction<boolean>>, post: any, likerId: number) {
    setLiked(!liked);
    if (liked) {
        post.likes--;
    } else {
        post.likes++;
    }
    try {
        const res = await fetch(`${server}/v2/article/like/${post.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestFields: {
                    id: likerId,
                },
                responseFields: [],
            })
        });
        const result = await res.json();

        if (res.ok) {
            console.log("ok");
        } else {
            setLiked(liked);
            if (liked) {
                post.likes--;
                popup("Cannot like the article");
            } else {
                post.likes++;
                popup("Cannot unlike the article");
            }
            console.error(result.error);
        }
    } catch (error) {
        setLiked(liked);
        if (liked) {
            post.likes--;
            popup("Cannot like the article");
        } else {
            post.likes++;
            popup("Cannot unlike the article");
        }
        console.error(error);
    }
}
