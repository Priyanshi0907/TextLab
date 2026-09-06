import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TextProcessor from "./pages/TextProcessor";
import ClassifyText from "./pages/ClassifyText";
import BatchAnalysis from "./pages/BatchAnalysis";
import ModelPerformance from "./pages/ModelPerformance";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

function WorkspaceLayout() {
  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="flex-1 p-8 max-w-[1400px]">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route element={<WorkspaceLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/text-processor" element={<TextProcessor />} />
          <Route path="/classify-text" element={<ClassifyText />} />
          <Route path="/batch-analysis" element={<BatchAnalysis />} />
          <Route path="/model-performance" element={<ModelPerformance />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
