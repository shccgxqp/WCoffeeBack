<p align="center">
  <a href="" rel="noopener">
 <img width=300px height=200px src="https://github.com/shccgxqp/WCoffeeBack/blob/main/bg.jpg?raw=true" alt="Project logo"></a>
</p>

<h3 align="center">wc-coffee-back</h3>

<div align="center">


[![Status](https://img.shields.io/badge/status-Offline-red.svg)]()
[![GitHub commit activity](https://img.shields.io/github/commit-activity/y/shccgxqp/WCoffeeBack)]()
![GitHub followers](https://img.shields.io/github/followers/shccgxqp?logo=github)

</div>

---

WC-Coffee-Back 是一個使用Node.js + express + MySQL + PostgreSQL 建立的電子商務後端專案，

以RESTFul API 滿足不同網站的互動需求，配合[WC-Coffee-front](<https://github.com/shccgxqp/WCoffeeFront>)
前端專案，打造咖啡的電商網站


## 📝 目錄
- [📝 目錄](#-目錄)
- [🎈 Initial - 專案介紹 ](#-initial---專案介紹-)
- [🧐 Features - 專案功能 ](#-features---專案功能-)
- [🗃️ MySQL - 資料庫架構規劃](#️-mysql---資料庫架構規劃)
- [💡 API Reference - 格式規範](#-api-reference---格式規範)
- [⛏️ Built Using - 主要使用  ](#️-built-using---主要使用--)
- [⚙️ Installing - 專案安裝流程](#️-installing---專案安裝流程)
- [🛠️ 更新計畫 - 未來將更新的功能](#️-更新計畫---未來將更新的功能)
- [📝 網站開發紀錄](#-網站開發紀錄)

## 🎈 Initial - 專案介紹 <a name="initial"></a>

隨著咖啡文化的興起和消費者對高品質咖啡的追求，建立一個完整的電商購物網站是創立咖啡豆品牌的必要步驟之一。這個網站將扮演著多重角色，不僅僅是一個銷售平台，還是品牌形象的展示窗口和顧客互動的重要渠道。

***核心功能***

* **管理庫存**： 使品牌能夠有效地追蹤咖啡豆的庫存狀況，包括進貨、銷售和庫存管理等。

* **前台購物車**： 顧客可以輕鬆地瀏覽和選購咖啡豆，並將它們添加到購物車中進行結算。

* **後台上架**： 管理員可以輕鬆地在後台管理系統中上架新的咖啡豆產品，設置價格、描述和*其他相關信息。

* **訂單追蹤**： 顧客可以追蹤他們的訂單狀態，包括付款確認、出貨通知和配送進度等。

* **金流串接**： 通過整合支付系統，顧客可以使用各種支付方式（如信用卡、PayPal 等）完成購買。


本專案的建立旨在幫助品牌專注於咖啡豆的研發和生產，同時提供給商家一個方便、輕鬆的網站伺服器。

## 🧐 Features - 專案功能 <a name = "features"></a>

  * 消費者 CRUD - 商品瀏覽、加入購物車、創建訂單、結帳付款、訂單瀏覽
  * 管理員 CRUD - 商品管理、商品分類管理、訂單管理、用戶權限管理、發送郵件
  * 整合 mocha / chai / supertest 完成單元測試
  * 整合 Sequelize 實作資料庫的管理與操作
  * 整合 image，檔案預先載入圖片，實作上傳圖片功能
  * 整合 cors 實作前後端分離跨域
  * 透過 藍新科技 串接API，實作線上刷卡
  * 透過 nodemailer 發送郵件，結合handlebars實現郵件模板
  * 透過 passport 實作google、facebook第三方登入
  * 採用 JWT & cookies httpOnly 實作跨域認證
  * 採用 multer 對接前後端檔案程式
  * 採用 bcrypt 處理使用者密碼
  * 採用 dotenv 設定環境變數

## 🗃️ MySQL - 資料庫架構規劃

<img width=600px height=600px src="https://github.com/shccgxqp/WCoffeeBack/blob/main/ERD.png?raw=true" alt="MySQL ERD">

## 💡 API Reference - 格式規範

- [PostMan](https://documenter.getpostman.com/view/24870092/2sA2xpTUwA) - 專案的RESTful API 文件，使用PostMan編寫及測試。


## ⛏️ Built Using - 主要使用  <a name = "built_using"></a>

- [MySQL](https://www.mysql.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment


## ⚙️ Installing - 專案安裝流程

1. 打開你的 terminal，Clone 此專案至本機電腦
   
```
git clone https://github.com/shccgxqp/WCoffeeBack
```
2. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd WCoffeeBack
```

3. 安裝 npm 套件，下載專案相依套件

```
npm install
```

4. 環境變數設定

```
JWT_SECRET= 
CORS_ORIGIN= 前端網址
FACEBOOK_CLIENT_ID= FB金鑰ID
FACEBOOK_CLIENT_SECRET= FB金鑰密碼
FACEBOOK_CALLBACK_URL=  FB金鑰回傳網址
GOOGLE_CLIENT_ID= GL金鑰ID
GOOGLE_CLIENT_SECRET= GL金鑰密碼
GOOGLE_CALLBACK_URL= GL金鑰回傳網址
MERCHANTID= 藍新金流商店代號
HASHKEY= 藍新金流Hashkey
HASHIV= 藍新金流Hashiv
VERSION=2.0
RETURNURL= 購買成功使用者端網址
NOTIFYURL= 購買成功伺服器端網址
PayGateWay= https://ccore.newebpay.com/MPG/mpg_gateway
```

1. 資料庫設定、建立種子檔案

新建兩個資料庫名稱為：wang_coffee、wang_coffee_test

並更新 /config/config.json 的資料庫連線設定，最後執行 migration 建立   

```
create database wang_coffee  //建立dev資料庫

create database wang_coffee_test  //建立test資料庫

npx sequelize db:migrate  //建立資料庫

npx sequelize db:seed:all  //建立種子檔案
```

6. 測試本專案使用 Mocha 做單元測試

```
npm run test
```

1. 啟動應用程式，執行 app.js 檔案

```
npm run dev
```

現在，可以開啟任一瀏覽器瀏覽器輸入 http://localhost:3060 開始查看囉！

## 🛠️ 更新計畫 - 未來將更新的功能
* 連結財政部電子發票API
* 串接第三方物流
* 透過數據分析，智能推薦喜愛的風味與烘培度

## 📝 網站開發紀錄

更多的開方中記錄，請點擊查看。
- [Notion](https://wang-yuan-chen.notion.site/Wang-Coffee-4030507d9b35426a9c9cbfd34f91c6ce?pvs=4) - 主要放設計時紀錄的每日任務以及實作功能時繪製的流程圖。