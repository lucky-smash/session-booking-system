import { useState , useEffect } from 'react'
import { socket } from './socket'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Experts from "./pages/Experts.jsx";
import ExpertDetails from "./pages/ExpertDetails.jsx";
import BookSlot from "./pages/BookSlot.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Layout from "./components/layout.jsx";

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ connected to socket:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected");
  });

  return () => {
    socket.off("connect");
    socket.off("disconnect");
  };
}, []);
  return (
    <>
    
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<Experts />} />
        <Route path="/experts/:id" element={<ExpertDetails />} />
        <Route path="/book/:expertId" element={<BookSlot />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      </Layout>
    </Router>

    </>
  )
}

export default App
