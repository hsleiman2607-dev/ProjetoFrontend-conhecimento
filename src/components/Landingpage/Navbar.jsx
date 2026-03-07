import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">
          🚀 TrocasConhecimento
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#vitrine">Ofertas</a>
            </li>
           
            <li className="nav-item ms-lg-3">
              {/* Botão de Entrar que redireciona para o Painel Administrativo */}
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-success px-4 fw-bold shadow-sm"
              >
                Entrar
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;