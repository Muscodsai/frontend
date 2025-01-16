export async function captcha(): Promise<boolean> {
    let isHuman = false;
    for (let attempt = 0; attempt < 5 && !(isHuman = await (async () => {
        return true;  // STUB! replace with captcha api here
    })()); attempt++) {}
    return isHuman;
}