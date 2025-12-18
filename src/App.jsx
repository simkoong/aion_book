import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Activities from './pages/Activities';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="activities" element={<Activities />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
    </Routes>
  );
}

export default App;
