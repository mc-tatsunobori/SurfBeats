import React, {useState, useEffect} from "react";
import {getUserPlaylists} from "@/lib/spotify";
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleChevronLeft, faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import AutoSkip from "./AutoSkip";
import {HttpError} from "http-errors";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, FreeMode, Thumbs, EffectCoverflow} from "swiper";

interface PlaylistSelectProps {
    accessToken: string;
    refreshToken: string;
    onError: (err: HttpError | null) => void;
}

const PlaylistSelect: React.FC<PlaylistSelectProps> =
    ({
         accessToken,
         refreshToken,
         onError,
     }) => {
        const [playlists, setPlaylists] = useState<PlaylistObjectSimplified[]>([]);
        const [currentPlayingPlaylistId, setCurrentPlayingPlaylistId] = useState<string | null>(null);

        useEffect(() => {
            const fetchPlaylists = async () => {
                try {
                    const userPlaylists = await getUserPlaylists(accessToken);
                    setPlaylists(userPlaylists);
                    onError(null);
                } catch (error: any) {
                    onError(error);
                    console.error("Error fetching playlists", error);
                }
            };

            if (accessToken) {
                fetchPlaylists();
            }
        }, [accessToken]);

        return (
            <div className={"mx-auto w-5/6"}>
                <Swiper
                    modules={[Navigation, FreeMode, Thumbs, EffectCoverflow]}
                    spaceBetween={30}
                    slidesPerView={3}
                    loop={true}
                    freeMode={true}
                    effect={"coverflow"}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    navigation={{
                        nextEl: ".custom-swiper-button-next",
                        prevEl: ".custom-swiper-button-prev",
                    }}
                    className="relative"
                >
                    {playlists.map((playlist) => (
                        <SwiperSlide key={playlist.id}>
                            <div
                                className="w-full h-64 border border-gray-200 rounded-lg shadow-sm cursor-pointer col-span-3"
                                onClick={() => {
                                    setCurrentPlayingPlaylistId(playlist.id);
                                }}
                            >
                                <div className="relative h-4/5 w-full rounded-t-lg overflow-hidden">
                                    <img
                                        src={playlist.images[0]?.url || ""}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover rounded-t-lg"
                                    />
                                    <AutoSkip
                                        accessToken={accessToken}
                                        refreshToken={refreshToken}
                                        playlistId={playlist.id}
                                        onError={onError}
                                        currentlyPlayingPlaylistId={currentPlayingPlaylistId}
                                    />

                                </div>
                                <h3 className="mt-2 ml-2 font-bold text-sm truncate text-sb-dark-blue">{playlist.name}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className={"custom-swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10"}>
                        <FontAwesomeIcon
                            className={"text-sb-dark-blue"}
                            icon={faCircleChevronRight}
                            size={"2xl"}
                        />
                    </div>
                    <div className={"custom-swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10"}>
                        <FontAwesomeIcon
                            className={"text-sb-dark-blue"}
                            icon={faCircleChevronLeft}
                            size={"2xl"}
                        />
                    </div>
                </Swiper>
            </div>
        );
    };

export default PlaylistSelect;
