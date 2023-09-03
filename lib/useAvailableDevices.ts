// lib/useAvailableDevices.ts
import { useState, useEffect } from "react";
import { getAvailableDevices } from "./spotify";

export const useAvailableDevices = (accessToken: string) => {
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(false);

    useEffect(() => {
        const checkDevices = async () => {
            try {
                const devices = await getAvailableDevices(accessToken);
                setIsDeviceAvailable(devices.length > 0);
            } catch (error) {
                console.error("Error fetching available devices", error);
            }
        };

        checkDevices();
    }, [accessToken]);

    return isDeviceAvailable;
};
