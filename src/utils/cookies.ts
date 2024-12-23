import Cookies from 'js-cookie';
import {SHA256} from "crypto-js";

export function setCookies(cookies: any): void {
    for (let key of Object.keys(cookies)) {
        Cookies.set(key, JSON.stringify(cookies[key]));
    }
    Cookies.set("token", SHA256(JSON.stringify(cookies)).toString());
    Cookies.set("keys", JSON.stringify(Object.keys(cookies)));
}

export function clearCookies(): void {
    const keys = JSON.parse(Cookies.get("keys") || "null");
    if (!keys)
        return;
    for (let key of keys)
        Cookies.remove(key);
    Cookies.remove("token");
    Cookies.remove("keys");
}

export function readCookies(): any {
    let cookies: any = {};
    const keys = JSON.parse(Cookies.get("keys") || "null");
    if (!keys)
        return {};

    for (let key of keys) {
        try {
            if (key != "token" && key != "keys")
                cookies[key] = JSON.parse(Cookies.get(key) || 'null');
        } catch (e) {
            cookies[key] = null;
        }
    }

    if (SHA256(JSON.stringify(cookies)).toString() === Cookies.get("token"))
        return cookies;
    clearCookies();
    return {};
}