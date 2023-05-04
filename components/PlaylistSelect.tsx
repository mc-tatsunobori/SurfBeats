import React, {useState, useEffect} from "react";
import {getUserPlaylists} from "@/lib/spotify";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleChevronLeft, faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import AutoSkip from "./AutoSkip";

interface PlaylistSelectProps {
    accessToken: string;
    refreshToken: string;
    onPlaylistSelected: (playlistId: string) => void;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> = ({
                                                           accessToken,
                                                           refreshToken,
                                                           onPlaylistSelected,
                                                       }) => {
    const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const maxPage = Math.ceil(playlists.length / 3) - 1;

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
            <div className="grid grid-cols-11 grid-rows-1 gap-3 items-start">
                <div className={"flex h-full items-center"}>
                    <button
                        onClick={prevPage}
                        className={`px-4 py-2 rounded-lg col-span-1 ${
                            currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={currentPage === 0}
                    >
                        <FontAwesomeIcon
                            className={"text-blue-500"}
                            icon={faCircleChevronLeft}
                            size={"2xl"}
                        />
                    </button>
                </div>
                {playlists
                    .slice(currentPage * 3, currentPage * 3 + 3)
                    .map((playlist) => (
                        <div
                            key={playlist.id}
                            className="w-full h-64 border border-gray-200 rounded-lg shadow-sm cursor-pointer col-span-3"
                            onClick={() => onPlaylistSelected(playlist.id)}
                        >
                            <div className="relative h-4/5 w-full rounded-t-lg overflow-hidden">
                                <img
                                    src={playlist.images[0]?.url || ""}
                                    alt={playlist.name}
                                    className="w-full h-full object-cover rounded-t-lg"
                                />
                                <AutoSkip accessToken={accessToken} refreshToken={refreshToken} playlistId={playlist.id}/>
                            </div>
                            <h3 className="mt-2 text-sm truncate">{playlist.name}</h3>
                        </div>
                    ))}
                <div className={"flex h-full items-center"}>
                    <button
                        onClick={nextPage}
                        className={`px-4 py-2 rounded-lg col-span-1 ${
                            currentPage === maxPage ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={currentPage === maxPage}
                    >
                        <FontAwesomeIcon
                            className={"text-blue-500"}
                            icon={faCircleChevronRight}
                            size={"2xl"}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistSelect;
