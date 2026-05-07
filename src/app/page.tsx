export const dynamic = "force-dynamic";

import Link from "next/link";
import { getDB } from "../..";
import { users } from "../../drizzle/schema";
import UsersTable from "./users-table";

export default async function Home() {
    const db = await getDB();
    const allUsers = await db.select().from(users);

    console.log(allUsers);

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <p className="text-sm text-gray-500">
                        Manage stored users.
                    </p>
                </div>
                <Link
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-gray-400"
                    href="/create"
                >
                    Create user
                </Link>
            </header>
            <UsersTable users={allUsers} />
        </main>
    );
}
