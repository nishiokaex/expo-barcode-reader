import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Searchbar,
  Menu,
  FAB,
  IconButton,
  Chip,
} from 'react-native-paper';
import useInventoryStore from '../store/inventoryStore';
import { addSampleData } from '../utils/sampleData';

const InventoryListScreen = ({ navigation }) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortOrder,
    setSortBy,
    loadProducts,
    isLoading,
    deleteProduct,
  } = useInventoryStore();

  const [menuVisible, setMenuVisible] = useState(false);

  // useMemoでフィルタリングとソートを最適化
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.barcode.includes(query)
      );
    }
    
    // ソート
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
    
    return filtered;
  }, [products, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field, newOrder);
    setMenuVisible(false);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      '商品削除',
      `「${product.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  };

  const renderProduct = ({ item: product }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.productName}>{product.name}</Title>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteProduct(product)}
          />
        </View>
        <View style={styles.productInfo}>
          <Paragraph>数量: {product.quantity}</Paragraph>
          <Paragraph>バーコード: {product.barcode}</Paragraph>
        </View>
        <View style={styles.cardActions}>
          <Chip
            mode="outlined"
            style={styles.chip}
            onPress={() =>
              navigation.navigate('ProductManagement', {
                product,
                mode: 'edit',
              })
            }
          >
            編集
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  const getSortLabel = () => {
    const labels = {
      name: '商品名',
      quantity: '数量',
      updatedAt: '更新日時',
    };
    return `${labels[sortBy]} (${sortOrder === 'asc' ? '昇順' : '降順'})`;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="在庫管理" />
        <Appbar.Action
          icon="database-plus"
          onPress={() => addSampleData(useInventoryStore)}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => handleSort('name')}
            title="商品名でソート"
          />
          <Menu.Item
            onPress={() => handleSort('quantity')}
            title="数量でソート"
          />
          <Menu.Item
            onPress={() => handleSort('updatedAt')}
            title="更新日時でソート"
          />
        </Menu>
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="商品名またはバーコードで検索"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.sortInfo}>
          <Paragraph>ソート: {getSortLabel()}</Paragraph>
          <Paragraph>件数: {filteredProducts.length}</Paragraph>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={loadProducts}
        />
      </View>

      <FAB
        style={styles.fab}
        icon="barcode-scan"
        onPress={() => navigation.navigate('BarcodeSelection')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  sortInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    flex: 1,
  },
  productInfo: {
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chip: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default InventoryListScreen;