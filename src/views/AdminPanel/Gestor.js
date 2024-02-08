import React from "react";
import PropTypes from "prop-types";
import "./AdminPanel.css";

function Gestor(props) {
  return (
    <div className="container text-center">
      <div className="">
        <h1 className="display-6">Gestor</h1>
        <p>Bienvenido Gestor, ¿Que deseas hacer hoy?</p>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Crear usuario</h5>
                <p className="card-text">
                  Crear un nuevo usuario para el sistema.
                </p>
                <a href="#" className="btn btn-primary">
                  Crear
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Editar usuario</h5>
                <p className="card-text">
                  Editar la información de un usuario.
                </p>
                <a href="#" className="btn btn-primary">
                  Editar
                </a>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}

Gestor.propTypes = {};

export default Gestor;
