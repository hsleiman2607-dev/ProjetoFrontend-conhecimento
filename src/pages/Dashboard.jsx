

import React, { useState, useEffect } from 'react';
import axios from "axios"

import { Edit, Trash2, PlusCircle, X } from 'lucide-react';

const Dashboard = () => {
  const [ofertas, setOfertas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  ///const[editarOferta, setEditarOferta] = useState(null);

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

  // função para deletar uma oferta
  const deletarOferta = async (id) => {
    if (window.confirm("Deseja realmente excluir esta oferta?")) {
        try {
            // Certifique-se que a URL está correta (ex: porta 8080)
            await axios.delete(`http://localhost:8080/ofertas/${id}`);
            
            // Atualiza a lista removendo o item deletado
            setOfertas(ofertas.filter(o => o.id !== id));
            alert("Oferta excluída!");
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao excluir a oferta no servidor.");
        }
    }
};







const editarOferta = async (id, dadosAtualizados) => {
    try {
        // Realiza a chamada PUT para o ID específico
        const response = await axios.put(`http://localhost:8080/ofertas/${id}`, dadosAtualizados);
        
        console.log("Oferta atualizada:", response.data);
        
        // Atualiza a lista localmente para evitar um novo GET
        setOfertas(ofertas.map(o => o.id === id ? response.data : o));
        
        alert("Oferta atualizada com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao atualizar a oferta no servidor.");
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Converte IDs para Number para evitar Bad Request no Prisma
    const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria_ID: Number(formData.categoria_ID),
        pessoa_ID: Number(formData.pessoa_ID)
    };

    if (editandoId) {
        // Chama a função de edição declarada acima
        await editarOferta(editandoId, payload);
        setEditandoId(null);
    } else {
        // Lógica de criação original
        try {
            await axios.post('http://localhost:8080/ofertas', payload);
            carregarOfertas();
        } catch (error) {
            alert("Erro ao criar oferta.");
        }
    }

    setIsModalOpen(false);
    setFormData({ titulo: '', descricao: '', nivel: '', categoria_ID: '', pessoa_ID: '' });
};
const abrirModalEdicao = (oferta) => {
    setEditandoId(oferta.id);
    setFormData({
        titulo: oferta.titulo,
        descricao: oferta.descricao,
        nivel: oferta.nivel || '',
        categoria_ID: oferta.categoria_ID,
        pessoa_ID: oferta.pessoa_ID
    });
    setIsModalOpen(true);
};



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
                <button className="btn btn-sm btn-warning me-2" onClick={() => abrirModalEdicao(oferta)}>
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