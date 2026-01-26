import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Note from "./features/notes/[Note]";

// providers
import NoteProvider from "./features/notes/NoteProvider";

// components
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <NoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Note />} />
        </Routes>
      </NoteProvider>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
