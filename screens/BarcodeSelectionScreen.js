import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';

const BarcodeSelectionScreen = ({ navigation }) => {
  const handleCameraScanner = () => {
    navigation.navigate('CameraBarcode');
  };

  const handleManualInput = () => {
    navigation.navigate('ManualBarcode');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="バーコード読み取り方法" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>📷 カメラでスキャン</Title>
            <Paragraph style={styles.cardDescription}>
              スマートフォンのカメラを使用してバーコードを自動的に読み取ります
            </Paragraph>
            <View style={styles.features}>
              <Paragraph>• 高速で正確な読み取り</Paragraph>
              <Paragraph>• 自動認識機能</Paragraph>
              <Paragraph>• 複数フォーマット対応</Paragraph>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={handleCameraScanner}
              style={styles.button}
            >
              カメラを起動
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>⌨️ 手動入力</Title>
            <Paragraph style={styles.cardDescription}>
              バーコード番号を手動で入力します
            </Paragraph>
            <View style={styles.features}>
              <Paragraph>• カメラ権限不要</Paragraph>
              <Paragraph>• サンプル生成機能</Paragraph>
              <Paragraph>• 確実な入力</Paragraph>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              onPress={handleManualInput}
              style={styles.button}
            >
              手動入力
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>💡 使い方のヒント</Title>
            <Paragraph>• 良好な照明下でスキャンしてください</Paragraph>
            <Paragraph>• バーコードを画面中央に合わせてください</Paragraph>
            <Paragraph>• 手動入力では13桁のJANコードが推奨です</Paragraph>
          </Card.Content>
        </Card>
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
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  features: {
    marginLeft: 8,
  },
  button: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    color: '#1976d2',
    marginBottom: 8,
  },
});

export default BarcodeSelectionScreen;