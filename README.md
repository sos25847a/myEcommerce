# **Ecommerce - 電商網站**

## **專案概述**
本專案是一個基於 **Spring Boot** 和 **Angular** 的電商系統，提供 **商品管理、用戶登入、訂單紀錄、支付系統** 等功能。  
後端使用 **Spring Boot** 提供 **RESTful API**，前端利用 **Angular** 進行頁面渲染與數據交互。

---

## **1. 環境需求**
請確保安裝以下環境，以便成功執行專案：

- **後端環境**
  - JDK 17
  - MySQL  

- **前端環境**
  - Node.js(建議版本16)
  - npm
  - TypeScript (tsc)

---

## **2. 技術棧**
### **後端技術**（Spring Boot）
- **Spring Boot** - 構建 RESTful API，負責商品、用戶、訂單等資料的 **CRUD** 操作，實現三層架構（Controller, Service, Repository）。
- **Spring Security + JWT + Okta** - 用戶身份驗證登入及管理。
- **Spring Data JPA + MySQL** - 資料庫操作，設計並管理 **商品、用戶、訂單** 等資料表。
- **Stripe API** - 線上支付功能，處理訂單付款。
- **TLS/SSL** - 確保前後端 API 安全傳輸。

### **前端技術**（Angular）
- **Angular (TypeScript, HTML, CSS, Bootstrap)** - 前端框架，負責頁面開發與與後端 API 交互。
- **Bootstrap + 自訂 CSS** - 設計 UI。
- **RxJS (Observables)** - 處理非同步數據交互。
- **Okta 2.0** - 身分驗證機制，與後端配合實現安全登入驗證。
- **TLS/SSL** - 確保前後端 API 安全傳輸。

## **3. 運行專案**
### **1. 後端**
1. **配置 MySQL 資料庫**
 - 確保MySQL服務運行，並匯入或複製資料庫ecommerce.sql
2. **設定環境變數**
- 在application.properties中，請確保您的資料庫已與後端連結，並確保Okta 和 Stripe 的變數未更動且已正確填寫。
3. **啟動後端**
- 運行EcommerceApplication

後端將運行在 ``` https://localhost:8443 ```
您可以使用postman等測試軟體測試後端REST API。

例如：
```GET https://localhost:8443/api/products```  查看所有商品

   
### **2. 前端**
1.  **安裝依賴（如果是第一次運行）**
   - ```cd frontend/angular-ecommerce```
   - ```npm install``` 安裝所有依賴
2. **啟動後端**
  - ```cd frontend/angular-ecommerce```
  - ```npm start``` 運行
前端將運行在 ```https://localhost:4200``` 


## **4. 專案演示**



