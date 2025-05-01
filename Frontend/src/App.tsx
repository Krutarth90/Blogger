import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signup } from './pages/signup';
import { SignIn } from './pages/Signin';

function App() {
  return(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/signin' element={<SignIn/>}/>
            </Routes>
        </BrowserRouter>
    </div> 
  )
}

export default App;
