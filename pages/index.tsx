import React, {useEffect, useState} from "react";
import PlaylistSelect from "../components/PlaylistSelect";
import type {GetServerSideProps} from "next";
import {withIronSessionSsr} from "iron-session/next";
import process from "process";
import {isTokenExpired, refreshAccessToken} from "@/lib/spotify";
import {HttpError} from "http-errors";
import {sessionOptions} from "@/iron-session.config"
import {useCurrentPlayback} from "@/lib/useCurrentPlayback";
import PlaybackInfo from "@/components/PlaybackInfo";
import {useAvailableDevices} from "@/lib/useAvailableDevices";
import {useTokenRefresh} from "@/lib/useTokenRefresh";

interface IndexProps {
    accessToken: string;
    refreshToken: string;
    expiresIn: number,
    authUrl: string;
}

const Index: React.FC<IndexProps> =
    ({
         accessToken,
         refreshToken,
         expiresIn,
         authUrl,
     }) => {
        const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);

        const [errorMessage, setErrorMessage] = useState("");

        const { token: refreshedToken, error: tokenError } = useTokenRefresh(accessToken, expiresIn);

        const handleError = (err: HttpError | null) => {
            if (err === null) {
                return setErrorMessage("");
            }
            const error = err.body.error;
            if (error.status === 404) {
                return setErrorMessage("デバイスが有効ではありません。spotifyアプリを起動してアクティブにしてください。");
            }

            return setErrorMessage("プレイリストの再生中に問題が発生しました。ページを更新するなどしてください。");

        };


        useEffect(() => {
            setIsLoggedIn(!!accessToken);
        }, [accessToken]);

        const handleLogin = () => {
            window.location.href = authUrl;
        };
        const { currentPlayback } = useCurrentPlayback(accessToken);

        return (
            <div className="container mx-auto px-4 h-full">
                <p className={"text-3xl md:text-5xl font-bold m-4 text-center font-inter text-sb-dark-blue"}>SurfBeats</p>
                <p className={"text-center text-xl md:text-2xl font-bold mb-4 text-sb-dark-blue"}>あなたの好きな音楽を
                    ”乗りこなし”ましょう。</p>
                <p className={"text-center text-xs md:text-lg text-sb-dark-blue"}>自分のお気に入りのプレイリストを選択して再生ボタンを押すと、</p>
                <p className={"text-center text-xs md:text-lg text-sb-dark-blue"}>2分を目処に自動でスキップして再生し続けます。</p>
                <p className={"text-center mb-4 text-xs md:text-lg text-sb-dark-blue"}>作業中のあなたを波に乗らせること間違いなし。</p>
                {errorMessage && (
                    <div className="text-red-500 font-bold text-center">
                        {errorMessage}
                    </div>
                )}
                {isLoggedIn ? (
                    <>
                        <div className={"flex items-center h-64 md:h-96 max-w-screen-xl mx-auto"}>
                            <PlaylistSelect
                                accessToken={accessToken}
                                refreshToken={refreshToken}
                                onError={handleError}
                            />
                        </div>
                        {currentPlayback && (
                            <div className={"fixed left-0 right-0 bottom-0 flex items-center h-20 w-full max-w-full mx-auto shadow-[0px_-20px_30px_-30px_rgba(0,0,0,0.3)]"}>
                                <PlaybackInfo currentPlayback={currentPlayback} />
                            </div>
                        )}
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


export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({req, res}) => {
    const session = req.session;
    let accessToken = session?.accessToken;
    const refreshToken = session?.refreshToken;
    const expiresIn = session?.expiresIn;

    if (accessToken && refreshToken && isTokenExpired(expiresIn)) {
        try {
            const newToken = await refreshAccessToken(refreshToken);

            session.accessToken = newToken.access_token;

            const currentTime = Math.floor(Date.now() / 1000);
            session.expiresIn = newToken.expires_in + currentTime;

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
            expiresIn: expiresIn || null,
            authUrl,
        },
    };
}, sessionOptions);

export default Index;
