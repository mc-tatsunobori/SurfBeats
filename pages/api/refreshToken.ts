// pages/api/refreshToken.js
import {sessionOptions} from "@/iron-session.config";
import {refreshAccessToken} from "@/lib/spotify";
import {withIronSessionApiRoute} from "iron-session/next";
import {NextApiRequest, NextApiResponse} from "next";

export default withIronSessionApiRoute(
    async function refreshTokenApi(req: NextApiRequest, res: NextApiResponse) {
        const session = req.session;
        const refreshToken = session?.refreshToken;
        try {
            const newToken = await refreshAccessToken(refreshToken);
            const accessToken = newToken.access_token;

            const currentTime = Math.floor(Date.now() / 1000);
            const expiresIn = newToken.expires_in + currentTime;

            session.accessToken = accessToken;
            session.expiresIn = expiresIn;
            await session.save();

            return accessToken;

        } catch (error) {
            console.error("Error refreshing access token", error);
            throw error;
        }
    }, sessionOptions);
