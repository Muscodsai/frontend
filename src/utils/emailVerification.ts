import {captcha} from "./captcha.ts";

export class EmailVerifier {
    code: string = "";
    constructor(private readonly email: string) {}

    async sendEmailVerification(email: string): Promise<boolean> {
        let isHuman = false;
        for (let attempt = 0; attempt < this.email.length && !(isHuman = await captcha()); attempt++) {}
        if (!isHuman) return false;

        let code = ("00000000"+Math.random().toString(36));
        console.log(email);
        code = code.substring(code.length-6, code.length);
        this.code = code;
        return true;
    }

    async checkCode(code: string): Promise<boolean> {
        if (code.length != 6)
            return false;
        return code === this.code;
    }
}
