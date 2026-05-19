"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Bold,
    Essentials,
    Heading,
    Italic,
    Paragraph,
    Alignment,
    List,
    Link,
    Table,
    ImageToolbar,
    Image,
    TableToolbar,
    ImageInsert,
    AutoImage,
    ImageUpload,
    ImageCaption,
    ImageResize,
    ImageStyle,
    Base64UploadAdapter,
    PictureEditing,
    TableColumnResize,
    Underline,
    Strikethrough,
    Superscript,
    Subscript,
    WatchdogConfig,
    EditorConfig,
    EventInfo,
    CodeBlock,
    BlockQuote,
    Code,
    MediaEmbed,
} from "ckeditor5";
import React, { useRef } from "react";
import translations from "ckeditor5/translations/ru.js";

import "ckeditor5/ckeditor5.css";

interface ErrorDetails {
    phase: "initialization" | "runtime";
    willEditorRestart?: boolean;
}

export type CKEditorConfigContextMetadata = {
    /**
     * The name of the editor in the React context. It'll be later used in the `useInitializedCKEditorsMap` hook
     * to track the editor initialization and destruction events.
     */
    name?: string;
    /**
     * Any additional metadata that can be stored in the context.
     */
    [x: string | number | symbol]: unknown;
};

export interface EditorProps {
    initialData?: string;
    contextItemMetadata?: CKEditorConfigContextMetadata;
    config?: EditorConfig;
    watchdogConfig?: WatchdogConfig;
    disableWatchdog?: boolean;
    onReady?: (editor: ClassicEditor) => void;
    onAfterDestroy?: (editor: ClassicEditor) => void;
    onError?: (error: Error, details: ErrorDetails) => void;
    onChange?: (event: EventInfo, editor: ClassicEditor) => void;
    onFocus?: (event: EventInfo, editor: ClassicEditor) => void;
    onBlur?: (event: EventInfo, editor: ClassicEditor) => void;
    data?: string;
    disabled?: boolean;
    id?: any;
}

export default function Editor({ ...props }: EditorProps) {
    const editor = useRef<CKEditor<ClassicEditor>>(null);
    return (
        <>
            <CKEditor
                ref={editor}
                editor={ClassicEditor}
                config={{
                    initialData: props.initialData || "",
                    language: "ru",
                    licenseKey: "GPL",
                    plugins: [
                        Essentials,
                        Paragraph,
                        Heading,
                        Bold,
                        Italic,
                        Underline,
                        Strikethrough,
                        Superscript,
                        Subscript,
                        Alignment,
                        List,
                        Link,
                        Table,
                        TableToolbar,
                        TableColumnResize,
                        AutoImage,
                        Image,
                        ImageCaption,
                        ImageInsert,
                        ImageResize,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
                        PictureEditing,
                        CodeBlock,
                        Code,
                        BlockQuote,
                        MediaEmbed,
                    ],
                    toolbar: [
                        "undo",
                        "redo",
                        "|",
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "link",
                        "|",
                        "superscript",
                        "subscript",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "alignment",
                        "|",
                        "insertTable",
                        "|",
                        "insertImage",
                        "mediaEmbed",
                        "codeBlock",
                        "code",
                        "blockQuote",
                    ],
                    translations,
                    table: {
                        contentToolbar: [
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                            "tableColumnResize",
                        ],
                    },
                    image: {
                        resizeOptions: [
                            {
                                name: "resizeImage:original",
                                label: "Ширина по умолчанию",
                                value: null,
                            },
                            {
                                name: "resizeImage:50",
                                label: "50% от ширины страницы",
                                value: "50",
                            },
                            {
                                name: "resizeImage:75",
                                label: "75% от ширины страницы",
                                value: "75",
                            },
                        ],
                        toolbar: [
                            "imageTextAlternative",
                            "toggleImageCaption",
                            "|",
                            "imageStyle:inline",
                            "imageStyle:wrapText",
                            "imageStyle:breakText",
                            "|",
                            "resizeImage",
                        ],
                        insert: {
                            integrations: ["upload", "url"],
                        },
                    },
                }}
                {...props}
            />
        </>
    );
}
