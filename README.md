# Todo with DynamoDB  

This is a full-stack Todo application built with [Next.js](https://nextjs.org), React, and AWS DynamoDB for managing tasks with CRUD operations.  

---

## 🚀 Getting Started  

### 🔹 1. Clone the Repository  

```bash
git clone https://github.com/touseef0707/Todo-with-DynamoDB.git
cd Todo-with-DynamoDB
```

---

### 🔹 2. Install Dependencies  

```bash
npm install
# or
yarn install
```

---

### 🔹 3. Set Up Environment Variables  

Create a `.env.local` file in the root of the project and add your AWS credentials and table names:  

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_DYNAMO_USERS_TABLE=Users
AWS_DYNAMO_TODOS_TABLE=Todos
NEXTAUTH_SECRET=your-random-secret
```

---

### 🔹 4. Configure DynamoDB  

Go to the [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/) and create the following tables:  

#### **Users Table**  
- **Table name**: `Users`  
- **Partition Key**: `userId` (String)  

#### **Todos Table**  
- **Table name**: `Todos`  
- **Partition Key**: `todoId` (String)  
- **Global Secondary Index (GSI)**:  
  - **Partition Key**: `userId` (String)  

---

### 🔹 5. Run the Development Server  

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.  

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.  

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.  

---

## 📖 Learn More  

To learn more about Next.js and DynamoDB, check out:  

- [📜 Next.js Documentation](https://nextjs.org/docs)  
- [📚 Learn Next.js](https://nextjs.org/learn)  
- [📖 DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/index.html)  

---

## 🚢 Deploy on Vercel  

The easiest way to deploy your Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).  

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.  

---

## 📜 License  

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it as per the terms of the license.  

---
