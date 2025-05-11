import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import NotificationsTest from "./pages/Notifications-test";
import BooksList from "./pages/BooksList";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import LiveAudioStreaming from "./pages/Streamer";
import AvailableStreams from "./pages/AvailableStreams";
import StartStream from "./pages/StartStream";
import AboutUs from "./pages/AboutUs";
import DownloadsPage from "./pages/Downloads";
import Footer from "./components/Footer";
import CategoryBooks from './pages/CategoryBooks'; 
import Subscription from "./pages/Subscription";
import SubscribeForm from "./pages/SubscribeForm";
import {io} from 'socket.io-client';    
import  { useEffect, useState } from 'react';

const subscribeTo = ['ahmed','mohamed','ali nashaat']
const App = () => {
    const [socket,setSocket] = useState(null)
    useEffect(()=>{
        if(!socket){
            setSocket(io("http://localhost:4000"))
        }
    },[socket])

    useEffect(() => {
        if(!socket) return;
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            const token = sessionStorage.getItem("access_token");
            if (token) {
                const [header, payload, signature] = token.split('.');
                const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                socket.emit('STARTED',subscribeTo,decodedPayload.email)
            }
        });
        socket.on('RECEIVE',(message)=>{
          console.log(`${message} was added...Check it out!`)
          alert(`${message} was added...Check it out!`)
        })
    },[socket]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/notifications" element={<NotificationsTest />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stream/:roomId" element={<LiveAudioStreaming />} />
        <Route path="/streams" element={<AvailableStreams />} />
        <Route path="/start-stream" element={<StartStream />} />
        <Route path="/category/:categoryName" element={<CategoryBooks />} />
        <Route path="/about-us" element={<AboutUs />} />        
        <Route path="/downloads" element={<DownloadsPage />} />        
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscribe-form" element={<SubscribeForm />} />

      </Routes>
      <Footer />
    </Router>
    
  );
};

export default App;
