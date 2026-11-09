import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import Results from "@/pages/Results";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
