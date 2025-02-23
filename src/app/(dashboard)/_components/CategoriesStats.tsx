"use client";

import { UserSettings } from "@prisma/client";

type CategoriesStatsProps = {
    userSettings: UserSettings;
    from: Date;
    to: Date;
};

export const CategoriesStats = ({
    userSettings,
    from,
    to,
}: CategoriesStatsProps) => {
    return (
        <div>
            <h1>Categories Stats</h1>
        </div>
    );
};
