import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Modal,
  Text,
} from 'react-native-paper';
import useInventoryStore from '../store/inventoryStore';

const ManualBarcodeScreen = ({ navigation }) => {
  const [barcode, setBarcode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  
  const { findProductByBarcode } = useInventoryStore();

  const handleSearch = () => {
    if (!barcode.trim()) {
      Alert.alert('エラー', 'バーコードを入力してください');
      return;
    }

    const product = findProductByBarcode(barcode.trim());
    
    if (product) {
      setFoundProduct(product);
      setModalVisible(true);
    } else {
      // 新規商品として追加画面へ
      navigation.navigate('ProductManagement', {
        barcode: barcode.trim(),
        mode: 'add',
      });
    }
  };

  const handleUpdateQuantity = () => {
    setModalVisible(false);
    navigation.navigate('ProductManagement', {
      product: foundProduct,
      mode: 'updateQuantity',
    });
  };

  const handleViewProduct = () => {
    setModalVisible(false);
    navigation.navigate('ProductManagement', {
      product: foundProduct,
      mode: 'view',
    });
  };

  const generateSampleBarcode = () => {
    // サンプル用のバーコード生成
    const timestamp = Date.now().toString();
    const sampleBarcode = '49' + timestamp.slice(-11); // 13桁のJANコード風
    setBarcode(sampleBarcode);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="バーコード入力" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>バーコード検索</Title>
            <Paragraph style={styles.description}>
              商品のバーコード番号を入力して検索してください
            </Paragraph>
            
            <TextInput
              label="バーコード番号"
              value={barcode}
              onChangeText={setBarcode}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              placeholder="例: 4901234567890"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSearch}
                style={styles.searchButton}
                disabled={!barcode.trim()}
              >
                検索
              </Button>
              
              <Button
                mode="outlined"
                onPress={generateSampleBarcode}
                style={styles.sampleButton}
              >
                サンプル生成
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>使い方</Title>
            <Paragraph>• 商品パッケージのバーコード番号を入力</Paragraph>
            <Paragraph>• 既存商品の場合：数量更新画面に移動</Paragraph>
            <Paragraph>• 新規商品の場合：商品追加画面に移動</Paragraph>
            <Paragraph>• テスト用にサンプルバーコードを生成可能</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Card>
            <Card.Title title="商品が見つかりました" />
            <Card.Content>
              {foundProduct && (
                <>
                  <Text style={styles.productName}>
                    {foundProduct.name}
                  </Text>
                  <Text>現在の数量: {foundProduct.quantity}</Text>
                  <Text>バーコード: {foundProduct.barcode}</Text>
                </>
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={handleViewProduct}>詳細</Button>
              <Button mode="contained" onPress={handleUpdateQuantity}>
                数量更新
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
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
  description: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    flex: 1,
    marginRight: 8,
  },
  sampleButton: {
    flex: 1,
    marginLeft: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ManualBarcodeScreen;