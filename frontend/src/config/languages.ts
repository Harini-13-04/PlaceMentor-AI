import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { Extension } from "@codemirror/state";

export type SupportedLanguage =
  | "c"
  | "csharp"
  | "cpp"
  | "java"
  | "javascript"
  | "typescript"
  | "python"
  | "python3"
  | "sql";

export interface LanguageOption {
  id: SupportedLanguage;
  label: string;
  tag: string;
}

/**
 * The single canonical list of general algorithmic programming languages.
 * Each language appears EXACTLY ONCE with no duplicates or aliases.
 */
export const CANONICAL_LANGUAGES: LanguageOption[] = [
  { id: "c", label: "C", tag: "C" },
  { id: "csharp", label: "C#", tag: "C#" },
  { id: "cpp", label: "C++", tag: "C++" },
  { id: "java", label: "Java", tag: "JAVA" },
  { id: "javascript", label: "JavaScript", tag: "JS" },
  { id: "typescript", label: "TypeScript", tag: "TS" },
  { id: "python", label: "Python", tag: "PY" },
  { id: "python3", label: "Python3", tag: "PY" },
];

/**
 * SQL Language option used conditionally ONLY for Database & SQL problems.
 */
export const SQL_LANGUAGE_OPTION: LanguageOption = {
  id: "sql",
  label: "SQL",
  tag: "SQL",
};

/**
 * Returns the exact language options list for a given problem category/topic.
 * Guarantees no duplicated options.
 */
export function getLanguageOptionsForProblem(isSqlProblem: boolean): LanguageOption[] {
  if (isSqlProblem) {
    return [
      SQL_LANGUAGE_OPTION,
      { id: "python3", label: "Python3", tag: "PY" },
      { id: "javascript", label: "JavaScript", tag: "JS" },
    ];
  }
  return CANONICAL_LANGUAGES;
}

/**
 * Resolves CodeMirror language extension for active language.
 */
export function getLanguageExtension(lang: SupportedLanguage): Extension {
  switch (lang) {
    case "python":
    case "python3":
      return python();
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "java":
    case "csharp":
      return java();
    case "c":
    case "cpp":
      return cpp();
    case "sql":
      return sql();
    default:
      return python();
  }
}

/**
 * Returns tab/indent spacing (2 spaces for JS/TS/SQL, 4 spaces for Python/Java/C++/C/C#).
 */
export function getIndentUnit(lang: SupportedLanguage): number {
  if (lang === "javascript" || lang === "typescript" || lang === "sql") {
    return 2;
  }
  return 4;
}

/**
 * Maps frontend language identifier to backend execution identifier.
 */
export function getBackendLanguageId(lang: SupportedLanguage): string {
  switch (lang) {
    case "csharp":
      return "csharp";
    case "typescript":
      return "typescript";
    case "python3":
      return "python3";
    case "python":
      return "python";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "java":
      return "java";
    case "javascript":
      return "javascript";
    case "sql":
      return "sql";
    default:
      return lang;
  }
}
