import { FaTrash, FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { handleKeyDown } from "./note-keydown.util";
import NoteDate from "./NoteDate";
import BackBtn from "../../components/buttons/BackBtn";
import { Form } from "../../components/ui/Form";
import AoNoteError from "../../components/AoNoteError";
import { useNoteDetailsForm } from "./useNoteDetailsForm";

export default function NoteDetailsForm({ id }: { id: string }) {
  const {
    noteData,
    dispatch,
    navigate,
    error,
    emptyFields,
    updateNote,
    isUpdating,
    setIsUpdating,
    handleUpdateChange,
    deleteNote,
    cancelUpdateNote,
  } = useNoteDetailsForm(id);

  return (
    <Form className={error && "animate-shake"} onSubmit={updateNote}>
      <div className="w-full max-w-[90%] h-max">
        <div
          onClick={() => setIsUpdating(true)}
          className="w-full flex flex-col cursor-text"
        >
          {isUpdating ? (
            <textarea
              name="title"
              id="update-title"
              className={`${emptyFields.includes("title") && "placeholder:text-error/50 focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent text-3xl font-bold text-primary transition-colors`}
              placeholder="Title"
              value={noteData.title}
              onChange={handleUpdateChange}
              onKeyDown={(event) => handleKeyDown(event, updateNote)}
            />
          ) : (
            <h5 className="whitespace-normal pl-2 text-primary">
              {noteData.title}
            </h5>
          )}
          <NoteDate
            className="mt-1 mb-10 ml-2"
            createdAt={noteData.createdAt}
            updatedAt={noteData.updatedAt}
          />
          <div className=""></div>
          {isUpdating ? (
            <textarea
              name="content"
              id="update-content"
              className={`${emptyFields.includes("content") && "placeholder:text-error/50 focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent min-h-15 transition-colors`}
              placeholder="Content"
              value={noteData.content}
              onChange={handleUpdateChange}
              onKeyDown={(event) => handleKeyDown(event, updateNote)}
            />
          ) : (
            <div className="whitespace-pre-line pl-2">{noteData.content}</div>
          )}
        </div>
        <AoNoteError error={error} className="w-max" />
      </div>
      <div className="flex flex-col-reverse items-center justify-between gap-5">
        <div className="flex xl:flex-col">
          <button
            type="button"
            onClick={() => {
              deleteNote(noteData._id, dispatch);
              navigate("/");
            }}
            className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
          >
            <FaTrash />
          </button>
          <button
            type="submit"
            className="rounded-full p-4 hover:bg-primary cursor-pointer hover:text-white transition-colors"
          >
            {isUpdating ? <FaCheck /> : <FaPencil />}
          </button>
          {isUpdating && (
            <button
              onClick={() => cancelUpdateNote(id)}
              className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
            >
              <FaXmark />
            </button>
          )}
        </div>
        <BackBtn />
      </div>
    </Form>
  );
}
