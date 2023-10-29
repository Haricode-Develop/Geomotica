import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from "./MainRoutes";

function App() {
  return (
      <AuthProvider>
        <div className="App">
            <Router>
                <MainRoutes />
            </Router>
        </div>
      </AuthProvider>
  );
}

export default App;
