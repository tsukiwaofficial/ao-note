import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Note from "./features/notes/[Note]";
import NoteForm from "./features/notes/NoteForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// providers
import NoteProvider from "./features/notes/NoteProvider";
import AuthProvider from "./features/user/AuthProvider";

// components
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import BreakpointIndicator from "./components/BreakpointIndicator";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NoteProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Note />} />
            <Route path="/add-note" element={<NoteForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </NoteProvider>
        <Footer />
      </AuthProvider>
      <BreakpointIndicator />
    </BrowserRouter>
  );
};

export default App;
