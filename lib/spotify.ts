import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});


export const getUserPlaylists = async (accessToken: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        const data = await spotifyApi.getUserPlaylists();
        return data.body.items;
    } catch (error) {
        console.error("Error getting user playlists", error);
        throw error;
    }
};

export const skipTrack = async (accessToken: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.skipToNext();
    } catch (error) {
        console.error("Error skipping track", error);
        throw error;
    }
};

export const pausePlayback = async (accessToken: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.pause();
    } catch (error) {
        console.error("Error pausing playback", error);
        throw error;
    }
};

export const playPlaylist = async (accessToken: string, playlistId: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.play({ context_uri: `spotify:playlist:${playlistId}` });
    } catch (error) {
        console.error("Error playing playlist", error);
        throw error;
    }
};

export const getAccessToken = async (code: string) => {
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token, expires_in } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        return { access_token, refresh_token, expires_in };
    } catch (error) {
        console.error("Error getting access token", error);
        throw error;
    }
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        spotifyApi.setRefreshToken(refreshToken);
        const data = await spotifyApi.refreshAccessToken();
        const { access_token, expires_in } = data.body;
        spotifyApi.setAccessToken(access_token);

        return { access_token, expires_in };
    } catch (error) {
        console.error("Error refreshing access token", error);
        throw error;
    }
};

export function isTokenExpired(expiresIn: number): boolean {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        return expiresIn < currentTime;
    } catch (error) {
        console.error("Error checking token expiration", error);
        return true;
    }
}

export const getCurrentPlayback = async (accessToken: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        const data = await spotifyApi.getMyCurrentPlaybackState();


        if(data.statusCode !== 200){
            return null;
        }

        const item = data.body.item as SpotifyApi.TrackObjectFull;
        return {
            title: item.name,
            artist: item.artists[0].name,
            cover: item.album.images[0].url,
        };
    } catch (error) {
        console.error("Error getting current playback", error);
        throw error;
    }
};

export const getAvailableDevices = async (accessToken: string) => {
    try {
        spotifyApi.setAccessToken(accessToken);
        const data = await spotifyApi.getMyDevices();
        return data.body.devices;
    } catch (error) {
        console.error('Error getting available devices', error);
        throw error;
    }
};

