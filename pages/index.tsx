import React, {useEffect, useState} from "react";
import PlaylistSelect from "../components/PlaylistSelect";
import AutoSkip from "../components/AutoSkip";
import type {GetServerSideProps} from "next";
import {withIronSessionSsr} from "iron-session/next";
import process from "process";
import {isTokenExpired, refreshAccessToken} from "@/lib/spotify";

interface AutoSkipPageProps {
    accessToken: string;
    refreshToken: string;

    authUrl: string;
}

const AutoSkipPage: React.FC<AutoSkipPageProps> = ({
                                                       accessToken,
                                                       refreshToken,
                                                       authUrl,
                                                   }) => {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);

    useEffect(() => {
        setIsLoggedIn(!!accessToken);
    }, [accessToken]);

    const handleLogin = () => {
        window.location.href = authUrl;
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">SurfBeats</h1>
            {isLoggedIn ? (
                <>
                    <PlaylistSelect
                        accessToken={accessToken}
                        onPlaylistSelected={setSelectedPlaylistId}
                    />
                    {selectedPlaylistId && (
                        <AutoSkip
                            accessToken={accessToken}
                            refreshToken={refreshToken}
                            playlistId={selectedPlaylistId}
                        />
                    )}
                </>
            ) : (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                    Sign in with Spotify
                </button>
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
            authUrl
        },
    };
}, sessionOptions);

export default AutoSkipPage;
