import { useState, useEffect } from 'react';
import { X, Tag, DollarSign, ShoppingCart, Image, Type, Star } from 'lucide-react';
import { Product } from '../types';

interface EditProductFormProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export function EditProductForm({ isOpen, product, onClose, onSubmit }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    stock: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
        stock: product.stock
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (formData.price <= 0) newErrors.price = 'Prix positif requis';
    if (!formData.image_url.trim()) newErrors.image_url = 'URL de l\'image requise';
    if (!formData.category.trim()) newErrors.category = 'Catégorie requise';
    if (formData.stock < 0) newErrors.stock = 'Stock non négatif requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as Product);
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-pink-200">
          <h2 className="text-2xl font-bold text-pink-800">Modifier le Produit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-pink-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
              <Type className="w-4 h-4" />
              <label className="text-sm font-medium text-pink-700">Nom du Produit</label>
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
              <Star className="w-4 h-4" />
              <label className="text-sm font-medium text-pink-700">Description</label>
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
                <DollarSign className="w-4 h-4" />
                <label className="text-sm font-medium text-pink-700">Prix</label>
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
                <ShoppingCart className="w-4 h-4" />
                <label className="text-sm font-medium text-pink-700">Stock</label>
              </span>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
              <Tag className="w-4 h-4" />
              <label className="text-sm font-medium text-pink-700">Catégorie</label>
            </span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Electronics">Électronique</option>
              <option value="Fashion">Mode</option>
              <option value="Home">Maison</option>
              <option value="Fitness">Fitness</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <span className="flex items-center gap-1 text-sm font-medium text-pink-700 mb-2\">
              <Image className="w-4 h-4" />
              <label className="text-sm font-medium text-pink-700">URL de l'Image</label>
            </span>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
            {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-600 to-pink-800 text-white rounded-lg hover:from-pink-700 hover:to-pink-900 transition-colors"
            >
              Enregistrer Modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}