import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/ProductComponent/ProductComponent';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeComponent />} />
        <Route path='/view/:id' element={<ProductComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
