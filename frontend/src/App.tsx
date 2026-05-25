import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

// stores
import {
  useUserAuthActions,
  useUserAuthRole,
  useUserAuthToken,
} from "./features/user/useUserAuthStore";
import {
  useUserDetailsActions,
  useUserDetailsAvatar,
  useUserDetailsDisplayName,
} from "./features/user/useUserDetailsStore";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddNote from "./pages/AddNote";
import NoteDetails from "./pages/[NoteDetails]";
import Profile from "./pages/[Profile]";

// components
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import BreakpointIndicator from "./components/BreakpointIndicator";

const App = () => {
  const [cookies] = useCookies(["isLoggedIn"]);
  const role = useUserAuthRole();
  const token = useUserAuthToken();
  const { initializeUserAuth, refreshUserAuth } = useUserAuthActions();
  const avatar = useUserDetailsAvatar();
  const displayName = useUserDetailsDisplayName();
  const { getUserDetails } = useUserDetailsActions();

  useEffect(() => {
    initializeUserAuth(cookies.isLoggedIn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.isLoggedIn]);

  useEffect(() => {
    refreshUserAuth(token, cookies.isLoggedIn);
  }, [cookies.isLoggedIn, refreshUserAuth, token]);

  useEffect(() => {
    getUserDetails(cookies.isLoggedIn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, displayName, role, cookies.isLoggedIn]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<NoteDetails />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users/:id" element={<Profile />} />
      </Routes>
      <Footer />
      <BreakpointIndicator />
    </BrowserRouter>
  );
};

export default App;
