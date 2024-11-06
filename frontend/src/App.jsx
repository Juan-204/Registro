// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from './components/Form';
import CheckList from './components/CheckList'

const App = () => {
  return (

    <Router>
      <Routes>
        <Route path='/' element={<Registro/>} />
        <Route path='/' element={<CheckList/>} />
      </Routes>
    </Router>

/*
    <div>
      <h1>Registro de Usuarios</h1>
      <Form />
    </div>
    */
  );
};

export default App;
