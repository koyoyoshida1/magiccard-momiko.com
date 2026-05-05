# AdSense広告枠の使い方

`index.html` には、AdSenseの広告ユニットIDを入れるだけで実広告に切り替わる共通枠を用意しています。

## 入れる場所

`index.html` 内の以下を検索してください。

```html
data-ad-slot=""
```

AdSense管理画面で作成した広告ユニットのスロットIDを入れます。

```html
data-ad-slot="1234567890"
```

## 枠の種類

- `momiko-ad-global`: 全ページ上部の共通広告
- `momiko-ad-rectangle`: PC右カラムの300x250枠
- `momiko-ad-sticky`: PC右カラムの追従広告枠
- `momiko-ad-bottom`: フッター前の読了後広告

## 注意

- スロットIDが空の間は広告リクエストを送らず、スポンサー枠として表示されます。
- `ca-pub-9319517564080738` はすでに設定済みです。
- 誤クリック防止のため、ボタンやコピー操作の近くには広告枠を置かない設計にしています。
