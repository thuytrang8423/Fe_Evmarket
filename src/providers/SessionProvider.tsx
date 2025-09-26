"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { I18nProvider } from "./I18nProvider";

export default function AppSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <I18nProvider>{children}</I18nProvider>
        </SessionProvider>
    );
}
