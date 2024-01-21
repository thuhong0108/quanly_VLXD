import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../../services/product';
import { formatPrice } from '../../services/common';
import './style.scss';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllCategories } from '../../services/category';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);

    const form = useFormik({
        initialValues: { _id: '', name: '', description: '', price: '', categoryId: '', image: '' }
    });

    useEffect(() => {
        getAllProductsFn();
    }, []);

    const getAllProductsFn = async () => {
        setLoading(true);
        const response = await getAllProducts();
        setProducts(response.data);
        setLoading(false);
    }

    const handleOpenDialog = async (data) => {
        setOpen(true);
        const response = await getAllCategories();
        setCategories(response.data);
        if (data) {
            data = { ...data, categoryId: data.category._id };
            form.setValues(data);
        }
    }

    const handleCloseDialog = () => {
        setOpen(false);
        form.resetForm();
    }

    const handleDeleteProduct = async (id) => {
       await deleteProduct(id);
       getAllProductsFn();
       toast.success('Xóa sản phẩm thành công');
    }

    const onSubmit = async () => {    
        if (validationForm()) {
            if (form.values._id) {
                await editProduct(form.values);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await addProduct(form.values);
                toast.success('Thêm sản phẩm thành công');
            } 
            handleCloseDialog();
            getAllProductsFn();
        } else {
            toast.error('Hãy nhập đầy đủ thông tin');
        }
    }

    const validationForm = () => {
        const { name, description, price, categoryId, image } = form.values;
        return !!(name && description && price && categoryId && image);
    }

    return ( 
        <div className="productMan container">
            {
                !loading ? (
                    <>
                        <div className='productMan__top'>
                            <Button variant="contained" onClick={() => handleOpenDialog(null)}>Thêm mới</Button>
                            <p>Có tất cả <b>{products?.length}</b> sản phẩm</p>
                        </div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Loại sản phẩm</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        products.map(item => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <img className='productMan__image' alt='' src={item.image} />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.category?.name}</TableCell>
                                                <TableCell>{formatPrice(item.price)}</TableCell>
                                                <TableCell>
                                                    <div className='productMan__action'>
                                                        <EditIcon onClick={() => handleOpenDialog(item)} />
                                                        <DeleteIcon onClick={() => handleDeleteProduct(item._id)} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Thêm sản phẩm mới */}
                        <Dialog open={open} onClose={handleCloseDialog} fullWidth>
                            <DialogTitle>{ form.values._id ? 'Sửa sản phẩm': 'Thêm sản phẩm' }</DialogTitle>
                            <DialogContent>
                                <div className='productMan__row'>
                                    <label>Tên</label>
                                    <TextField id="name" fullWidth value={form.values.name} 
                                        onChange={form.handleChange}
                                    />
                                </div>
                                <div className='productMan__row'>
                                    <label>Mô tả</label>
                                    <TextField id="description" fullWidth value={form.values.description} 
                                        onChange={form.handleChange} multiline rows={3}
                                    />
                                </div>
                                <div className='productMan__group'>
                                    <div>
                                        <label>Giá</label>
                                        <TextField id="price" fullWidth value={form.values.price} 
                                            onChange={form.handleChange} type='number'
                                        />
                                    </div>
                                    <div>
                                        <label >Loại sản phẩm</label>
                                        <Select disabled={!!form.values._id} value={form.values.categoryId}
                                            onChange={(e) => form.setFieldValue('categoryId', e.target.value)}>
                                            {
                                                categories.map(category => (
                                                    <MenuItem key={category._id} value={category._id}>{category.name}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className='productMan__row'>
                                    <label>Hình ảnh</label>
                                    <TextField id="image" fullWidth value={form.values.image} onChange={form.handleChange} />
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Hủy</Button>
                                <Button onClick={onSubmit}>Lưu</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                ) : (
                    <CircularProgress />
                )
            }
        </div>
     );
}

export default ProductManagement;