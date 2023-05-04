import React, {useState, useEffect} from "react";
import {skipTrack, pausePlayback, refreshAccessToken, playPlaylist} from "@/lib/spotify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlay, faCirclePause} from "@fortawesome/free-solid-svg-icons";
import {HttpError} from "http-errors";

interface AutoSkipProps {
    accessToken: string;
    refreshToken: string;
    playlistId: string;
    onError: (err: HttpError | null) => void;
    currentlyPlayingPlaylistId: string | null;
}

const AutoSkip: React.FC<AutoSkipProps> = ({accessToken, refreshToken, playlistId, onError, currentlyPlayingPlaylistId}) => {
    const [stopSkipping, setStopSkipping] = useState(false);
    const [token, setToken] = useState(accessToken);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsPlaying(currentlyPlayingPlaylistId === playlistId);
    }, [currentlyPlayingPlaylistId, playlistId]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const skip = async () => {
            try {
                if (!stopSkipping) {
                    await skipTrack(accessToken);
                }
            } catch (error: any) {
                onError(error);
                console.error("Error skipping track", error);
            }
        };

        if (isPlaying && !stopSkipping) {
            intervalId = setInterval(skip, 120000);
        }

        return () => clearInterval(intervalId);

    }, [isPlaying, stopSkipping, token]);

    const handlePauseAndStopSkipping = async () => {
        try {
            await pausePlayback(token);
            setStopSkipping(true);
            setIsPlaying(false);
            onError(null);
        } catch (error: any) {
            setStopSkipping(true);
            setIsPlaying(false);
            console.error("Error pausing and stopping skipping", error);
            onError(error);
        }
    };

    const handleResumeAndStartSkipping = async () => {
        try {
            await playPlaylist(token, playlistId);
            setStopSkipping(false);
            setIsPlaying(true);
            onError(null);
        } catch (error: any) {
            setStopSkipping(true);
            setIsPlaying(false);
            console.error("Error resuming and starting skipping", error);
            onError(error);
        }
    };

    return (
        <div className="absolute bottom-0 right-0 mb-2 mr-2">
            {isPlaying ? (
                <FontAwesomeIcon
                    onClick={handlePauseAndStopSkipping}
                    className="text-sb-light-blue cursor-pointer"
                    icon={faCirclePause}
                    size="2xl"
                />
            ) : (
                <FontAwesomeIcon
                    onClick={handleResumeAndStartSkipping}
                    className="text-sb-light-blue cursor-pointer"
                    icon={faCirclePlay}
                    size="2xl"
                />
            )}
        </div>
    );
};

export default AutoSkip;
