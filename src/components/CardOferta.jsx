import React from 'react';

// O componente recebe 'oferta' como uma propriedade (prop)
const CardOferta = ({ oferta }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body">
          {/* Categoria */}
          <span className="badge bg-success-subtle text-success mb-2">
            {oferta.categoria?.CatNome || "Geral"}
          </span>
          
          {/* Título e Descrição */}
          <h5 className="card-title fw-bold">{oferta.titulo}</h5>
          <p className="card-text text-muted small">
            {oferta.descricao}
          </p>
        </div>
        
        <div className="card-footer bg-white border-0 pb-3">
          <div className="d-flex align-items-center">
            <span className="me-2">👤</span>
            <small className="text-muted">
              Responsável: <strong>{oferta.pessoa?.nome_completo}</strong>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOferta;