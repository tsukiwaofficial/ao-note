import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Note from "./features/notes/[Note]";
import NoteForm from "./features/notes/NoteForm";

// providers
import NoteProvider from "./features/notes/NoteProvider";

// components
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import BreakpointIndicator from "./components/BreakpointIndicator";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <NoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Note />} />
          <Route path="/add-note" element={<NoteForm />} />
        </Routes>
      </NoteProvider>
      <Footer />
      <BreakpointIndicator />
    </BrowserRouter>
  );
};

export default App;
