import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Appbar, Button, Text, Portal, Modal, Card } from 'react-native-paper';
import useInventoryStore from '../store/inventoryStore';

const CameraBarcodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  
  const { findProductByBarcode } = useInventoryStore();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // バーコードで商品を検索
    const existingProduct = findProductByBarcode(data);
    
    if (existingProduct) {
      // 既存商品の場合：数量更新画面へ
      setScannedProduct(existingProduct);
      setModalVisible(true);
    } else {
      // 新規商品の場合：商品追加画面へ
      navigation.navigate('ProductManagement', {
        barcode: data,
        mode: 'add',
      });
    }
  };

  const handleUpdateQuantity = () => {
    setModalVisible(false);
    navigation.navigate('ProductManagement', {
      product: scannedProduct,
      mode: 'updateQuantity',
    });
  };

  const handleViewProduct = () => {
    setModalVisible(false);
    navigation.navigate('ProductManagement', {
      product: scannedProduct,
      mode: 'view',
    });
  };

  const resetScanner = () => {
    setScanned(false);
    setModalVisible(false);
    setScannedProduct(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="カメラでバーコード読み取り" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text>カメラへのアクセス許可を要求中...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="カメラでバーコード読み取り" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            カメラへのアクセスが許可されていません
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            戻る
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="カメラでバーコード読み取り" />
      </Appbar.Header>

      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "aztec", "code128", "code39", "code93", "codabar", "ean13", "ean8", "itf14", "upc_e", "upc_a"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.instructionText}>
            バーコードをスキャンエリア内に合わせてください
          </Text>
        </View>

        {scanned && (
          <View style={styles.scannedOverlay}>
            <Button
              mode="contained"
              onPress={resetScanner}
              style={styles.resetButton}
            >
              再スキャン
            </Button>
          </View>
        )}
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
              {scannedProduct && (
                <>
                  <Text style={styles.productName}>
                    {scannedProduct.name}
                  </Text>
                  <Text>現在の数量: {scannedProduct.quantity}</Text>
                  <Text>バーコード: {scannedProduct.barcode}</Text>
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
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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

export default CameraBarcodeScreen;