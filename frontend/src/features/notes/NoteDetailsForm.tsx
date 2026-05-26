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
    <Form onSubmit={updateNoteProcess}>
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
                  className={`${errorFields.includes("title") && error && "placeholder:text-error/50 focus:outline-none animate-shake"} rounded-none border-none focus:outline-none pl-2 bg-transparent text-3xl font-bold text-primary transition-colors`}
                  placeholder="Title"
                  value={noteData.title}
                  onChange={handleUpdateChange}
                  onKeyDown={(event) => handleKeyDown(event, updateNoteProcess)}
                  autoFocus
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
                  className={`${errorFields.includes("content") && error && "placeholder:text-error/50 focus:outline-none animate-shake"} rounded-none border-none focus:outline-none pl-2 bg-transparent min-h-15 transition-colors`}
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
          <Button
            type="button"
            variant="icon"
            onClick={() => {
              deleteNote(note._id);
              navigate("/");
            }}
            className="hover:bg-error"
          >
            <FaTrash />
          </Button>
          <Button
            type="submit"
            variant="icon"
            className={`hover:bg-primary ${!isUpdating ? "hidden" : "block"}`}
          >
            <FaCheck />
          </Button>
          <Button
            type="button"
            variant="icon"
            onClick={() => setIsUpdating(true)}
            className={`hover:bg-primary ${isUpdating ? "hidden" : "block"}`}
          >
            <FaPencil />
          </Button>
          <Button
            type="button"
            variant="icon"
            onClick={cancelUpdateNote}
            className={`hover:bg-error ${!isUpdating ? "hidden" : "block"}`}
          >
            <FaXmark />
          </Button>
        </div>
        <BackBtn />
      </div>
    </Form>
  );
}
