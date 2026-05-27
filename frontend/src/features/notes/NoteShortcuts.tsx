import { Button } from "../../components/ui/Button";

type NoteShortcutType = {
  purpose: "add" | "edit";
  name: string;
  key: string;
  input?: string;
  description: string;
};

const shortcuts: NoteShortcutType[] = [
  {
    purpose: "add",
    name: "Indent",
    key: "Tab",
    description: "Indent the current line.",
  },
  {
    purpose: "add",
    name: "Outdent",
    key: "Shift + Tab",
    description: "Outdent the current line.",
  },
  {
    purpose: "add",
    name: "Line Break",
    key: "Shift + Enter",
    description: "Enter a new line.",
  },
  {
    purpose: "add",
    name: "Quick Insert",
    key: "Ctrl + Tab",
    description: "Insert the placeholder text.",
  },
  {
    purpose: "add",
    name: "Bold",
    key: "Ctrl + B",
    description: "Toggle bold.",
  },
  {
    purpose: "add",
    name: "Italic",
    key: "Ctrl + I",
    description: "Toggle italic.",
  },
  {
    purpose: "add",
    name: "Underline",
    key: "Ctrl + U",
    description: "Toggle underline.",
  },
  {
    purpose: "add",
    name: "Hyperlink",
    key: "Ctrl + K",
    description: "Insert a hyperlink",
  },
  {
    purpose: "add",
    name: "Save",
    key: "Ctrl + S",
    description: "Save the note.",
  },
  {
    purpose: "edit",
    name: "Delete",
    key: "Ctrl + Shift + K",
    description: "Delete the note.",
  },
];

export default function NoteShortcuts({
  purposeParams,
}: {
  purposeParams: "add" | "edit";
}) {
  return (
    <div className="w-[80%] flex flex-wrap gap-x-4 gap-y-3 ">
      {shortcuts
        .filter(({ purpose }) => purpose === purposeParams)
        .map(({ key, description }) => (
          <div className="w-max gap-1 group">
            <Button
              variant="ghost"
              className="group-hover:text-primary group-hover:border-primary group-hover:shadow-lg active:shadow"
            >
              <span className="">{key}</span>
            </Button>{" "}
            <span className="text-sm text-neutral lowercase">
              to {description}
            </span>
          </div>
        ))}
    </div>
  );
}
