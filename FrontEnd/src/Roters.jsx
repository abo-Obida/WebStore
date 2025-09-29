import {Routes, Route} from "react-router-dom"
import AdminOrders from "./Page/AdminOrder"
import AdminProducts from "./Page/AdminProducts"
import AdminUsers from "./Page/AdminUsers"
import Cart from "./Page/Cart"
import Dashboard from "./Page/Dashboard"
import Home from "./Page/Home"
import Login from "./Page/LoginPage"
import ProductDetails from "./Page/ProductDetails"
import ProductsPage from "./Page/ProductsPage"
const Roters = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Products" element={<ProductsPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Products/:id" element={<ProductDetails/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin/orders" element={<AdminOrders/>}/>
        <Route path="/admin/users" element={<AdminUsers/>}/>
        <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default Roters
