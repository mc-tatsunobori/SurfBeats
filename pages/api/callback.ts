import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import process from "process";
import {getAccessToken} from "@/lib/spotify";

// iron-sessionに関する設定
const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: process.env.SECRET_COOKIE_NAME as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export default withIronSessionApiRoute(
    async function callback(req: NextApiRequest, res: NextApiResponse) {
        const code = req.query.code as string;

        const response = await getAccessToken(code);

        const session = req.session;
        session.accessToken = response.access_token;
        session.refreshToken = response.refresh_token;

        await req.session.save();


        res.redirect("/auto-skip");
    },
    sessionOptions
);
