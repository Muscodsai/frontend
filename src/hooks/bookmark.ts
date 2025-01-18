import {Dispatch, SetStateAction} from "react";
import {server} from "../utils/address.ts";

export async function bookmark (bookmarked: boolean, setBookmarked: Dispatch<SetStateAction<boolean>>, articleId: number, userId: number) {
    setBookmarked(!bookmarked);
    try {
        // const res = await fetch(`${server}/v1/article/${articleId}/bookmark/${userId}`, {
        //     method: 'POST'
        // })
        const res = await fetch(`${server}/v2/article/bookmark/${articleId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',  // Set the correct content type
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
            setBookmarked(!bookmarked);
            console.error(result.error);
        }
    } catch (error) {
        setBookmarked(!bookmarked);
        console.error(error);
    }
}