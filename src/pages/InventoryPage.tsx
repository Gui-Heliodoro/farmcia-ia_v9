import { useEffect, useState } from 'react';
import { Search, Filter, Plus, AlertTriangle } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import Navbar from '../components/Navbar';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';

const InventoryPage = () => {
  const { 
    fetchProducts, 
    setSearchTerm, 
    setCategoryFilter, 
    setLowStockOnly,
    searchTerm,
    categoryFilter,
    lowStockOnly,
    isLoading,
    products
  } = useProductStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Extract unique categories
  useEffect(() => {
    if (products.length > 0) {
      const categories = [...new Set(products.map(product => product.category))];
      setAvailableCategories(categories);
    }
  }, [products]);
  
  // Count low stock products
  const lowStockCount = products.filter(
    product => product.stock_quantity <= product.low_stock_threshold
  ).length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 sm:mt-0 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center justify-center transition"
          >
            <Plus size={16} className="mr-2" />
            Adicionar Produto
          </button>
        </div>
        
        {/* Low stock alert */}
        {lowStockCount > 0 && (
          <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-md flex items-center text-accent-700">
            <AlertTriangle size={18} className="mr-2 text-accent-500" />
            <span className="text-sm">
              <strong>{lowStockCount}</strong> produtos com estoque baixo precisam de reposição
            </span>
          </div>
        )}
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category filter */}
            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent appearance-none"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Low stock toggle */}
            <div className="w-full md:w-auto flex items-center">
              <input
                id="low-stock"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
              />
              <label htmlFor="low-stock" className="ml-2 block text-sm text-gray-700">
                Apenas estoque baixo
              </label>
            </div>
          </div>
        </div>
        
        {/* Product table */}
        <ProductTable />
        
        {/* Add product form modal */}
        {showAddForm && <ProductForm onClose={() => setShowAddForm(false)} />}
      </main>
    </div>
  );
};

export default InventoryPage;