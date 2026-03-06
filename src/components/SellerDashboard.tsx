import { useState, useEffect } from 'react';
import { Package, Users, DollarSign, Plus, Edit, Trash2, Eye, X, Menu } from 'lucide-react';
import { Product } from '../types';
import { Order, fetchOrders, updateOrderStatus } from '../lib/orders';

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export function SellerDashboard({ isOpen, onClose, products, onAddProduct, onEditProduct, onDeleteProduct }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen && activeTab === 'orders') {
      fetchOrders()
        .then(setOrders)
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setOrders([]);
        });
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    lowStockCount: products.filter(p => p.stock < 10).length,
    totalInventoryValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.customer_name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    o.customer_phone.includes(orderSearchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-700 bg-red-100 border-red-300';
      case 'processing': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'shipped': return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'delivered': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      onDeleteProduct(id);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex flex-col md:flex-row">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`w-full md:w-80 bg-white/95 border-r border-gray-200 p-6 overflow-auto transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block fixed md:relative z-50 h-full`}>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-3 rounded-lg shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">DorMark</h2>
              <p className="text-sm text-gray-500">Seller Dashboard</p>
            </div>
          </div>

          <nav className="mb-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'products' ? 'bg-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${activeTab === 'orders' ? 'bg-pink-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>Orders</span>
                  {stats.totalOrders > 0 && (
                    <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${activeTab === 'orders' ? 'bg-white text-pink-600' : 'bg-pink-600 text-white'}`}>
                      {stats.totalOrders}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-pink-50 to-white rounded-lg">
              <p className="text-xs text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-50 to-white rounded-lg">
              <p className="text-xs text-gray-500">Low Stock</p>
              <p className="text-xl font-semibold text-gray-900">{stats.lowStockCount}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-50 to-white rounded-lg">
              <p className="text-xs text-gray-500">Inventory Value</p>
              <p className="text-xl font-semibold text-gray-900">${stats.totalInventoryValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => { onAddProduct(); setSidebarOpen(false); }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-pink-600 to-pink-800 text-white rounded-md shadow-md hover:from-pink-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-200 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-600">Manage products, orders and analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden md:block px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-pink-600" />
              </button>
            </div>
          </div>

          {/* Dashboard overview */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Package className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products list */}
          {activeTab === 'products' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                <div className="text-sm text-gray-500">{filteredProducts.length} items</div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">{searchTerm ? 'No products found matching your search.' : 'No products added yet.'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map(product => (
                          <tr key={product.id}>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap flex items-center gap-2 md:gap-4">
                              <img src={product.image_url} alt={product.name} className="h-10 w-10 md:h-12 md:w-12 rounded-md object-cover" />
                              <div>
                                <div className="text-xs md:text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500 md:hidden">{product.category}</div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-700">${product.price.toFixed(2)}</td>
                            <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-700">{product.stock}</td>
                            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="inline-flex items-center gap-1 md:gap-2">
                                <button onClick={() => onEditProduct(product)} title="Edit" className="p-1.5 md:p-2 rounded-md bg-pink-50 text-pink-600 hover:bg-pink-100">
                                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} title="Delete" className="p-1.5 md:p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Commandes</h2>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Package className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{orderSearchTerm ? 'Aucune commande trouvée.' : 'Aucune commande pour le moment.'}</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredOrders.map(order => (
                      <div key={order.id} className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{order.customer_name}</p>
                            <p className="text-xs text-gray-500">{order.customer_email}</p>
                            <p className="text-xs text-gray-500">{order.customer_phone}</p>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value);
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: e.target.value } : o));
                            }}
                            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">En attente</option>
                            <option value="processing">En cours</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                          </select>
                        </div>
                        <div className="border-t pt-3 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-xs text-gray-600">{item.quantity}x {item.product_name}</p>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOrders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div>{order.customer_email}</div>
                                <div className="text-xs text-gray-500">{order.customer_phone}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {order.items.map((item, i) => (
                                  <div key={i} className="text-xs">{item.quantity}x {item.product_name}</div>
                                ))}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.total.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={order.status}
                                  onChange={(e) => {
                                    updateOrderStatus(order.id, e.target.value);
                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: e.target.value } : o));
                                  }}
                                  className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}
                                >
                                  <option value="pending">En attente</option>
                                  <option value="processing">En cours</option>
                                  <option value="shipped">Expédiée</option>
                                  <option value="delivered">Livrée</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default SellerDashboard;
