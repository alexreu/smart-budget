import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUserSettings() {
    return useQuery<UserSettings>({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const response = await axios.get("/api/user-settings");
            return response.data;
        },
    });
}
