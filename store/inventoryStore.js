import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useInventoryStore = create((set, get) => ({
  // 商品リスト
  products: [],
  
  // ローディング状態
  isLoading: false,
  
  // 検索キーワード
  searchQuery: '',
  
  // ソート設定
  sortBy: 'name', // 'name', 'quantity', 'updatedAt'
  sortOrder: 'asc', // 'asc', 'desc'

  // 商品追加
  addProduct: async (product) => {
    const newProduct = {
      id: Date.now().toString(),
      name: product.name,
      quantity: product.quantity,
      barcode: product.barcode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const products = [...get().products, newProduct];
    set({ products });
    await saveToStorage(products);
  },

  // 商品更新
  updateProduct: async (id, updates) => {
    const products = get().products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    set({ products });
    await saveToStorage(products);
  },

  // 商品削除
  deleteProduct: async (id) => {
    const products = get().products.filter(product => product.id !== id);
    set({ products });
    await saveToStorage(products);
  },

  // 数量更新
  updateQuantity: async (id, quantity) => {
    const products = get().products.map(product =>
      product.id === id
        ? { ...product, quantity, updatedAt: new Date().toISOString() }
        : product
    );
    set({ products });
    await saveToStorage(products);
  },

  // バーコードで商品検索
  findProductByBarcode: (barcode) => {
    return get().products.find(product => product.barcode === barcode);
  },

  // 検索設定
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ソート設定
  setSortBy: (sortBy, sortOrder = 'asc') => set({ sortBy, sortOrder }),


  // データローディング
  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem('inventory_products');
      if (data) {
        const products = JSON.parse(data);
        set({ products });
      }
    } catch (error) {
      console.error('商品データの読み込みに失敗しました:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));


// ストレージ保存ヘルパー関数
const saveToStorage = async (products) => {
  try {
    await AsyncStorage.setItem('inventory_products', JSON.stringify(products));
  } catch (error) {
    console.error('商品データの保存に失敗しました:', error);
  }
};

export default useInventoryStore;