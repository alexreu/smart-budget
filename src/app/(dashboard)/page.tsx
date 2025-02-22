import { CreateTransactionDialog } from "./_components/CreateTransactionDialog";
import { Overview } from "./_components/Overview";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { TransactionTypeEnum } from "@/sdk/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { Minus, Plus } from "lucide-react";

export default async function DashboardPage() {
    const user = await currentUser();

    return (
        <div className="h-full flex flex-col gap-16">
            <div className="flex justify-between items-center h-full bg-background">
                <div className="flex flex-col gap-2">
                    <TypographyH1 className="tracking-wide">
                        Hi, {user?.firstName} 👋🏻
                    </TypographyH1>
                    <TypographyMuted className="tracking-wide">
                        Here&apos;s what happenning with your money. Let&apos;s
                        manage your expense
                    </TypographyMuted>
                </div>

                <div className="flex items-center gap-4">
                    <CreateTransactionDialog
                        trigger={
                            <Button>
                                New Income
                                <Plus className="h-4 w-4" />
                            </Button>
                        }
                        type={TransactionTypeEnum.INCOME}
                    />
                    <CreateTransactionDialog
                        trigger={
                            <Button variant="outline">
                                New Expense
                                <Minus className="h-4 w-4" />
                            </Button>
                        }
                        type={TransactionTypeEnum.EXPENSE}
                    />
                </div>
            </div>
            <Overview userSettings={{}} />
        </div>
    );
}
