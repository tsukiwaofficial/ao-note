import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddNote from "./pages/AddNote";
import NoteDetails from "./pages/[NoteDetails]";
import Profile from "./pages/[Profile]";

// providers
import NoteProvider from "./features/notes/NoteProvider";

// components
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import BreakpointIndicator from "./components/BreakpointIndicator";
import { CookiesProvider } from "react-cookie";
import UserProvider from "./features/user/UserProvider";

const App = () => {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <UserProvider>
          <NoteProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:id" element={<NoteDetails />} />
              <Route path="/add-note" element={<AddNote />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/users/:id" element={<Profile />} />
            </Routes>
          </NoteProvider>
          <Footer />
        </UserProvider>
      </CookiesProvider>
      <BreakpointIndicator />
    </BrowserRouter>
  );
};

export default App;
