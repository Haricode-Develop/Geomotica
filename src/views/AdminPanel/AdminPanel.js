import React, { useState } from "react";
import "./AdminPanel.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Gestor from "./Gestor";
import Analista from "./Analista";
import Admin from "./Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import profilePicture from "./img/user.png";
import Sidebar from "../../components/LayoutSide";

function AdminPanel(props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const permisos = sessionStorage.getItem("rol");
  console.log(permisos);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log(userData);
  for (var clave in userData) {
    if (userData.hasOwnProperty(clave) && typeof userData[clave] === "string") {
      console.log(typeof userData[clave]);
      userData[clave] = userData[clave].replace(/^"|"$/g, ""); // Eliminar comillas del inicio y del final
    }
  }
  const menuItems = [
    "Dashboard",
    "Administrador",
    "Configuración",
    "Ayuda",
    "Salir",
  ];
  return (
    <div>
      <Sidebar
        profileImage={profilePicture}
        name={userData.NOMBRE}
        apellido={userData.APELLIDO}
        menuItems={menuItems}
        isOpen={sidebarOpen} //
        setIsOpen={setSidebarOpen}
      />
      <div className="container text-center">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-1">Admin Panel</h1>
          </div>
        </div>
        {permisos === "1" ? (
          <Gestor />
        ) : permisos === "2" ? (
          <Admin />
        ) : permisos === "4" ? (
          <Analista />
        ) : (
          <div>No tienes permisos</div>
        )}
      </div>
    </div>
  );
}

AdminPanel.propTypes = {};

export default AdminPanel;
