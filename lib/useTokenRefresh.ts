import { useEffect, useState } from 'react';
import axios from 'axios';
import { isTokenExpired } from './spotify';

export const useTokenRefresh = (initialAccessToken: string, expiresIn: number) => {
    const [token, setToken] = useState(initialAccessToken);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            try {
                if (isTokenExpired(expiresIn)) {
                    const response = await axios.post('/api/refreshToken');
                    const newAccessToken = response.data;

                    setToken(newAccessToken);
                }
            } catch (error) {
                setError(error);
            }
        };

        const intervalId = setInterval(checkAndRefreshToken, 1000 * 60);

        return () => clearInterval(intervalId);
    }, [token]);

    return { token, error };
};
