import React from 'react';

interface PlaybackInfoProps {
    currentPlayback: {
        title: string;
        artist: string;
        cover: string;
    } | null;
}

const PlaybackInfo: React.FC<PlaybackInfoProps> = ({ currentPlayback }) => {
    if (!currentPlayback) {
        return null;
    }

    const { title, artist, cover } = currentPlayback;

    return (
        <div className="w-full h-full m-auto py-2 px-4 shadow-lg flex items-center justify-start">
            <div className="h-16 w-16">
                <img src={cover} alt="album cover" className={"h-full w-full"}/>
            </div>
            <div className="ml-4">
                <div className="text-sm text-sb-dark-blue font-bold">{title}</div>
                <div className="text-xs text-sb-dark-blue">{artist}</div>
            </div>
        </div>
    );
};

export default PlaybackInfo;
