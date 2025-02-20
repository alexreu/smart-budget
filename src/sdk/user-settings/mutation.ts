import { UpdateUserSettingsAction } from "@/actions/user-settings";
import { UserSettings } from "@prisma/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useUpdateUserSettings = (
    options?: Omit<
        UseMutationOptions<UserSettings, Error, string, unknown>,
        "mutationFn"
    >,
) => {
    return useMutation({
        mutationFn: UpdateUserSettingsAction,
        ...options,
    });
};
