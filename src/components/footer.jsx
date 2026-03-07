import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* Logo e Descrição */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold text-success mb-3">🚀 TrocasConhecimento</h5>
            <p className="text-secondary small">
              A maior plataforma de troca de experiências. Encontre mentores, cursos e 
              ofertas exclusivas organizadas por especialistas reais.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Navegação</h6>
            <ul className="list-unstyled">
              <li><a href="#vitrine" className="text-decoration-none text-secondary small">Ofertas</a></li>
              <li><Link to="/dashboard" className="text-decoration-none text-secondary small">Painel Admin</Link></li>
              <li><Link to="/" className="text-decoration-none text-secondary small">Home</Link></li>
            </ul>
          </div>

          {/* Contato/Suporte */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Suporte</h6>
            <ul className="list-unstyled">
              <li className="text-secondary small">📧 suporte@trocas.com</li>
              <li className="text-secondary small">📍 São Paulo, Brasil</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Siga-nos</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-success h4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-success h4"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-success h4"><i className="bi bi-github"></i></a>
            </div>
          </div>
        </div>

        <hr className="my-4 text-muted" />

        <div className="text-center">
          <p className="text-secondary small mb-0">
            © 2026 <strong>TrocasConhecimento</strong>. Desenvolvido por <strong>Hanan & Bruno -BootCamp Avanti</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;