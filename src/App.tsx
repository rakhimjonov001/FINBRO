import { Route, Routes } from "react-router";
import Layout from "./components/pages/Layouts/Layout";
import Page from "./components/custom/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Page />} />
      </Route>
    </Routes>
  );
}

export default App;
