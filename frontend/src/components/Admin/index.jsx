import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import OrderManagement from '../OrderManagement';
import ProductManagement from '../ProductManagement';
import './style.scss';

function Admin() {
    const [type, setType] = useState(1);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return ( 
        <div className="admin container">
            <div className='admin__type'>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value={1}>Quản lí sản phẩm</MenuItem>
                    <MenuItem value={2}>Quản lí đơn hàng</MenuItem>
                </Select>
            </div>
            {
                type === 1 ? (
                    <ProductManagement />
                ) : (
                    <OrderManagement />
                )
            }
        </div>
     );
}

export default Admin;