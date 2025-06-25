# 家計簿アプリ
ログイン後、収支データの投稿&削除、月毎の収支データとグラフ、カテゴリー毎の合計金額の閲覧ができます。
<br>

### TOPページ
<img width="1450" alt="スクリーンショット 2025-06-25 9 46 17" src="https://github.com/user-attachments/assets/8ac75135-1f8e-4c7e-b358-e28a5d7c37de" />
<br>

## 作成した目的
フロントエンド学習のアウトプットのため
<br>

## 機能一覧
|会員登録画面|ログイン画面|
| --- | --- |
|<img width="100%" height="300" alt="会員登録" src="https://github.com/user-attachments/assets/4989a8cd-6720-41ac-84a9-73043db73629" />|<img width="100%" height="300" alt="ログイン" src="https://github.com/user-attachments/assets/13959e5a-0e33-4319-97e1-5e0823e3cbf5" />|
|Firebase Authenticationを使用し、ユーザー名、メールアドレス、パスワード、を入力して登録できます。|Firebase Authenticationを使用し、メールアドレス、パスワードを入力するとログインできます。|

|トップ画面1|トップ画面2|
| --- | --- |
|<img width="100%" alt="スクリーンショット 2025-06-25 9 46 17" src="https://github.com/user-attachments/assets/445f56d8-e28a-4f5b-a5e3-5fb7ed2e5847" />|<img width="100%" alt="詳細" src="https://github.com/user-attachments/assets/3df8aee9-af45-4868-ad81-cee7c72c02d7" />|
|ログインユーザーのみアクセスできます。<br>月毎の収支データが表示され、両脇のボタンで前月、翌月の切り替えができます。<br>収支データの投稿&削除、月毎の収支データとグラフ、カテゴリー毎の合計金額の閲覧ができます。|カテゴリー毎の合計金額は全てのカテゴリーが表示され、データ登録のないカテゴリーは0円として表示されます。|

|収支データ登録画面1|収支データ登録画面2|
| --- | --- |
|<img width="100%" alt="支出選択" src="https://github.com/user-attachments/assets/ccba32cf-a070-4c3e-89e9-da81226087ce" />|<img width="100%" alt="収入選択" src="https://github.com/user-attachments/assets/82af8904-3b53-4bc4-a975-7ba8accece6d" />|
|HeaderのEditボタンをクリックすると収支データ登録画面に遷移します。<br>最初にカテゴリーを選択します。|支出を選択すると、支出のカテゴリーが表示、収入をクリックすると収入のカテゴリーが表示されます。|

|収支データ登録画面3|エラー画面|
| --- | --- |
|<img width="100%" alt="入力フォーム" src="https://github.com/user-attachments/assets/b6bd7df4-ccb0-4892-a8c8-75314cf5ba79" />|<img width="100%" alt="エラー画面" src="https://github.com/user-attachments/assets/7ece0f99-cb21-441c-b71b-c8bbefeff9ef" />|
|カテゴリーを選択すると入力画面にスライドします。日付、金額、メモ（任意）を入力し、送信ボタンをクリックすると登録されます。<br>戻るボタンでカテゴリー選択画面に戻ります。|エラーが発生するとエラー画面に遷移します。ステータスとエラーの概要が表示されます。ホームボタンでトップ画面に戻れます。<br>画像は500エラー時の画面|

## 実行環境
Docker 27.5.1
<br>
nginx 1.21.1
<br>
php 8.3.8
<br>
mysql 8.0.26
<br>
phpMyAdmin 5.2.1
<br>
nuxt 3.17.5
<br>

## 使用技術
**フロントエンド**
<br>
Nuxt 3.17.5
<br>
Vue 3.5.16
<br>
Vue Router 4.5.1
<br>
Pinia 3.0.3
<br>
Axios 1.10.0
<br>
Firebase Authentication 11.9.1
<br>
vee-validate 4.15.1
<br>
Yup 1.6.1
<br>
<br>
**バックエンド**
<br>
Laravel Framework 8.x
<br>
PHP (^7.3 | ^8.0)
<br>
Kreait Laravel Firebase 4.1
<br>
Fruitcake Laravel CORS 2.0
<br>

## テーブル設計
<img width="100%" alt="テーブル定義" src="https://github.com/user-attachments/assets/7b5a4858-67b9-45d7-aef6-1c0ef744ea23" />


## ER図
<img width="100%" alt="ER図" src="https://github.com/user-attachments/assets/a13ffab0-9e9f-4d5b-a4f5-40af9859f0ec" />

## 環境構築
<br>
① gitクローン

```
git clone https://github.com/k-sasaki066/money-diary.git
```
<br>
② docker composeのバージョン確認（バージョンによって一部記載が異なるため）

```
docker compose version
```
<br>
▫️ -v1の場合
<br>
<br>
docker-compose.ymlファイルのコメントアウトを外してください

```
version: '3.8'　(コメントアウト解除)
```
<br>
以下のdocker composeコマンドをdocker-composeに読み替えて実行してください
<br>
<br>
▫️ -v2の場合
<br>
変更点なし
<br>
<br>
③ dockerビルド

```
docker compose up -d --build
```
<br>

> _Mac の M1・M2 チップの PC で設定しています。エラーが発生する場合は、platform: linux/x86_64をコメントアウトしてください。_
> docker-compose.yml ファイルの「mysql」、「phpMyAdmin」の2箇所に記載があります。_

```bash
mysql:
    platform: linux/x86_64(この文をコメントアウト)
    image: mysql:8.0.26
    environment:
```

<br>
<br>
④ nuxt側、laravel側両方にenvファイルを作成

▫️ nuxt
<br>
nuxtディレクトリに移動

```
cd money-diary-1
```
<br>

envファイルを作成

```
touch .env
```
<br>
<br>
▫️ laravel側
<br>
PHPコンテナに入る

```
docker compose exec php bash
```
<br>
envファイル作成

```
cp .example.env .env
```

<br>
<br>
⑤ composerインストール

```
composer install
```
<br>
<br>
⑥ envファイル編集
backend/src/.envファイル
<br>
▫️ アプリケーションキーを取得を取得

```
php artisan key:generate
```
<br>
▫️ mysqlの設定(docker-compose.ymlを参照)
  
  ```
  DB_CONNECTION=mysql
  DB_HOST=mysql(変更)
  DB_PORT=3306
  DB_DATABASE=laravel_db(変更)
  DB_USERNAME=laravel_user(変更)
  DB_PASSWORD=laravel_pass(変更)
  ```
  <br>
  <br>

▫️ Firebaseプロジェクト作成（公式ページ https://firebase.google.com/?hl=ja）
<br>
1. Firebaseアカウントを作成する（アカウント作成するには、Googleアカウントが必要です。）
<br>
<img width="700" alt="トップ画面" src="https://github.com/user-attachments/assets/95c8afe0-b847-4edb-85c1-77eb983efd32" />
<br>
<br>
2. ログイン後、コンソール画面にて『Firebaseプロジェクトを使ってみる』をクリック
<br>
<img width="700" alt="1 プロジェクト作成" src="https://github.com/user-attachments/assets/86ab9923-29df-47d4-a348-a3155d626c78" />
<br>
<br>
3. プロジェクト名を入力する（任意の名前）
<br>
<img width="700" alt="2 プロジェクト名" src="https://github.com/user-attachments/assets/cd77cf4c-a006-49bf-aefc-c886349c1c08" />
<br>
<br>
4. Gemini（生成AI）の設定をして続行ボタンをクリック
<br>
<img width="700" alt="3 gemini設定" src="https://github.com/user-attachments/assets/58c763f6-0d6f-4a0b-80e8-b08d0e699d43" />
<br>
<br>
5. Google アナリティクスを有効にするか選択→ オフでも問題なし（後から有効化可能）
<br>
<img width="700" alt="4 アナリティクス" src="https://github.com/user-attachments/assets/ac00cfd3-7c40-4823-ac4a-34566f7c4804" />
<br>
<br>
6. プロジェクト作成ボタンをクリック
<br>
<img width="700" alt="5 作成" src="https://github.com/user-attachments/assets/8d396c8a-27cd-4b10-a118-c4aa27d51b35" />
<br>
<br>
▫️ Firebase Authentication設定手順
<br>
1. コンソール画面左のメニューから『構築』→『Authentication』をクリック
<br>
<img width="700" alt="1 authentication設定" src="https://github.com/user-attachments/assets/ed2c678f-450e-418d-929d-f71d06768432" />
<br>
<br>
2. 始める』ボタンをクリック→表示される項目から『メール / パスワード』をクリック
<br>
<img width="700" alt="2 Authenticationクリック後" src="https://github.com/user-attachments/assets/cefef638-e3ea-4a5d-862a-a3a1eee2b795" />
<br>
<br>
3. メール / パスワードを有効にする
<br>
<img width="700" alt="3 有効にする" src="https://github.com/user-attachments/assets/ef834190-a878-481d-ae75-3d5be12e0d63" />
<br>
<br>
▫️ Firebase アプリ登録設定手順
<br>
1. コンソール画面の左メニューから『Authentication』→『プロジェクトの設定』をクリック
<br>
<img width="700" alt="4 プロジェクト設定ボタン" src="https://github.com/user-attachments/assets/6352720f-3991-48e2-b28d-06d38c21b999" />
<br>
<br>
2. 画像赤枠のwebボタンをクリック
<br>
<img width="700" alt="5 webボタン" src="https://github.com/user-attachments/assets/772aa1a2-175d-44af-9179-c47d8a2d8bd4" />
<br>
<br>
3. アプリのニックネームを設定（任意の名前）して、『アプリを登録』をクリック（「Firebase Hosting を設定する」は今回は必要無いのでOFFでOK）
<br>
<img width="700" alt="6 ネーム設定" src="https://github.com/user-attachments/assets/37388415-343c-479f-a798-11d66eceb00c" />
<br>
<br>
4. 『<script>タグを使用する』を選択し、『コンソールへ進む』をクリック→Firebase 構成情報が表示されます
<br>
<img width="700" alt="7 SDK取得" src="https://github.com/user-attachments/assets/b556c310-5c2e-41c5-b928-b388aeef2987" />
<br>
<br>
▫️ Firebase 秘密鍵設定手順（Firebase Admin SDK用の秘密鍵を発行する操作）
<br>
1. コンソール画面から⚙️マーク→『プロジェクトの設定』→『サービスアカウント』をクリック
　　<br>
   Node.jsを選択し、『新しい秘密鍵を生成』をクリック
   <br>
   <img width="700" alt="8 秘密鍵生成" src="https://github.com/user-attachments/assets/e7513d29-4d47-4282-8c86-72b3cdf317ca" />
<br>
<br>
2. クリック後、.jsonファイルが自動でダウンロードされます<br>ファイル名を『firebase-adminsdk.json』に変更する<br>このファイルを/backend/src/firebaseディレクトリに保存
<br>
<br>
【重要】秘密鍵ファイルは機密情報のためGithubにアップロードできません。<br>/backend/src/gitignoreファイルに以下の記述があることを確認

  ```
  /firebase/*.json
  ```

<br>
<br>
3. /backend/src/.envファイルに追加

```
GOOGLE_APPLICATION_CREDENTIALS=/var/www/firebase/firebase-adminsdk.json
FIREBASE_PROJECT_ID=プロジェクトID(コンソール画面から取得)
```
<br>
<br>
4. /frontend/.envファイルに追加(コンソール画面のSDK(firebaseConfig)から取得)

```
NUXT_PUBLIC_FIREBASE_API_KEY=apiKey
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=authDomain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=projectId
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=storageBucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId
NUXT_PUBLIC_FIREBASE_APP_ID=appId
```

<br>
<br>
⑦ テーブル作成
  
  ```
  php artisan migrate
  ```
<br>
<br>
⑧ http://localhost:3000/registerを開き、任意のユーザーを2人作成する（実際に登録されたユーザーをダミーデータに使用するため）
<br>
作成例
<br>
<img width="700" alt="firebaseユーザー作成例" src="https://github.com/user-attachments/assets/0a0b9be7-8a7a-4d6e-9077-c25b94980cbf" />
<br>
<br>
⑨ /backend/src/.envファイルに追加

```
FIREBASE_UID_1=1人目のfirebaseユーザーuid
FIREBASE_UID_2=2人目のfirebaseユーザーuid
```
<br>
<br>
⑩ .envファイルの変更を反映

```
php artisan cache:clear
php artisan config:clear
```
<br>
<br>
11. ダミーデータ作成

```
php artisan migrate:fresh --seed
 ```
<br>
<br>
## URL

- 開発環境
  - ログインページ <http://localhost:3000/login>
- phpMyAdmin <http://localhost:8080>



