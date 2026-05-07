"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { users } from "../../../drizzle/schema";
import { getDB } from "../../lib/db";

type FieldErrors = {
    fullName?: string;
    phone?: string;
};

type ActionResult =
    | { ok: true }
    | { ok: false; fieldErrors?: FieldErrors; formError?: string };

const createUserSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(256, "Full name is too long"),
    phone: z
        .string()
        .trim()
        .min(1, "Phone is required")
        .max(256, "Phone is too long"),
});

const deleteUserSchema = z.object({
    userId: z.number().int().positive(),
});

const formValue = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value : "";

const parseFieldErrors = (issues: z.ZodIssue[]) => {
    const fieldErrors: FieldErrors = {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (field === "fullName" || field === "phone") {
            fieldErrors[field] = issue.message;
        }
    }

    return fieldErrors;
};

export const createUser = async (formData: FormData): Promise<ActionResult> => {
    const payload = {
        fullName: formValue(formData.get("fullName")),
        phone: formValue(formData.get("phone")),
    };

    const parsed = createUserSchema.safeParse(payload);

    if (!parsed.success) {
        return {
            ok: false,
            fieldErrors: parseFieldErrors(parsed.error.issues),
        };
    }

    try {
        const db = await getDB();
        await db.insert(users).values(parsed.data);
        revalidatePath("/");
        return { ok: true };
    } catch (error) {
        return { ok: false, formError: "Failed to create user" };
    }
};

export const deleteUser = async (userId: number): Promise<ActionResult> => {
    const parsed = deleteUserSchema.safeParse({ userId });

    if (!parsed.success) {
        return { ok: false, formError: "Invalid user id" };
    }

    try {
        const db = await getDB();
        await db.delete(users).where(eq(users.id, parsed.data.userId));
        revalidatePath("/");
        return { ok: true };
    } catch (error) {
        return { ok: false, formError: "Failed to delete user" };
    }
};
