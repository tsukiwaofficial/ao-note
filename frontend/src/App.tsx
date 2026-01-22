import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";

// providers
import NoteProvider from "./features/notes/NoteProvider";

// components
import Header from "./layouts/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <NoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </NoteProvider>
    </BrowserRouter>
  );
};

export default App;
