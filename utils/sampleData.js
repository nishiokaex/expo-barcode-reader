// テスト用サンプルデータ
export const sampleProducts = [
  {
    id: '1',
    name: 'りんご',
    quantity: 10,
    barcode: '4901234567890',
    createdAt: '2025-06-20T10:00:00.000Z',
    updatedAt: '2025-06-25T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'バナナ',
    quantity: 25,
    barcode: '4901234567891',
    createdAt: '2025-06-21T10:00:00.000Z',
    updatedAt: '2025-06-24T10:00:00.000Z',
  },
  {
    id: '3',
    name: 'オレンジ',
    quantity: 5,
    barcode: '4901234567892',
    createdAt: '2025-06-22T10:00:00.000Z',
    updatedAt: '2025-06-23T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'パン',
    quantity: 15,
    barcode: '4901234567893',
    createdAt: '2025-06-19T10:00:00.000Z',
    updatedAt: '2025-06-25T15:00:00.000Z',
  },
];

export const addSampleData = async (store) => {
  const { products } = store.getState();
  
  // 既存データがない場合のみサンプルデータを追加
  if (products.length === 0) {
    for (const product of sampleProducts) {
      await store.getState().addProduct({
        name: product.name,
        quantity: product.quantity,
        barcode: product.barcode,
      });
    }
  }
};