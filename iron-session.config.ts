import {IronSessionOptions} from "iron-session";
import process from "process";

export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: process.env.SECRET_COOKIE_NAME as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}

declare module "iron-session" {
    interface IronSessionData {
        accessToken: string,
        refreshToken: string,

        expiresIn: number
    }
}
