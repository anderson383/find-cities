import { BrowserRouter } from 'react-router-dom';
import { RouterPage } from './pages/router-page';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <RouterPage />
    </BrowserRouter>
  );
}

export default App;
