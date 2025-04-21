import { useState } from 'react';
import { Edit, Trash, AlertCircle, RefreshCw, Plus, Minus } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import toast from 'react-hot-toast';

const ProductTable = () => {
  const { filteredProducts, isLoading, updateStock, updateProduct } = useProductStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    price: number;
    stock_quantity: number;
    low_stock_threshold: number;
  }>({
    price: 0,
    stock_quantity: 0,
    low_stock_threshold: 0,
  });
  
  const [showStockAdjuster, setShowStockAdjuster] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(1);
  
  const handleUpdatePrice = (id: string) => {
    const product = filteredProducts.find(p => p.id === id);
    if (!product) return;
    
    setEditingId(id);
    setEditValues({
      price: product.price,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
    });
  };
  
  const handleSavePrice = async (id: string) => {
    try {
      await updateProduct(id, {
        price: editValues.price,
        low_stock_threshold: editValues.low_stock_threshold,
      });
      
      setEditingId(null);
      toast.success('Produto atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar produto');
    }
  };
  
  const handleAdjustStock = async (id: string, amount: number) => {
    try {
      await updateStock(id, amount);
      setShowStockAdjuster(null);
      setAdjustAmount(1);
      
      toast.success(
        amount > 0 
          ? 'Estoque adicionado com sucesso' 
          : 'Estoque reduzido com sucesso'
      );
    } catch (error: any) {
      toast.error(error.message || 'Erro ao ajustar estoque');
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-card p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      </div>
    );
  }
  
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card p-8 flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-3 inline-block mb-4">
            <AlertCircle size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum produto encontrado</h3>
          <p className="text-gray-500 text-sm mb-4">
            Tente ajustar seus filtros ou adicione novos produtos
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-card overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Limite Mínimo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-10 w-10 rounded-md object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-3">
                      <span className="text-xs">Sem img</span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
                {product.requires_prescription && (
                  <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Receita
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === product.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editValues.price}
                      onChange={(e) => setEditValues({...editValues, price: parseFloat(e.target.value)})}
                      className="w-20 p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {showStockAdjuster === product.id ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAdjustAmount(Math.max(1, adjustAmount - 1))}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 1)}
                      className="w-16 p-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
                    />
                    <button
                      onClick={() => setAdjustAmount(adjustAmount + 1)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Plus size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleAdjustStock(product.id, adjustAmount)}
                      className="p-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleAdjustStock(product.id, -adjustAmount)}
                      className="p-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      -
                    </button>
                    <button
                      onClick={() => {
                        setShowStockAdjuster(null);
                        setAdjustAmount(1);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <span className="text-xs">Cancelar</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span 
                      className={`text-sm ${
                        product.stock_quantity <= product.low_stock_threshold
                          ? 'text-red-600 font-medium'
                          : 'text-gray-900'
                      }`}
                    >
                      {product.stock_quantity} unid.
                    </span>
                    {product.stock_quantity <= product.low_stock_threshold && (
                      <AlertCircle size={14} className="ml-1 text-red-500" />
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === product.id ? (
                  <input
                    type="number"
                    min="0"
                    value={editValues.low_stock_threshold}
                    onChange={(e) => setEditValues({...editValues, low_stock_threshold: parseInt(e.target.value)})}
                    className="w-16 p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
                  />
                ) : (
                  <div className="text-sm text-gray-900">{product.low_stock_threshold} unid.</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => handleSavePrice(product.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdatePrice(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setShowStockAdjuster(
                          showStockAdjuster === product.id ? null : product.id
                        )}
                        className="text-green-600 hover:text-green-800"
                        title="Atualizar estoque"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;