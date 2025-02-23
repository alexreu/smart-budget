import { GetUserSettingsAction } from "@/actions/user-settings";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useUserSettings() {
    return useQuery<UserSettings | null>({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const userSettings = await GetUserSettingsAction();
            return userSettings;
        },
    });
}
