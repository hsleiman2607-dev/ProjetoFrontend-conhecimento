import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas (Views)

import Dashboard from './pages/adminpainel'; // Importação do Dashboard atualizado
import HeroSection from './pages/LandingPage'; // Exemplo de componente global (se necessário)
//import CardOferta from './components/CardOferta'; // Exemplo de componente global (se necessário)
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <BrowserRouter>
      {/* Se for usar a Navbar, descomente a linha de importação acima e a linha abaixo */}
      {/* <Navbar /> */}

     
      
      <Routes>
        <Route path="/" element={<HeroSection />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Navigate precisa estar no import para o redirecionamento funcionar */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;