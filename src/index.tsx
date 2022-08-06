import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Mine } from './pages/mine';
import { Home } from './pages/home';
import { Category } from './pages/category';
import { Publish } from './pages/publish';
import { Page } from './utils/constants';
import { Article } from './pages/article';
import { Login } from './pages/login';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename='/bbs'>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Home />} />
        <Route path={`/${Page.Mine}`} element={<Mine />} />
        <Route path={`/${Page.Category}`} element={<Category />} />
        <Route path={`/${Page.Publish}`} element={<Publish />} />
        <Route path={`/${Page.Article}`} element={<Article />} />
      </Route>
      <Route path={`/${Page.Login}`} element={<Login />} />
    </Routes>
  </BrowserRouter>
);
reportWebVitals();
