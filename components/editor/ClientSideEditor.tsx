"use client";

import { EditorProps } from "@/components/editor/Editor";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export default function ClientSideCustomEditor({ ...props }: EditorProps) {
  return <Editor {...props} />;
}
