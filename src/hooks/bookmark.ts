import {Dispatch, SetStateAction} from "react";
import {server} from "../utils/address.ts";

export async function bookmark (bookmarked: boolean, setBookmarked: Dispatch<SetStateAction<boolean>>, articleId: number, userId: number) {
    setBookmarked(!bookmarked);
    try {
        const res = await fetch(`${server}/v1/article/${articleId}/bookmark/${userId}`, {
            method: 'POST'
        })
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