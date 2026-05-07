"use client";

import { useState, useTransition } from "react";

import { deleteUser } from "./actions/user-actions";

type User = {
    id: number;
    fullName: string | null;
    phone: string | null;
};

type UsersTableProps = {
    users: User[];
};

export default function UsersTable({ users }: UsersTableProps) {
    const [isPending, startTransition] = useTransition();
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [actionError, setActionError] = useState("");

    const handleDelete = (userId: number) => {
        setActionError("");
        setPendingId(userId);
        startTransition(async () => {
            const result = await deleteUser(userId);

            if (!result.ok) {
                setActionError(result.formError ?? "Failed to delete user");
            }

            setPendingId(null);
        });
    };

    if (users.length === 0) {
        return <p>No users yet.</p>;
    }

    return (
        <div className="space-y-3">
            {actionError ? (
                <p className="text-sm text-red-600">{actionError}</p>
            ) : null}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 pr-4 text-sm font-semibold">
                                Name
                            </th>
                            <th className="py-2 pr-4 text-sm font-semibold">
                                Phone
                            </th>
                            <th className="py-2 text-sm font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b last:border-b-0"
                            >
                                <td className="py-2 pr-4">
                                    {user.fullName ?? "(No name)"}
                                </td>
                                <td className="py-2 pr-4">
                                    {user.phone ?? "(No phone)"}
                                </td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="rounded border border-red-500 px-3 py-1 text-sm text-red-600 transition disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={
                                            isPending && pendingId === user.id
                                        }
                                        aria-busy={
                                            isPending && pendingId === user.id
                                        }
                                    >
                                        {isPending && pendingId === user.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
