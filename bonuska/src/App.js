import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from "./pages/MainPage";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <Router>
            <Routes>
                <Route exact path="/" element={<Login />}></Route>
                <Route exact path="/register" element={<Register />}></Route>
                <Route exact path="/mainpage" element={<MainPage />}></Route>
            </Routes>
          </Router>
        </header>
      </div>
  );
}

export default App;
