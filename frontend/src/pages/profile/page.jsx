import SideBar from "../../components/Profile/SideBar";
import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Sidebar column – sticky on large screens */}
        <div className="col-md-3 col-lg-2">
          <div className="sticky-top" style={{ top: "1rem" }}>
            <SideBar />
          </div>
        </div>

        {/* Main content column – card layout for nested routes */}
        <div className="col-md-9 col-lg-10">
          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;