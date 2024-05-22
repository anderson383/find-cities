import {
  Route, Routes
} from 'react-router-dom';
import { IndexPage } from './index';

export const RouterPage = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
};

