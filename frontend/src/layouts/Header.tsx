import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <div className="fixed z-1000 max-h-17.5 h-full w-full bg-surface/50 backdrop-blur shadow-lg"></div>
      <header className="fixed z-1000 fixed-center ao-note-container max-h-17.5 h-full w-full py-2 flex items-center justify-between">
        <Link to="/">
          <h5>Ao Note</h5>
        </Link>
        <div className=""></div>
      </header>
    </>
  );
}
