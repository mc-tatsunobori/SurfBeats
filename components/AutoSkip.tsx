import React, { useState, useEffect } from "react";
import { skipTrack, pausePlayback, refreshAccessToken, playPlaylist } from "@/lib/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCirclePlay, faCirclePause} from "@fortawesome/free-solid-svg-icons";

interface AutoSkipProps {
    accessToken: string;
    refreshToken: string;
    playlistId: string;
}

const AutoSkip: React.FC<AutoSkipProps> = ({ accessToken, refreshToken, playlistId }) => {
    const [stopSkipping, setStopSkipping] = useState(false);
    const [token, setToken] = useState(accessToken);
    const [isPlaying, setIsPlaying] = useState(false);

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
            setIsPlaying(false); // 追加
        } catch (error) {
            console.error("Error pausing and stopping skipping", error);
        }
    };

    const handleResumeAndStartSkipping = async () => {
        try {
            await playPlaylist(token, playlistId);
            setStopSkipping(false);
            setIsPlaying(true); // 追加
        } catch (error) {
            console.error("Error resuming and starting skipping", error);
        }
    };

    return (
        <div className="absolute bottom-0 right-0 mb-2 mr-2">
            {isPlaying ? (
                <FontAwesomeIcon
                    onClick={handlePauseAndStopSkipping}
                    className="text-blue-500 cursor-pointer"
                    icon={faCirclePause}
                    size="2xl"
                />
            ) : (
                <FontAwesomeIcon
                    onClick={handleResumeAndStartSkipping}
                    className="text-blue-500 cursor-pointer"
                    icon={faCirclePlay}
                    size="2xl"
                />
            )}
        </div>
    );
};

export default AutoSkip;
