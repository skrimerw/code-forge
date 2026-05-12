"use client";

import { useTheme } from "@/contexts/useTheme";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function ToastWrapper() {
    const { theme } = useTheme();
    return (
        <ToastContainer
            position="top-center"
            draggable={true}
            stacked={true}
            autoClose={2000}
            limit={1}
            theme={theme}
        />
    );
}
