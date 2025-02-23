import {
    CreateUserSettingsAction,
    UpdateUserSettingsAction,
} from "@/actions/user-settings";
import { UserSettingsType } from "@/schemas/userSettings";
import { UserSettings } from "@prisma/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useUpdateUserSettings = (
    options?: Omit<
        UseMutationOptions<UserSettings, Error, UserSettingsType, unknown>,
        "mutationFn"
    >,
) => {
    return useMutation({
        mutationFn: UpdateUserSettingsAction,
        ...options,
    });
};

export const useCreateUserSettings = (
    options?: Omit<
        UseMutationOptions<UserSettings, Error, UserSettingsType, unknown>,
        "mutationFn"
    >,
) => {
    return useMutation({
        mutationFn: CreateUserSettingsAction,
        ...options,
    });
};
