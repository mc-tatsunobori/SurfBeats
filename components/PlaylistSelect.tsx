import React, {useState, useEffect} from "react";
import {getUserPlaylists} from "@/lib/spotify";

interface PlaylistSelectProps {
    accessToken: string;
    onPlaylistSelected: (playlistId: string) => void;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> =
    ({
         accessToken,
         onPlaylistSelected,
     }) => {
        const [playlists, setPlaylists] = useState([]);
        const [selectedPlaylist, setSelectedPlaylist] = useState("");

        useEffect(() => {
            if (!accessToken) return;

            const fetchPlaylists = async () => {
                try {
                    const userPlaylists = await getUserPlaylists(accessToken);
                    console.log(userPlaylists);
                    setPlaylists(userPlaylists);
                } catch (error) {
                    console.error("Error fetching user playlists", error);
                }
            };

            fetchPlaylists();
        }, [accessToken]);

        return (
            <div>
                <h2>Your playlists:</h2>
                <ul>
                    {playlists.map((playlist: any) => (
                        <li key={playlist.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="playlist"
                                    value={playlist.id}
                                    onChange={(e) => {
                                        setSelectedPlaylist(e.target.value);
                                        onPlaylistSelected(e.target.value);
                                    }}
                                />
                                {playlist.name}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

export default PlaylistSelect;
