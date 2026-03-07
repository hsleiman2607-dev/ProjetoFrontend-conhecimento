import { Rocket, Target, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import CardOferta from '../components/CardOferta';
import Navbar from '../components/Landingpage/Navbar';
import Footer from '../components/footer';



//const API_URL = "http://localhost:8080";

function LandingPage() {
  const [ofertas, setOfertas] = useState([]);

  // 2. BUSCAR DADOS DA API
  useEffect(() => {
    const carregarOfertas = async () => {
      try {

        const response = await axios.get("http://localhost:8080/ofertas");
        // Pegamos as 3 primeiras para a vitrine da Home
        setOfertas(response.data.slice(0, 9));
      } catch (error) {
        console.error("Erro ao buscar ofertas:", error);
      }
    };
    carregarOfertas();
  }, []);


  return (
    <div className="landing-page">
      {/* --- HERO SECTION --- */}
      <section className="py-5 bg-white">
        <Navbar> </Navbar>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-3 fw-bold lh-1 mb-3 text-dark">
                Transforme seu <span className="text-success">Conhecimento</span> em Oportunidade
              </h1>
              <p className="lead mb-4 text-secondary">
                Encontre mentores, cursos e ofertas exclusivas organizadas por especialistas reais.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/dashboard" className="btn btn-success btn-lg px-4 me-md-2 fw-bold shadow-sm">
                  Comece Já
                </Link>
                {/* Link interno para rolar até a seção de ofertas */}
                <a href="#vitrine" className="btn btn-outline-success btn-lg px-4 shadow-sm">
                  Explore as Ofertas
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 p-md-5 bg-white rounded-4 shadow-lg border">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-shrink-0 bg-success p-3 rounded-3 text-white">
                    <span className="h3">🚀</span>
                  </div>
                  <div className="ms-3">
                    <h3 className="h5 mb-0 fw-bold">Destaque do Dia</h3>
                    <small className="text-muted">Aulas de JavaScript 1</small>
                  </div>
                </div>
                <p className="text-muted italic">
                  "A plataforma me ajudou a encontrar o mentor ideal para minha transição de carreira em menos de uma semana!"
                </p>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                    + Mutiplas Categorias
                  </span>
                  <span className="fw-bold text-dark">Grátis para começar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE EXIBIÇÃO ÚNICA (ID: vitrine) --- */}
      <section id="vitrine" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Ofertas em Destaque</h2>
          <div className="row">
            {ofertas.length > 0 ? (
              ofertas.map((item) => (
                <CardOferta key={item.id} oferta={item} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-success mb-2" role="status"></div>
                <p className="text-muted">Carregando ofertas...</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer /> 
    </div>

  );



} // <--- FECHAMENTO DA FUNÇÃO (IMPORTANTE)


export default LandingPage;



