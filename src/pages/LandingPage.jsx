import { Rocket, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="bg-light min-vh-100">
    <header className="bg-dark text-white py-5 text-center">
      <h1 className="display-3 fw-bold">Troca de Conhecimento</h1>
      <p className="lead">Aprenda o que você precisa, ensine o que você ama.</p>
      <Link to="/dashboard" className="btn btn-primary btn-lg px-5 shadow">Entrar na Plataforma</Link>
    </header>
    
    <section className="container py-5 text-center">
      <div className="row">
        <div className="col-md-4">
          <Rocket size={48} className="text-primary mb-3" />
          <h4>Impulsione sua Carreira</h4>
          <p className="text-muted">Encontre mentores dispostos a compartilhar experiências reais.</p>
        </div>
        <div className="col-md-4">
          <Target size={48} className="text-primary mb-3" />
          <h4>Foco Prático</h4>
          <p className="text-muted">Aprenda habilidades específicas diretamente com quem as domina.</p>
        </div>
        <div className="col-md-4">
          <Heart size={48} className="text-primary mb-3" />
          <h4>Comunidade</h4>
          <p className="text-muted">Crie conexões valiosas baseadas na colaboração mútua.</p>
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;