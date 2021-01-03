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