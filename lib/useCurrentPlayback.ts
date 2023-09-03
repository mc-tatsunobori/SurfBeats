// lib/useCurrentPlayback.ts
import { useState, useEffect } from "react";
import {getCurrentPlayback} from "./spotify";

interface PlaybackState {
    title: string;
    artist: string;
    cover: string;
}

export const useCurrentPlayback = (accessToken: string) => {
    const [currentPlayback, setCurrentPlayback] = useState<PlaybackState | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentPlayback = async () => {
            try {
                const playback = await getCurrentPlayback(accessToken);
                setCurrentPlayback(playback);
            } catch (error: any) {
                console.error("Error fetching current playback", error);
                setError(error);
            }
        };

        const intervalId = setInterval(fetchCurrentPlayback, 5000);

        return () => clearInterval(intervalId);
    }, [accessToken]);

    return { currentPlayback, error };
};
