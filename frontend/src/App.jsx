import { Routes, Route } from 'react-router-dom';
import Home from '../src/pages/home/home';
import UserProfile from '../src/pages/profile/user_profile';
import Camera from '../src/pages/camera/camera'
import CameraPost from "../src/pages/camera_post/camera_post";
import StrangerProfile from '../src/pages/stranger_profile/stranger_profile';
import Notification from '../src/pages/notification/notification';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/camera-post" element={<CameraPost />} />
      <Route path="/stranger_profile/:id" element={<StrangerProfile />} />  
      <Route path="/notification" element={<Notification />} />
      </Routes>
  );
}

export default App;