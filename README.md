# MyEcommerce - 電商網站

## 專案概述
這是一個基於 Spring Boot 和 Angular 的全端電商專案，實現了商品管理、用戶登入、訂單紀錄、支付系統等功能。後端使用Spring Boot提供RESTful API，前端利用Angular進行頁面渲染與數據交互。

### 1. 環境需求
- Node.js
- npm 
- tsc   
- JDK 17
- MySQL 
### 2.技術棧:
 Spring Boot, Spring Data JPA, MySQL, Angular, Stripe, JWT, Okta
 ### 後端:
-使用 Spring Boot設計 RESTful API，負責商品、用戶、訂單等資料的 CRUD 操作，實現三層架構（Controller, Service, Repository），分離業務邏輯、資料庫操作與請求處理
-整合 Spring Security、 Okta2.0、JWT令牌，實現用戶身份驗證登入。
-使用 Spring Data JPA 和 MySQL 進行資料庫操作，設計並管理商品、用戶、訂單等資料表。
-使用 Stripe API 實現線上支付功能，處理訂單付款。
