import Login from "./pages/Login";
import Main from "./pages/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrismaContext } from "./context/PrismaContext/PrismaContext";

function App() {
  return (
    <>
      <PrismaContext>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login></Login>} />
            <Route path="/main" element={<Main></Main>} />
          </Routes>
        </BrowserRouter>
      </PrismaContext>
    </>
  );
}

export default App;
