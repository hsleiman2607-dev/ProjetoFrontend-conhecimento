import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  PlusCircle,
  X,
  Users,
  Tag,
  Briefcase,
  Search,
} from "lucide-react";

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState("ofertas");
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    nome_completo: "",
    email: "",
    CatNome: "",
    descricao: "",
    categoria_ID: "",
    pessoa_ID: "",
  });

  const API_URL = "http://localhost:8080";

  const carregarDados = async () => {
    try {
      const [resAtual, resCat, resPes] = await Promise.all([
        axios.get(`${API_URL}/${abaAtiva}`),
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/pessoas`),
      ]);
      setDados(resAtual.data);
      setCategorias(resCat.data);
      setPessoas(resPes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {

        await axios.put(`${API_URL}/${abaAtiva}/${editandoId}`, formData);
        alert("Registro atualizado com sucesso!");
      } else {
        await axios.post(`${API_URL}/${abaAtiva}`, formData);
        alert("Registro criado com sucesso!");
      }
        carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique os dados informados.");
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dadosParaEnviar = {
        ...formData,
        categoria_ID: formData.categoria_ID
          ? Number(formData.categoria_ID)
          : null,
        pessoa_ID: formData.pessoa_ID ? Number(formData.pessoa_ID) : null,
      };

      if (editandoId) {
        await axios.put(
          `${API_URL}/${abaAtiva}/${editandoId}`,
          dadosParaEnviar,
        );
        alert("Registro atualizado com sucesso!");
      } else {
        await axios.post(`${API_URL}/${abaAtiva}`, dadosParaEnviar);
        alert("Registro criado com sucesso!");
      }

      setFormData({});
      setEditandoId(null);
      carregarDados();
      fecharModal();
    } catch (error) {
      console.error("ERRO COMPLETO:", error.response?.data || error);
      alert("Erro ao salvar.");
    }
  };

  const deletarRegistro = async (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      try {
        await axios.delete(`${API_URL}/${abaAtiva}/${id}`);
        setDados(dados.filter((item) => item.id !== id));
      } catch (error) {
        alert("Erro ao excluir. Verifique vínculos.");
      }
    }
  };

  const abrirModalEdicao = (item) => {
    setEditandoId(item.id);
    setFormData({
      titulo: item.titulo || "",
      nome_completo: item.nome_completo || "",
      CatNome: item.CatNome || "",
      email: item.email || "",
      descricao: item.descricao || "",
      categoria_ID: item.categoria_ID || item.CatID || "",
      pessoa_ID: item.pessoa_ID || "",
    });
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditandoId(null);
    setFormData({
      titulo: "",
      nome_completo: "",
      email: "",
      CatNome: "",
      descricao: "",
      categoria_ID: "",
      pessoa_ID: "",
    });
  };

  const dadosFiltrados = dados.filter((item) => {
    const termo = filtro.toLowerCase();
    const valorBusca = (
      item.titulo ||
      item.nome_completo ||
      item.CatNome ||
      ""
    ).toLowerCase();
    return valorBusca.includes(termo);
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="bg-dark text-white p-3 shadow" style={{ width: "250px" }}>
        <h3 className="mb-5 text-success fw-bold text-center">Admin Dash</h3>
        <nav className="nav flex-column gap-2">
          <button
            onClick={() => setAbaAtiva("ofertas")}
            className={`btn text-start d-flex align-items-center gap-2 ${abaAtiva === "ofertas" ? "btn-success" : "btn-outline-light border-0"}`}
          >
            <Briefcase size={18} /> Ofertas
          </button>
          <button
            onClick={() => setAbaAtiva("pessoas")}
            className={`btn text-start d-flex align-items-center gap-2 ${abaAtiva === "pessoas" ? "btn-success" : "btn-outline-light border-0"}`}
          >
            <Users size={18} /> Pessoas
          </button>
          <button
            onClick={() => setAbaAtiva("categorias")}
            className={`btn text-start d-flex align-items-center gap-2 ${abaAtiva === "categorias" ? "btn-success" : "btn-outline-light border-0"}`}
          >
            <Tag size={18} /> Categorias
          </button>
        </nav>
      </div>

      <div className="flex-grow-1 p-5 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-capitalize fw-bold m-0">Gerenciar {abaAtiva}</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={20} className="me-2" /> Novo
          </button>
        </div>

        <div className="mb-4 position-relative">
          <span className="position-absolute top-50 translate-middle-y ps-3 text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control ps-5 py-2 border-0 shadow-sm"
            placeholder="Pesquisar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="card shadow-sm border-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">ID</th>
                <th>Nome/Título</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4">{item.id}</td>
                  <td className="fw-bold">
                    {item.titulo || item.nome_completo || item.CatNome}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => abrirModalEdicao(item)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletarRegistro(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-capitalize">
                  {editandoId ? "Editar" : "Novo"} {abaAtiva}
                </h5>
                <button className="btn-close" onClick={fecharModal}></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                {/* SEÇÃO: CATEGORIAS */}
                {abaAtiva === "categorias" && (
                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Nome da Categoria *
                    </label>
                    <input
                      className="form-control"
                      required
                      value={formData.CatNome}
                      onChange={(e) =>
                        setFormData({ ...formData, CatNome: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* SEÇÃO: PESSOAS */}
                {abaAtiva === "pessoas" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Nome Completo *
                      </label>
                      <input
                        className="form-control"
                        required
                        value={formData.nome_completo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nome_completo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Categoria da Pessoa *
                      </label>
                    </div>
                   <select
  className="form-select"
  required
  value={formData.categoria_ID}
  onChange={(e) =>
    setFormData({
      ...formData,
      categoria_ID: e.target.value
    })
  }
>
  <option value="">Selecione...</option>
  {categorias.map((cat) => (
    <option
      key={cat.categoria_ID}
      value={cat.categoria_ID}
    >
      {cat.CatNome}
    </option>
  ))}
</select>

                  </>
                )}

                {/* SEÇÃO: OFERTAS */}
                {abaAtiva === "ofertas" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Título da Oferta *
                      </label>
                      <input
                        className="form-control"
                        required
                        value={formData.titulo}
                        onChange={(e) =>
                          setFormData({ ...formData, titulo: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Descrição
                      </label>
                      <textarea
                        className="form-control"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descricao: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Categoria *
                      </label>
                      <select
                        className="form-select"
                        required
                        value={formData.categoria_ID}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria_ID: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (
                          <option
                            key={cat.categoria_ID}
                            value={cat.categoria_ID}
                          >
                            {cat.CatNome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        Pessoa Responsável *
                      </label>
                      <select
                        className="form-select"
                        required
                        value={formData.pessoa_ID}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pessoa_ID: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione...</option>
                        {pessoas.map((p) => (
                          <option key={p.pessoa_ID} value={p.pessoa_ID}>
                            {p.nome_completo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold py-2 mt-3"
                >
                  {editandoId ? "Salvar Alterações" : "Confirmar Cadastro"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
