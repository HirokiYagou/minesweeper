# ★操作説明★
* ログインは任意です。
ただし結果を記録できるのはログインしたユーザーのみです。
　* 今後はユーザー別の記録表示機能実装・記録のデータ処理も実装したいです。

* 難易度を選んでください。
ただし結果を記録できるのは上級モードのみです。

* あそぶ

* コンプリートした時フィールドに{save record}ボタンが出現するのでそれを押していただくと記録を保存します。

* 失敗・成功によらず新しいゲームを再開するときは難易度ボタンを選んでください。



# マインスーパー愛

## 人生を変えた




# テーブル設計

## usersテーブル

| Column             | Type   | Options     |
| ------------------ | ------ | ----------- |
| nickname           | string | null: false |
| email              | string | null: false |
| encrypted_password | string | null: false |

### Association

- has_many :games

## gamesテーブル

| Column  | Type    | Options     |
| ------- | ------- | ----------- |
| record  | integer | null: false |
| comment | text    |             |
| user    | reference | foreign_key: true |

### Association

- belongs_to :user


# Vue.js導入手順まとめ

```
rails webpacker:install:vue
```

```
application.html.erb内に
<%= javascript_pack_tag 'hello_vue' %>
```
