"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createUser } from "../actions/user-actions";

type FieldErrors = {
    fullName?: string;
    phone?: string;
};

export default function CreatePage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFieldErrors({});
        setFormError("");

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await createUser(formData);

            if (result.ok) {
                router.push("/");
                return;
            }

            setFieldErrors(result.fieldErrors ?? {});
            setFormError(result.formError ?? "");
        });
    };

    return (
        <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-10">
            <div className="space-y-2">
                <p className="text-sm text-gray-500">
                    <Link
                        className="hover:underline"
                        href="/"
                    >
                        Back to home
                    </Link>
                </p>
                <h1 className="text-2xl font-semibold">Create user</h1>
                <p className="text-sm text-gray-500">
                    Add a new user to the database.
                </p>
            </div>

            <form
                className="space-y-5"
                onSubmit={handleSubmit}
            >
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="fullName"
                    >
                        Full name
                    </label>
                    <input
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        id="fullName"
                        name="fullName"
                        required
                        type="text"
                    />
                    {fieldErrors.fullName ? (
                        <p className="text-sm text-red-600">
                            {fieldErrors.fullName}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="phone"
                    >
                        Phone
                    </label>
                    <input
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        id="phone"
                        name="phone"
                        required
                        type="text"
                    />
                    {fieldErrors.phone ? (
                        <p className="text-sm text-red-600">
                            {fieldErrors.phone}
                        </p>
                    ) : null}
                </div>

                {formError ? (
                    <p className="text-sm text-red-600">{formError}</p>
                ) : null}

                <button
                    className="inline-flex items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? "Saving..." : "Create user"}
                </button>
            </form>
        </main>
    );
}
