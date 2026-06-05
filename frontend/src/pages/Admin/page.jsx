import { Outlet } from "react-router-dom";
import AdminSideBar from "../../components/AdminComponents/Sidebar/SideBar";

const AdminDashboard = () => {
  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        {/* Sidebar – fixed on desktop, collapses on mobile */}
        <div
          className="col-md-3 col-lg-2"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <AdminSideBar />
        </div>

        {/* Main content – scrollable */}
        <div
          className="col-md-9 col-lg-10"
          style={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;