import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from "./MainRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
      <AuthProvider>
          <ToastContainer />
        <div className="App">
            <Router>
                <MainRoutes />
            </Router>
        </div>
      </AuthProvider>
  );
}

export default App;
