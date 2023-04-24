import React, {useState, useEffect} from "react";
import {getUserPlaylists} from "@/lib/spotify";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

interface PlaylistSelectProps {
    accessToken: string;
    onPlaylistSelected: (playlistId: string) => void;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> =
    ({
         accessToken,
         onPlaylistSelected,
     }) => {
        const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>([]);
        const [currentPage, setCurrentPage] = useState(0);
        const maxPage = Math.ceil(playlists.length / 5) - 1;

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

        const prevPage = () => {
            setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
        };

        const nextPage = () => {
            setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
        };

        return (
            <div>
                <h2>Your Playlists</h2>
                <div className="grid grid-cols-2 gap-4 items-start place-items-center">
                    {playlists
                        .slice(currentPage * 5, currentPage * 5 + 5)
                        .map((playlist) => (
                            <div
                                key={playlist.id}
                                className="w-64 p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer"
                                onClick={() => onPlaylistSelected(playlist.id)}
                            >
                                <img
                                    src={playlist.images[0]?.url || ""}
                                    alt={playlist.name}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <h3 className="mt-2 text-lg">{playlist.name}</h3>
                            </div>
                        ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={prevPage}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                            currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <p className="mx-4 my-auto">{currentPage + 1}</p>
                    <button
                        onClick={nextPage}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                            currentPage === maxPage ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={currentPage === maxPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };
export default PlaylistSelect;
