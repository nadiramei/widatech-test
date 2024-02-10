import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateInvoice from './CreateInvoice';
import Dashboard from './Dashboard';
import InvoiceCard from './InvoiceCard';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create-invoice" element={<CreateInvoice />} />
                <Route path="/invoice-card" element={<InvoiceCard />} />
            </Routes>
        </Router>
    );
}

export default App;
