import React, { useState, useEffect } from "react";
import { skipTrack, pausePlayback, resumePlayback, refreshAccessToken, playPlaylist } from "@/lib/spotify";

interface AutoSkipProps {
    accessToken: string;
    refreshToken: string;
    playlistId: string;
}

const AutoSkip: React.FC<AutoSkipProps> = ({ accessToken, refreshToken, playlistId }) => {
    const [stopSkipping, setStopSkipping] = useState(false);
    const [token, setToken] = useState(accessToken);

    useEffect(() => {
        if (!playlistId || stopSkipping) return;

        const skip = async () => {
            try {
                await skipTrack(token);
            } catch (error: any) {
                if (error.status === 401) {
                    const {access_token, expires_in} = await refreshAccessToken(refreshToken);
                    setToken(access_token);
                    await skip();
                } else {
                    console.error("Error skipping track", error);
                }
            }
        };

        const intervalId = setInterval(skip, 120000);
        return () => clearInterval(intervalId);
    }, [playlistId, stopSkipping, token]);

    const handlePauseAndStopSkipping = async () => {
        try {
            await pausePlayback(token);
            setStopSkipping(true);
        } catch (error) {
            console.error("Error pausing and stopping skipping", error);
        }
    };

    const handleResumeAndStartSkipping = async () => {
        try {
            await playPlaylist(token, playlistId);
            setStopSkipping(false);
        } catch (error) {
            console.error("Error resuming and starting skipping", error);
        }
    };

    return (
        <div>
            <button onClick={handlePauseAndStopSkipping}>Pause and Stop Skipping</button>
            <button onClick={handleResumeAndStartSkipping}>Resume and Start Skipping</button>
        </div>
    );
};

export default AutoSkip;
