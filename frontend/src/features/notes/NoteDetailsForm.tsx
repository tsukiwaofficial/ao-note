import { FaTrash, FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { handleKeyDown } from "./note-keydown.util";
import NoteDate from "./NoteDate";
import BackBtn from "../../components/buttons/BackBtn";
import { Form } from "../../components/ui/Form";
import AoNoteError from "../../components/AoNoteError";
import { useNoteDetailsForm } from "./useNoteDetailsForm";
import { useNote, useNoteActions } from "./useNoteStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Button } from "../../components/ui/Button";

export default function NoteDetailsForm({ id }: { id: string }) {
  const {
    noteData,
    navigate,
    error,
    errorFields,
    updateNoteProcess,
    isUpdating,
    setIsUpdating,
    handleUpdateChange,
    cancelUpdateNote,
  } = useNoteDetailsForm(id);
  const { deleteNote } = useNoteActions();
  const note = useNote();

  return (
    <Form className={error && "animate-shake"} onSubmit={updateNoteProcess}>
      <div className="w-full max-w-[90%] h-max">
        <div
          onClick={() => setIsUpdating(true)}
          className="w-full flex flex-col cursor-text"
        >
          {note._id === id ? (
            <>
              {isUpdating ? (
                <textarea
                  name="title"
                  id="update-title"
                  className={`${errorFields.includes("title") && "placeholder:text-error/50 focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent text-3xl font-bold text-primary transition-colors`}
                  placeholder="Title"
                  value={noteData.title}
                  onChange={handleUpdateChange}
                  onKeyDown={(event) => handleKeyDown(event, updateNoteProcess)}
                />
              ) : (
                <h5 className="whitespace-normal pl-2 text-primary">
                  {note.title}
                </h5>
              )}
              <NoteDate
                className="mt-1 mb-10 ml-2"
                createdAt={note.createdAt}
                updatedAt={note.updatedAt}
              />
              <div className=""></div>
              {isUpdating ? (
                <textarea
                  name="content"
                  id="update-content"
                  className={`${errorFields.includes("content") && "placeholder:text-error/50 focus:outline-none"} rounded-none border-none focus:outline-none pl-2 bg-transparent min-h-15 transition-colors`}
                  placeholder="Content"
                  value={noteData.content}
                  onChange={handleUpdateChange}
                  onKeyDown={(event) => handleKeyDown(event, updateNoteProcess)}
                />
              ) : (
                <div className="whitespace-pre-line pl-2">{note.content}</div>
              )}
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <AoNoteError error={error} className="w-max" />
      </div>
      <div className="flex flex-col-reverse items-center justify-between gap-5">
        <div className="flex xl:flex-col">
          <button
            type="button"
            onClick={() => {
              deleteNote(note._id);
              navigate("/");
            }}
            className="rounded-full p-4 hover:bg-error cursor-pointer hover:text-white transition-colors"
          >
            <FaTrash />
          </button>
          {isUpdating ? (
            <Button type="submit" variant="icon" className="hover:bg-primary">
              <FaCheck />
            </Button>
          ) : (
            <Button type="button" variant="icon" className="hover:bg-primary">
              <FaPencil />
            </Button>
          )}
          {isUpdating && (
            <button
              onClick={cancelUpdateNote}
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
