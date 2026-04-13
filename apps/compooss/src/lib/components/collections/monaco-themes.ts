import type { BeforeMount } from "@monaco-editor/react";

// Colours derived from the app's CSS variables (HSL → hex).
// Dark:  card=hsl(200,10%,15%) bg=hsl(200,10%,12%) fg=hsl(200,10%,90%)
//        json-key=hsl(200,60%,65%) json-string=hsl(145,50%,55%)
//        json-number=hsl(30,80%,60%) json-boolean=hsl(280,60%,65%)
//        json-null=hsl(0,50%,60%)  muted-fg=hsl(200,8%,55%)
// Light: card=hsl(0,0%,100%) bg=hsl(200,20%,98%) fg=hsl(200,15%,10%)
//        json-key=hsl(200,60%,35%) json-string=hsl(145,50%,30%)
//        json-number=hsl(30,80%,35%) json-boolean=hsl(280,60%,45%)
//        json-null=hsl(0,50%,42%)  muted-fg=hsl(200,8%,42%)
export const defineMonacoThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("compooss-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "string.key.json",   foreground: "70b8db" },
      { token: "string.value.json", foreground: "53c683" },
      { token: "number",            foreground: "eb9947" },
      { token: "keyword.json",      foreground: "b870db" },
      { token: "delimiter.bracket", foreground: "838f95" },
      { token: "delimiter",         foreground: "838f95" },
    ],
    colors: {
      "editor.background":                 "#22282a",
      "editor.foreground":                 "#e3e6e8",
      "editorGutter.background":           "#1c2022",
      "editorLineNumber.foreground":       "#838f95",
      "editorLineNumber.activeForeground": "#b0bec5",
      "editor.selectionBackground":        "#2e353880",
      "editor.lineHighlightBackground":    "#252a2d",
      "editorCursor.foreground":           "#53c683",
      "editor.inactiveSelectionBackground":"#2e353840",
    },
  });

  monaco.editor.defineTheme("compooss-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "string.key.json",   foreground: "246b8f" },
      { token: "string.value.json", foreground: "267346" },
      { token: "number",            foreground: "a15912" },
      { token: "keyword.json",      foreground: "8a2eb8" },
      { token: "delimiter.bracket", foreground: "636e74" },
      { token: "delimiter",         foreground: "636e74" },
    ],
    colors: {
      "editor.background":                 "#ffffff",
      "editor.foreground":                 "#161b1d",
      "editorGutter.background":           "#f5f9fa",
      "editorLineNumber.foreground":       "#636e74",
      "editorLineNumber.activeForeground": "#161b1d",
      "editor.selectionBackground":        "#e8ecee",
      "editor.lineHighlightBackground":    "#eef4f5",
      "editorCursor.foreground":           "#267346",
      "editor.inactiveSelectionBackground":"#e8ecee80",
    },
  });
};
