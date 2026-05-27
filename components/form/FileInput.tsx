"use client";

import React, { useEffect, useId, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useFormContext } from "react-hook-form";

interface Props extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "defaultValue"
> {
    name: string;
    description: string;
    required?: boolean;
    label?: string;
    accept?: string;
    defaultValue?: string | null;
    className?: string;
}

export default function FileInput({
    required,
    label,
    description,
    accept,
    name,
    className,
    defaultValue,
    ...props
}: Props) {
    const id = useId();
    const form = useFormContext();
    const [isImage, setIsImage] = useState(defaultValue ? true : false);
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState(defaultValue || "");
    const [receivedFileName, setReceivedFileName] = useState("");

    const errorMsg = form.formState.errors[name]?.message as string;

    const fileWatcher = form.watch(name);

    useEffect(() => {
        const url = new URL("https://art.com" + fileWatcher);
        const fullFileName = url.pathname.split("/").at(-1);
        const ext = fullFileName?.split(".").at(-1);

        if (
            [
                "svg",
                "png",
                "jpg",
                "jpeg",
                "gif",
                "webp",
                "avif",
                "bmp",
            ].includes(ext || "")
        ) {
            setIsImage(true);
        }

        setReceivedFileName(decodeURI(fullFileName || ""));
        setFileUrl(fileWatcher);
    }, []);

    function removeFile(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setFileUrl("");
        setIsImage(false);
        setFile(null);
        form.setValue(name, "", { shouldValidate: true });
    }

    async function onFileChange(
        e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    ) {
        const target = e.target;
        const files = target.files;

        if (!files) return;

        const file = files[0];

        if (file === undefined) return;

        let dataUrl;

        try {
            dataUrl = URL.createObjectURL(file);

            if (typeof dataUrl === "string") {
                if (file.type.startsWith("image/")) {
                    setIsImage(true);
                }
                setFileUrl(dataUrl);
            }
        } catch (e) {
            toast.error("Не удалось загрузить файл");
        }

        setFile(file);

        form.setValue(name, file, { shouldValidate: true });
    }

    function onLabelClick(e: React.MouseEvent<HTMLLabelElement, MouseEvent>) {
        if (fileUrl !== "") e.preventDefault();
    }

    return (
        <div className={cn("max-w-[300px]", className)}>
            <Label htmlFor={id} className="flex gap-px mb-1.5 text-base">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            <Label
                onClick={onLabelClick}
                className={cn(
                    "shadow-xs group block border border-input border-dashed rounded-md hover:border-primary-from  h-[150px] transition-colors duration-300 cursor-pointer overflow-hidden",
                    file && !isImage && "h-fit",
                    errorMsg &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200 hover:border-red-500",
                )}
            >
                {file === null && fileUrl === "" ? (
                    <div className="relative flex flex-col items-center justify-center gap-2 w-full p-4 group-active:bg-primary-from/5 h-full bg-bg-2">
                        <Plus size={54} strokeWidth={1.3} />
                        {description && (
                            <p className="text-center text-typography-secondary select-none">
                                {description}
                            </p>
                        )}
                    </div>
                ) : isImage ? (
                    <div className="relative flex justify-center size-full bg-bg-2">
                        <img src={fileUrl} className="object-contain" />
                        <button
                            type="button"
                            className="opacity-100 lg:opacity-0 group-hover:opacity-100 absolute top-1 right-1 shadow-none p-1.5 rounded-full bg-black/40 h-fit text-white group-hover:bg-black/40 cursor-pointer hover:bg-black/60 transition-all duration-300 active:translate-y-[1px]"
                            onClick={removeFile}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between gap-1 items-center p-1 pl-3 bg-white shadow-sm">
                        <p className="wrap-break-word overflow-hidden">
                            {file ? file.name : receivedFileName}
                        </p>
                        <Button
                            variant={"ghost"}
                            className="shadow-none p-1.5 rounded-sm h-fit"
                            onClick={removeFile}
                        >
                            <X />
                        </Button>
                    </div>
                )}
                <Input
                    id={id}
                    type="file"
                    accept={accept}
                    className="hidden"
                    {...form.register(name)}
                    onChange={onFileChange}
                    {...props}
                />
            </Label>
            {errorMsg && (
                <span className="block text-red-400 text-sm mt-1">
                    {errorMsg}
                </span>
            )}
        </div>
    );
}
