import React, {useState, useEffect} from "react";
import {getUserPlaylists} from "@/lib/spotify";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

interface PlaylistSelectProps {
    accessToken: string;
    onPlaylistSelected: (playlistId: string) => void;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> = ({
                                                           accessToken,
                                                           onPlaylistSelected,
                                                       }) => {
    const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const userPlaylists = await getUserPlaylists(accessToken);
                setPlaylists(userPlaylists);
            } catch (error) {
                console.error("Error fetching playlists", error);
            }
        };

        if (accessToken) {
            fetchPlaylists();
        }
    }, [accessToken]);

    const handlePlaylistClick = (playlistId: string) => {
        onPlaylistSelected(playlistId);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
                <div
                    key={playlist.id}
                    className="bg-white rounded shadow p-4 cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist.id)}
                >
                    <img
                        src={playlist.images[0]?.url || ""}
                        alt={playlist.name}
                        className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <h2 className="text-xl font-bold">{playlist.name}</h2>
                </div>
            ))}
        </div>
    );
};
export default PlaylistSelect;
