import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages";
import KanbanBoard from "./components/kanban/KanbanBoard";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/kanban" element={<KanbanBoard />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
