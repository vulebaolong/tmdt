import { Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

export function useRichTextEditor(initialContent?: string) {
   const [content, setContent] = useState(initialContent || "");
   const editor = useEditor({
      extensions: [StarterKit, Underline, Link, Superscript, Subscript, Highlight, TextAlign.configure({ types: ["heading", "paragraph"] })],
      content,
   });

   useEffect(() => {
      if (editor && content) {
         editor.commands.setContent(content);
      }
   }, [editor, content]);

   return { editor, setContent };
}