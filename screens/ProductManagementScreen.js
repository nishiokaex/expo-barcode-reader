import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
  Divider,
} from 'react-native-paper';
import useInventoryStore from '../store/inventoryStore';

const ProductManagementScreen = ({ navigation, route }) => {
  const { product, barcode, mode = 'add' } = route.params || {};
  
  const { addProduct, updateProduct, updateQuantity } = useInventoryStore();
  
  const [name, setName] = useState(product?.name || '');
  const [quantity, setQuantity] = useState(product?.quantity?.toString() || '0');
  const [barcodeValue, setBarcodeValue] = useState(product?.barcode || barcode || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setQuantity(product.quantity.toString());
      setBarcodeValue(product.barcode);
    }
  }, [product]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('エラー', '商品名を入力してください');
      return;
    }
    
    if (!barcodeValue.trim()) {
      Alert.alert('エラー', 'バーコードを入力してください');
      return;
    }
    
    const qty = parseInt(quantity) || 0;
    if (qty < 0) {
      Alert.alert('エラー', '数量は0以上の値を入力してください');
      return;
    }

    setLoading(true);
    
    try {
      if (mode === 'add') {
        await addProduct({
          name: name.trim(),
          quantity: qty,
          barcode: barcodeValue.trim(),
        });
        Alert.alert('成功', '商品を追加しました', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else if (mode === 'edit') {
        await updateProduct(product.id, {
          name: name.trim(),
          quantity: qty,
          barcode: barcodeValue.trim(),
        });
        Alert.alert('成功', '商品を更新しました', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity < 0) return;
    
    setQuantity(newQuantity.toString());
    
    if (mode === 'updateQuantity' && product) {
      try {
        await updateQuantity(product.id, newQuantity);
      } catch (error) {
        console.error('数量更新エラー:', error);
      }
    }
  };

  const handleQuantityChange = (delta) => {
    const currentQty = parseInt(quantity) || 0;
    const newQty = Math.max(0, currentQty + delta);
    handleQuantityUpdate(newQty);
  };

  const handleSaveQuantity = async () => {
    if (!product) return;
    
    const qty = parseInt(quantity) || 0;
    setLoading(true);
    
    try {
      await updateQuantity(product.id, qty);
      Alert.alert('成功', '数量を更新しました', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('エラー', '数量更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'add': return '商品追加';
      case 'edit': return '商品編集';
      case 'updateQuantity': return '数量更新';
      case 'view': return '商品詳細';
      default: return '商品管理';
    }
  };

  const isReadOnly = mode === 'view';
  const isQuantityMode = mode === 'updateQuantity';

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={getTitle()} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>商品情報</Title>
            
            <TextInput
              label="商品名"
              value={name}
              onChangeText={setName}
              mode="outlined"
              disabled={isReadOnly || isQuantityMode}
              style={styles.input}
            />
            
            <TextInput
              label="バーコード"
              value={barcodeValue}
              onChangeText={setBarcodeValue}
              mode="outlined"
              disabled={isReadOnly || isQuantityMode}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>数量管理</Title>
            
            {isQuantityMode ? (
              <View style={styles.quantityControls}>
                <View style={styles.quantityRow}>
                  <IconButton
                    icon="minus"
                    mode="contained"
                    onPress={() => handleQuantityChange(-1)}
                    disabled={parseInt(quantity) <= 0}
                  />
                  <TextInput
                    value={quantity}
                    onChangeText={(text) => {
                      const num = parseInt(text) || 0;
                      handleQuantityUpdate(Math.max(0, num));
                    }}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.quantityInput}
                    textAlign="center"
                  />
                  <IconButton
                    icon="plus"
                    mode="contained"
                    onPress={() => handleQuantityChange(1)}
                  />
                </View>
                
                <View style={styles.quickButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => handleQuantityChange(-10)}
                    style={styles.quickButton}
                  >
                    -10
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleQuantityChange(-5)}
                    style={styles.quickButton}
                  >
                    -5
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleQuantityChange(5)}
                    style={styles.quickButton}
                  >
                    +5
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleQuantityChange(10)}
                    style={styles.quickButton}
                  >
                    +10
                  </Button>
                </View>
              </View>
            ) : (
              <TextInput
                label="数量"
                value={quantity}
                onChangeText={setQuantity}
                mode="outlined"
                keyboardType="numeric"
                disabled={isReadOnly}
                style={styles.input}
              />
            )}
          </Card.Content>
        </Card>

        {product && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>詳細情報</Title>
              <Paragraph>作成日: {new Date(product.createdAt).toLocaleString('ja-JP')}</Paragraph>
              <Paragraph>更新日: {new Date(product.updatedAt).toLocaleString('ja-JP')}</Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Divider />
        <View style={styles.buttonContainer}>
          {!isReadOnly && (
            <Button
              mode="contained"
              onPress={isQuantityMode ? handleSaveQuantity : handleSave}
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
            >
              {isQuantityMode ? '数量を保存' : '保存'}
            </Button>
          )}
        </View>
      </View>
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
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  quantityControls: {
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityInput: {
    width: 100,
    marginHorizontal: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actions: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default ProductManagementScreen;