import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar';
import { SingleRoot } from './pages/SingleRoot';
import BlogPage from './pages/blog';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Topbar />
            <Routes>
              <Route path='/' element={<SingleRoot/>}/>
            </Routes>
        </BrowserRouter>
    </div>
    
  )
}

export default App;
