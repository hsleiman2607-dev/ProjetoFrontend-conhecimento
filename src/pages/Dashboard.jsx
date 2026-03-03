

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [ofertas, setOfertas] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [editando, setEditando] = useState(null); // Armazena a oferta sendo editada
  const [formOferta, setFormOferta] = useState({ titulo: '', nivel: 'Iniciante', categoria_ID: '', pessoa_ID: '' });

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const [resO, resP] = await Promise.all([api.get('/ofertas'), api.get('/pessoas')]);
    setOfertas(resO.data); setPessoas(resP.data);
  };

  const salvarOferta = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/ofertas/${editando.id}`, formOferta);
      } else {
        await api.post('/ofertas', formOferta);
      }
      setEditando(null);
      setFormOferta({ titulo: '', nivel: 'Iniciante', categoria_ID: '', pessoa_ID: '' });
      carregarDados();
    } catch (err) { alert("Erro ao processar requisição."); }
  };

  const prepararEdicao = (o) => {
    setEditando(o);
    setFormOferta({ titulo: o.titulo, nivel: o.nivel, categoria_ID: o.categoria_ID, pessoa_ID: o.pessoa_ID });
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* FORMULÁRIO DE OFERTAS */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="fw-bold">{editando ? 'Editar Oferta' : 'Cadastrar Oferta'}</h5>
            <form onSubmit={salvarOferta}>
              <input className="form-control mb-2" placeholder="Título" value={formOferta.titulo} 
                onChange={e => setFormOferta({...formOferta, titulo: e.target.value})} required />
              
              <select className="form-select mb-2" value={formOferta.pessoa_ID} 
                onChange={e => setFormOferta({...formOferta, pessoa_ID: e.target.value})} required>
                <option value="">Selecione a Pessoa...</option>
                {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome_completo}</option>)}
              </select>

              <button className={`btn w-100 ${editando ? 'btn-warning' : 'btn-success'}`}>
                {editando ? 'Atualizar' : 'Publicar'}
              </button>
              {editando && <button className="btn btn-link w-100 btn-sm" onClick={() => setEditando(null)}>Cancelar</button>}
            </form>
          </div>
        </div>

        {/* LISTAGEM DE OFERTAS */}
        <div className="col-md-8">
          <h5 className="fw-bold mb-3">Conhecimentos Disponíveis</h5>
          <div className="list-group shadow-sm">
            {ofertas.map(o => (
              <div key={o.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                <div>
                  <h6 className="mb-0 fw-bold">{o.titulo}</h6>
                  <small className="text-muted">Por: {o.pessoa?.nome_completo} | Nível: {o.nivel}</small>
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => prepararEdicao(o)}><Edit size={16} /></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={async () => { 
                    if(confirm("Excluir?")) { await api.delete(`/ofertas/${o.id}`); carregarDados(); } 
                  }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;