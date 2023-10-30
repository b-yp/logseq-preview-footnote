# logseq-preview-footnote プラグイン

[English](https://github.com/b-yp/logseq-preview-footnote) | [中文](https://github.com/b-yp/logseq-preview-footnote/blob/main/README.chCN.md) | [日本語](https://github.com/b-yp/logseq-preview-footnote/blob/main/README.ja.md)

脚注のプレビューを提供します。

## 概要

- コンテンツ内の脚注にカーソルを合わせると、見出しブロック内の内容がプレビューされます。
- 別のブロックに表示すべき内容をコピーして表示します。

## 依存関係

- Logseq プラグイン > [logseq-footnotes-plugin](https://github.com/gremi-jr/logseq-footnote-plugin) (Logseq マーケットプレースから入手可能)
   - 脚注を作成するためのスラッシュコマンド ("`/Add Footnote`") を提供するプラグインです。カーソルの位置に実行され、脚注ブロック内に見出しを作成します。

## 使用方法

  1. `Preview Footnote` プラグインをインストールします (Logseq マーケットプレースから入手可能)。
  2. どこかのブロックに脚注を作成します。
  3. 脚注にカーソルを合わせるとプレビューが表示されます。

## デモ

- 脚注の作成からプレビューの表示まで

   ![画像](https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/footnote.gif)

<details>
  <summary>.mp4 動画</summary>
  <video src="https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/Kapture%202023-10-22%20at%2017.47.59.mp4" controls />
</details>

## プラグインの設定

- "## Footnotes" で始まるブロックを展開します
  - プレビューを表示するためには、ブロックを展開する必要があります。ブロックを自動的に展開します。
  - `true` デフォルト
  - `false`

- マウスがプレビューから離れると閉じる
  - この設定を無効にすると、プレビューは自動的に消えません。手動で閉じる必要があります。この設定は4秒後には効果がありません。
  - `false` デフォルト
  - `true`

- マウスから離れてから閉じるまでの遅延時間 (最短時間)
  - プレビューを閉じる前の遅延時間。
  - `600`
  - `800`
  - `1000`
  - `1200` デフォルト
  - `1400`
  - `1600`
  - `1800`
  - `2000`
  - `2500`

- プレビューの数を制限
  - `false` > 複数のプレビューを表示できます。
  - `true` デフォルト
  - `false`

- 別のページを開くとプレビューを閉じる
  - `false` > 別のページを開いてもプレビューは保持されます。
  - `true` デフォルト
  - `false`

- プレビューの最大幅
  - 200px < 1200px
  - `600` デフォルト

- YouTube プレビューの最適化を有効にする
  - `true` デフォルト

## インフォメーション

ライセンス > [MIT](https://choosealicense.com/licenses/mit/)

著者 > [@b-yp](https://github.com/b-yp)
