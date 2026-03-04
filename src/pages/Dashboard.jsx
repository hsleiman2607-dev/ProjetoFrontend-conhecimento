

import React, { useState, useEffect } from 'react';
import axios from "axios"

import { Edit, Trash2, PlusCircle, X } from 'lucide-react';

const Dashboard = () => {
  const [ofertas, setOfertas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    nivel: '',
    categoria_ID: '',
    pessoa_ID: ''
  });


  // --- ESTILOS DO MODAL ---
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', color: '#333'
  };

  const inputStyle = { 
    padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' 
  };

  const carregarOfertas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/ofertas');
      setOfertas(response.data);
    } catch (error) {
      console.error("Erro ao buscar ofertas:", error);
      alert("Erro ao carregar a lista.");
    }
  };

  // Executa a busca assim que o componente é montado
  useEffect(() => {
    carregarOfertas();
  }, []);


  // 2. DELETAR: Remove a oferta do banco e da tela
  const deletarOferta = async (id) => {
    if (window.confirm("Deseja realmente excluir esta oferta?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Filtra o estado para remover o item sem recarregar a página
        setOfertas(ofertas.filter(o => o.id !== id));
        alert("Oferta excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir a oferta. Verifique o console.");
      }
    }
  };

  // 3. CRIAR: Envia o formulário para o app.post("/ofertas")
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      titulo: formData.titulo,
      descricao: formData.descricao || null,
      nivel: formData.nivel || null,
      categoria_ID: Number(formData.categoria_ID), // Garante que é número
      pessoa_ID: Number(formData.pessoa_ID)     // Garante que é número
    };

    const response = await axios.post('http://localhost:8080/ofertas', payload);
    console.log("Sucesso:", response.data);
    
    setIsModalOpen(false);
    setFormData({ titulo: '', descricao: '', nivel: '', categoria_ID: '', pessoa_ID: '' });
    carregarOfertas();
  } catch (error) {
    // Se o erro persistir, olhe a aba 'Network' do F12 para ver o erro do Prisma
    console.error("Erro completo:", error.response || error);
    alert("Erro ao criar. Verifique se os IDs existem no banco.");
  }
};
  useEffect(() => {
    carregarOfertas();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Dashboard de Ofertas</h1>
      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} className="me-2" />
          Nova Oferta
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.map((oferta) => (
            <tr key={oferta.id}>
              <td>{oferta.id}</td>
              <td>{oferta.titulo}</td>
              <td>{oferta.descricao}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2">
                  <Edit size={18} />
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deletarOferta(oferta.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     


{/* --- RENDERIZAÇÃO CONDICIONAL DO MODAL --- */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>Nova Oferta</h2>
              <X cursor="pointer" onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleSubmit}>
              <label>Título *</label>
              <input required style={inputStyle} value={formData.titulo} 
                onChange={e => setFormData({...formData, titulo: e.target.value})} />

              <label>Descrição</label>
              <textarea style={inputStyle} value={formData.descricao} 
                onChange={e => setFormData({...formData, descricao: e.target.value})} />

              <label>ID Categoria *</label>
              <input type="number" required style={inputStyle} value={formData.categoria_ID} 
                onChange={e => setFormData({...formData, categoria_ID: e.target.value})} />

              <label>ID Pessoa *</label>
              <input type="number" required style={inputStyle} value={formData.pessoa_ID} 
                onChange={e => setFormData({...formData, pessoa_ID: e.target.value})} />

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Salvar Oferta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
      
      
   
  );
};

export default Dashboard;