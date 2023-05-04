import React, {useEffect, useState} from "react";
import PlaylistSelect from "../components/PlaylistSelect";
import type {GetServerSideProps} from "next";
import {withIronSessionSsr} from "iron-session/next";
import process from "process";
import {isTokenExpired, refreshAccessToken} from "@/lib/spotify";
import {HttpError} from "http-errors";
import {error} from "next/dist/build/output/log";

interface AutoSkipPageProps {
    accessToken: string;
    refreshToken: string;
    authUrl: string;
}

const AutoSkipPage: React.FC<AutoSkipPageProps> =
    ({
         accessToken,
         refreshToken,
         authUrl,
     }) => {
        const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);

        const [errorMessage, setErrorMessage] = useState("");

        const handleError = (err: HttpError | null) => {
            if(err === null){
                return setErrorMessage("");
            }
            const error = err.body.error;
            if (error.status === 404){
                return  setErrorMessage("デバイスが有効ではありません。spotifyアプリを起動してください。");
            }

            return  setErrorMessage("プレイリストの再生中に問題が発生しました。");

        };


        useEffect(() => {
            setIsLoggedIn(!!accessToken);
        }, [accessToken]);

        const handleLogin = () => {
            window.location.href = authUrl;
        };

        return (
            <div className="container mx-auto px-4">
                <p className={"text-5xl font-bold m-4 text-center font-inter text-sb-dark-blue"}>SurfBeats</p>
                <p className={"text-center text-2xl font-bold mb-4 text-sb-dark-blue"}>あなたの好きな音楽を”乗りこなし”ましょう。</p>
                <p className={"text-center text-lg text-sb-dark-blue"}>自分のプレイリストを選択して再生ボタンを押すと、2分を目処に自動でスキップして再生し続けます。</p>
                <p className={"text-center mb-4 text-lg text-sb-dark-blue"}>作業中のあなたを波に乗らせること間違いなし。</p>
                {errorMessage && (
                    <div className="text-red-500 font-bold">
                        {errorMessage}
                    </div>
                )}
                {isLoggedIn ? (
                    <>
                        <div className={"flex items-center h-96 max-w-screen-xl mx-auto"}>
                            <PlaylistSelect
                                accessToken={accessToken}
                                refreshToken={refreshToken}
                                onError={handleError}
                            />
                        </div>
                    </>
                ) : (
                    <>
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleLogin}
                            className="bg-sb-dark-blue text-sb-white py-2 px-4 rounded-xl"
                        >
                            Sign in with Spotify
                        </button>
                    </div>
                    </>
                )}
            </div>
        );
    };


const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: process.env.SECRET_COOKIE_NAME as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};


export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({req, res}) => {
    const session = req.session;
    let accessToken = session?.accessToken;
    const refreshToken = session?.refreshToken;
    const expiresIn = session?.expiresIn;

    if (accessToken && refreshToken && isTokenExpired(expiresIn)) {
        try {
            const newToken = await refreshAccessToken(refreshToken);

            session.accessToken = newToken.access_token;
            session.expiresIn = newToken.expires_in
            await session.save();

        } catch (error) {
            console.error("Error refreshing access token", error);
        }
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI as string);
    const scopes = encodeURIComponent("user-read-playback-state user-modify-playback-state playlist-read-private");
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

    return {
        props: {
            accessToken: accessToken || null,
            refreshToken: refreshToken || null,
            authUrl,
        },
    };
}, sessionOptions);

export default AutoSkipPage;
