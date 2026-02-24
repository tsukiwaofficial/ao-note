import type { Note } from "./note.types";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { useNoteContext } from "./useNoteContext";
import { Link } from "react-router-dom";
import NoteDate from "./NoteDate";
import { Button } from "../../components/ui/Button";
import { buttonVariants } from "../../shared/config/ui-variants/button-variants.config";
import { useDeleteNote } from "./useDeleteNote";

export default function NoteCard({
  _id,
  title,
  content,
  createdAt,
  updatedAt,
}: Note) {
  const { dispatch } = useNoteContext();
  const { deleteNote } = useDeleteNote();

  return (
    <div className="overflow-hidden w-full max-w-250 shadow bg-surface rounded-lg flex md:flex-col xl:flex-row items-center justify-between hover:-translate-y-1 hover:shadow-lg transition-[shadow_transform]">
      <Link to={`/${_id}`} className="w-full p-8">
        <div className="space-y-8 md:space-y-0 xl:space-y-8 w-full max-w-200">
          <div className="flex flex-col">
            <h5 className="line-clamp-1 text-primary mb-1">{title}</h5>
            <p className="line-clamp-2 md:line-clamp-3 xl:line-clamp-2">
              {content}
            </p>
          </div>
          <NoteDate
            className="md:hidden xl:block"
            createdAt={createdAt}
            updatedAt={updatedAt}
          />
        </div>
      </Link>
      <div className="space-y-1 p-8 md:w-full xl:w-max">
        <NoteDate
          className="hidden md:block xl:hidden"
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
        <div className="h-max flex flex-col md:flex-row-reverse xl:flex-col items-center justify-center md:justify-start">
          <Button
            variant="icon"
            onClick={() => deleteNote(_id, dispatch)}
            className="hover:bg-error"
          >
            <FaTrash />
          </Button>
          <Link
            to={`/${_id}`}
            className={`${buttonVariants({ variant: "icon" })} hover:bg-primary`}
          >
            <FaPencil />
          </Link>
        </div>
      </div>
    </div>
  );
}
