# TideGraph  

潮位情報や天気予報を確認できる釣り情報アプリです。  
日付を選択して更新ボタンをクリックすると任意の日付のデータを表示できます。  
右上のカレンダーアイコンで月表示とに切り替えることができます。  

サンプルデータとして2022～2023年の潮位データ2023年3月の気象データを用意しています。  

### インストール手順  
appディレクトリ配下で下記のコマンドを実行してください。  
- npm install  

### 開発環境  
- webアプリ部分  
node v19.8.1  

- PDFスクレイピング部分  
python 3.10  

### 開発の経緯  
本アプリは最初からwebアプリとして設計されていたものではなく、  
海上保安庁が出している潮位情報のPDFからデータを抽出するpythonスクリプトから始まり、  
抽出したデータを閲覧するためのインタフェースとしてwebアプリ化したものです。  

