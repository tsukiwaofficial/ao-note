import { notePlaceholders } from "../placeholders/placeholders.config";
import { getPlaceholder } from "../placeholders/get-placeholder.util";
import { handleKeyDown } from "./note-keydown.util";
import BackBtn from "../../components/buttons/BackBtn";
import { Button } from "../../components/ui/Button";
import { Form } from "../../components/ui/Form";
import AoNoteError from "../../components/AoNoteError";
import { useNoteForm } from "./useNoteForm";

const { title: titlePlaceholder, content: contentPlaceholder } =
  getPlaceholder(notePlaceholders);

export default function NoteForm() {
  const { noteData, error, emptyFields, handleInputChange, handleSubmit } =
    useNoteForm();

  return (
    <Form className={error && "animate-shake"} onSubmit={handleSubmit}>
      <div className="w-full max-w-[90%] h-max">
        <div className="flex flex-col gap-11 cursor-text">
          <textarea
            name="title"
            id="title"
            className={`${emptyFields.includes("title") ? "placeholder:text-error/50 focus:outline-none" : ""} rounded-none border-none focus:outline-none pl-2 bg-transparent text-3xl font-bold text-primary transition-colors`}
            placeholder={`Type here the title of your note. For example, ${titlePlaceholder}`}
            value={noteData.title}
            onChange={handleInputChange}
            onKeyDown={(event) => handleKeyDown(event, handleSubmit)}
            autoFocus
          />
          <textarea
            name="content"
            id="content"
            className={`${emptyFields.includes("content") ? "placeholder:text-error/50 focus:outline-none" : ""} rounded-none border-none focus:outline-none pl-2 bg-transparent min-h-15`}
            placeholder={contentPlaceholder}
            value={noteData.content}
            onChange={handleInputChange}
            onKeyDown={(event) => handleKeyDown(event, handleSubmit)}
          />
        </div>
        <AoNoteError error={error} className="w-max" />
      </div>
      <div className="w-max flex xl:flex-col gap-5">
        <BackBtn />
        <Button type="submit" variant="cta" className="">
          Add
        </Button>
      </div>
    </Form>
  );
}
