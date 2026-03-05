import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Edit, Trash2, PlusCircle, X, Tag, Users, Briefcase } from 'lucide-react';

const API_URL = "http://localhost:8080";

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('ofertas'); // ofertas, pessoas, categorias
  const [dados, setDados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  // Estados auxiliares para os selects do formulário
  const [categorias, setCategorias] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  const [formData, setFormData] = useState({
    titulo: '', descricao: '', categoria_ID: '', pessoa_ID: '', // Ofertas
    nome_completo: '', email: '', // Pessoas
    CatNome: '' // Categorias
  });

  // --- CARREGAMENTO DE DADOS ---
  const carregarDados = async () => {
    try {
      const response = await axios.get(`${API_URL}/${abaAtiva}`);
      setDados(response.data);
      
      // Carrega auxiliares para preencher os selects no modal
      const [resCat, resPes] = await Promise.all([
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/pessoas`)
      ]);
      setCategorias(resCat.data);
      setPessoas(resPes.data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  useEffect(() => { carregarDados(); }, [abaAtiva]);

  // --- CRUD OPERAÇÕES ---
  const deletarItem = async (id) => {
    if (window.confirm(`Excluir este item de ${abaAtiva}?`)) {
      try {
        await axios.delete(`${API_URL}/${abaAtiva}/${id}`);
        setDados(dados.filter(item => item.id !== id));
      } catch (error) { alert("Erro ao deletar."); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {};

    // Mapeamento dinâmico baseado na aba para evitar erro 400
    if (abaAtiva === 'ofertas') {
      payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria_ID: Number(formData.categoria_ID),
        pessoa_ID: Number(formData.pessoa_ID)
      };
    } else if (abaAtiva === 'pessoas') {
      payload = {
        nome_completo: formData.nome_completo,
        email: formData.email,
        CatID: Number(formData.categoria_ID) // FK da categoria
      };
    } else {
      payload = { CatNome: formData.CatNome };
    }

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${abaAtiva}/${editandoId}`, payload);
      } else {
        await axios.post(`${API_URL}/${abaAtiva}`, payload);
      }
      fecharModal();
      carregarDados();
    } catch (error) {
      console.error("Erro:", error.response?.data);
      alert("Erro ao salvar. Verifique os campos.");
    }
  };

  const abrirEdicao = (item) => {
    setEditandoId(item.id);
    setFormData({
      ...formData,
      ...item,
      // Garante que o ID da categoria seja mapeado corretamente para o select
      categoria_ID: item.categoria_ID || item.CatID || ''
    });
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditandoId(null);
    setFormData({ titulo: '', descricao: '', categoria_ID: '', pessoa_ID: '', nome_completo: '', email: '', CatNome: '' });
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold">Admin Panel</h1>

      {/* --- NAVEGAÇÃO POR ABAS --- */}
      <div className="btn-group mb-4 shadow-sm">
        <button className={`btn ${abaAtiva === 'ofertas' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('ofertas')}>
          <Briefcase size={18} className="me-2"/> Ofertas
        </button>
        <button className={`btn ${abaAtiva === 'pessoas' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('pessoas')}>
          <Users size={18} className="me-2"/> Pessoas
        </button>
        <button className={`btn ${abaAtiva === 'categorias' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaAtiva('categorias')}>
          <Tag size={18} className="me-2"/> Categorias
        </button>
      </div>

      <div className="text-end mb-3">
        <button className="btn btn-success fw-bold" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} className="me-2" /> Novo Registro
        </button>
      </div>

      {/* --- TABELA DINÂMICA --- */}
      <div className="card shadow border-0">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome/Título</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.id}> {/* 'key' resolve erro de console */}
                <td>{item.id}</td>
                <td>{item.titulo || item.nome_completo || item.CatNome}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => abrirEdicao(item)}><Edit size={16}/></button>
                  <button className="btn btn-sm btn-danger" onClick={() => deletarItem(item.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DINÂMICO --- */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 shadow-lg">
              <div className="d-flex justify-content-between mb-3">
                <h3 className="fw-bold">Gerenciar {abaAtiva}</h3>
                <X cursor="pointer" onClick={fecharModal} />
              </div>

              <form onSubmit={handleSubmit}>
                {abaAtiva === 'ofertas' && (
                  <>
                    <input className="form-control mb-2" placeholder="Título" required value={formData.titulo} 
                      onChange={e => setFormData({...formData, titulo: e.target.value})} />
                    <textarea className="form-control mb-2" placeholder="Descrição" value={formData.descricao} 
                      onChange={e => setFormData({...formData, descricao: e.target.value})} />
                    <select className="form-select mb-2" required value={formData.categoria_ID} 
                      onChange={e => setFormData({...formData, categoria_ID: e.target.value})}>
                      <option value="">Selecione Categoria...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.CatNome}</option>)}
                    </select>
                    <select className="form-select mb-2" required value={formData.pessoa_ID} 
                      onChange={e => setFormData({...formData, pessoa_ID: e.target.value})}>
                      <option value="">Selecione Responsável...</option>
                      {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome_completo}</option>)}
                    </select>
                  </>
                )}

                {abaAtiva === 'pessoas' && (
                  <>
                    <input className="form-control mb-2" placeholder="Nome Completo" required value={formData.nome_completo} 
                      onChange={e => setFormData({...formData, nome_completo: e.target.value})} />
                    <input className="form-control mb-2" type="email" placeholder="E-mail" required value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} />
                    <select className="form-select mb-2" required value={formData.categoria_ID} 
                      onChange={e => setFormData({...formData, categoria_ID: e.target.value})}>
                      <option value="">Vincular Categoria...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.CatNome}</option>)}
                    </select>
                  </>
                )}

                {abaAtiva === 'categorias' && (
                  <input className="form-control mb-2" placeholder="Nome da Categoria" required value={formData.CatNome} 
                    onChange={e => setFormData({...formData, CatNome: e.target.value})} />
                )}

                <button type="submit" className="btn btn-success w-100 fw-bold py-2 mt-3">Confirmar</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;