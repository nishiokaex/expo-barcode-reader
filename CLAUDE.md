# CLAUDE.md

このファイルは、このリポジトリ内のコードを操作する際に Claude Code (claude.ai/code) にガイダンスを提供します。

## 開発日誌を作成すること

`diary/yyyy-mm-dd_hhmm.md`のファイルを作成し、開発日誌を作成してください。内容は以下の通りです。

- **日付**: yyyy-mm-dd hh:mm
- **作業内容**:
  - 何をしたか
  - どのような問題が発生したか
  - どのように解決したか
- **次回の予定**:
- **感想**: 気分や愚痴を書く

## 開発コマンド

- `npm run web` - Expo Web開発サーバーを起動

## プロジェクトアーキテクチャ

これは以下の構造を持つExpo React Nativeアプリケーションです：

- **App.js** - 基本的なReact Nativeコンポーネントを含むメインアプリケーションエントリーポイント
- **index.js** - Expoアプリ登録エントリーポイント
- **app.json** - アプリメタデータ、アイコン、プラットフォーム設定を含むExpo設定
- **assets/** - アプリアイコン、スプラッシュスクリーン、静的アセットを格納
- **package.json** - Expo ~52.0.46、React 18.3.1、React Native 0.76.9などの依存関係

### 主要な依存関係

- **Expo SDK ~52.0.46** - コアExpo開発プラットフォーム
- **react-navigation ^5.0.0** - React Native用ナビゲーションライブラリ
- **zustand ^5.0.5** - 軽量状態管理ライブラリ
- **expo-status-bar** - Expoアプリ用ステータスバーコンポーネント

### 注意事項

- ドキュメントやソースコード上のコメントは日本語で書く
- 全体のコードベースを確認して、セキュリティ・パフォーマンス・保守性に優れた設計になっているか確認すること
- Expoアプリは新しいアーキテクチャが有効（app.jsonで`newArchEnabled: true`）
- iPadサポート（`supportsTablet: true`）
- クロスプラットフォームサポート（iOS、Android、Web）が設定済み
- TypeScript設定は存在しない - JavaScriptのみのプロジェクト
- プロジェクトルートにlintやテスト設定は見つからない