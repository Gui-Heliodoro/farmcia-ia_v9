import { useState } from 'react';
import { X, Camera, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useProductStore } from '../store/productStore';
import toast from 'react-hot-toast';

interface ProductFormProps {
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category: string;
  requires_prescription: boolean;
  image_url?: string;
}

const categories = [
  'Medicamentos',
  'Cosméticos',
  'Higiene Pessoal',
  'Suplementos',
  'Vitaminas',
  'Dermocosméticos',
  'Infantil',
  'Outros',
];

const ProductForm: React.FC<ProductFormProps> = ({ onClose }) => {
  const { addProduct, isLoading } = useProductStore();
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>();
  
  const onSubmit = async (data: ProductFormData) => {
    try {
      await addProduct(data);
      toast.success('Produto adicionado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao adicionar produto');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Adicionar Novo Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </label>
              <input
                id="name"
                type="text"
                className={`w-full p-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
                {...register('name', { required: 'Nome é obrigatório' })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                className={`w-full p-2 border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
                {...register('category', { required: 'Categoria é obrigatória' })}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
              )}
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={`w-full p-2 border ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
                {...register('price', { 
                  required: 'Preço é obrigatório',
                  min: {
                    value: 0.01,
                    message: 'Preço deve ser maior que zero'
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
            
            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade em Estoque *
              </label>
              <input
                id="stock_quantity"
                type="number"
                min="0"
                className={`w-full p-2 border ${
                  errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
                {...register('stock_quantity', { 
                  required: 'Quantidade é obrigatória',
                  min: {
                    value: 0,
                    message: 'Quantidade não pode ser negativa'
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-xs text-red-600">{errors.stock_quantity.message}</p>
              )}
            </div>
            
            {/* Low Stock Threshold */}
            <div>
              <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700 mb-1">
                Limite Mínimo de Estoque *
              </label>
              <input
                id="low_stock_threshold"
                type="number"
                min="1"
                className={`w-full p-2 border ${
                  errors.low_stock_threshold ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
                {...register('low_stock_threshold', { 
                  required: 'Limite mínimo é obrigatório',
                  min: {
                    value: 1,
                    message: 'Limite mínimo deve ser pelo menos 1'
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.low_stock_threshold && (
                <p className="mt-1 text-xs text-red-600">{errors.low_stock_threshold.message}</p>
              )}
            </div>
            
            {/* Requires Prescription */}
            <div className="flex items-center h-10 mt-6">
              <input
                id="requires_prescription"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                {...register('requires_prescription')}
              />
              <label htmlFor="requires_prescription" className="ml-2 block text-sm text-gray-700">
                Requer Receita Médica
              </label>
            </div>
            
            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem (opcional)
              </label>
              <input
                id="image_url"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
                {...register('image_url')}
              />
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full p-2 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
              {...register('description', { required: 'Descrição é obrigatória' })}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;