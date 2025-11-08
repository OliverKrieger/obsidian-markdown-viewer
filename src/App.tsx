import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Page } from './pages/Page';
import { Layout } from './components/Layout';

export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/page/:pageId" element={<Page />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}
