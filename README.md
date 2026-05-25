# 🍳 AI Recipe Generator — Intelligent Cooking from Images

An AI-powered full-stack application that transforms food images into structured, personalized recipes.

---

## 🚀 The Problem

Problem Identification
Subtitle: The Current Problem in Home Cooking

Every day, millions of people open their fridge, stare at random ingredients, and have no idea what to cook. The existing support system for home cooks is fundamentally broken:

No idea what to cook — People waste time trying to mentally combine random ingredients into a meal, often giving up and ordering food instead.
Food wastage — Ingredients go bad because people don’t know what recipes can be made from what’s already available in the kitchen.
Dietary restrictions go unmet — People with specific requirements (vegan, keto, gluten-free, high-protein) cannot quickly find suitable recipes for the ingredients they already have.
Recipe search doesn’t help — Traditional recipe websites require you to know what you want to cook before you search. They don’t work in reverse — starting from ingredients.
Can’t describe ingredients digitally — People standing in front of a fridge cannot easily type out every ingredient they see. A photo is the most natural way to communicate “what’s here.”
No personalization or nutrition data — Standard recipe books don’t tell you the calories, macros, or dietary tags for the specific combination of ingredients you have on hand.

## 💡 The Solution

We are building an AI-powered recipe generation platform that starts from a photo and ends with a fully structured, personalized recipe.

Problem	Our Solution
Don’t know what to cook	AI generates a recipe from detected ingredients
Food goes to waste	Use exactly what you already have at home
Can’t type out all ingredients	Upload a photo — AI detects everything in it
Dietary restrictions	Filter by vegan, keto, gluten-free, and 5 more options
No nutrition info	Every generated recipe includes full macro breakdown
Too many choices	Get 3 curated suggestions before picking one to expand
Recipes get forgotten	Save recipes to MongoDB for permanent access
Specifically, we are solving:

Image-to-ingredient detection — Using Groq Vision (LLaMA 4 Scout) to identify every ingredient visible in a photo.
Instant structured recipe generation — Using Groq AI (LLaMA 3.3 70B) to create a complete recipe from detected ingredients, with steps, quantities, and nutrition.
Multiple suggestions before commitment — Generating 3 quick recipe titles and descriptions so the user can choose before generating the full recipe.
Dietary preference filtering — Applying a dietary constraint (vegan, keto, etc.) to every AI generation request.
Persistent recipe storage — Saving full recipes to MongoDB with search, filter, and delete capabilities.
Slide 3: Project Introduction
AI Recipe Generator is a full-stack web application built on the MERN stack (MongoDB, Express, React, Node.js). A user uploads a photo of food or ingredients, and the app detects what’s in the photo, lets the user adjust the ingredient list, optionally filter by dietary preference, and then generates a complete, structured recipe via AI.

Under the hood, two Groq AI services power the application:

Groq Vision (LLaMA 4 Scout) analyzes the uploaded food photo and returns a list of detected ingredients.
Groq Text (LLaMA 3.3 70B) generates full recipes or quick recipe suggestions from those ingredients, with dietary preference applied.
All generated recipes can be saved to MongoDB Atlas, giving users a personal, searchable, filterable recipe book.

There is no authentication in this app — it is a single-user tool focused entirely on the core AI-powered cooking workflow.

---

## 🧠 Application Flow
   User Uploads Image
        ↓
Groq Vision Model (AI)
        ↓
Detected Ingredients
        ↓
User Edits Ingredients
        ↓
Groq Text Model (AI)
        ↓
Generated Recipe
        ↓
Save to MongoDB

---

## ⚙️ Core Features

### 📸 Image-Based Ingredient Detection
- Upload food or ingredient image  
- AI detects visible ingredients  
- Powered by Groq Vision  

---

### ✏️ Editable Ingredient List
- Remove incorrect ingredients  
- Add missing ingredients  

---

### 🥗 Dietary Filtering
Supports:
- vegan  
- vegetarian  
- keto  
- gluten-free  
- dairy-free  
- low-carb  
- high-protein  
- paleo  

---

### 🍽️ AI Recipe Generation
Generates:
- Recipe title  
- Ingredients with quantities  
- Step-by-step instructions  
- Nutrition details  
- Cooking time  
- Difficulty level  
- Serving suggestions  

---

### 🔀 Recipe Suggestions
- Get multiple recipe ideas  
- Choose before generating full recipe  

---

### 💾 Save & Manage Recipes
- Save recipes to database  
- Search by title  
- Filter by diet & difficulty  
- Delete recipes  

---

## 🏗️ Architecture
Frontend (React + Vite)
      ↓
Axios API Calls
      ↓
Backend (Node.js + Express)
      ↓
Groq Vision → Ingredient Detection
Groq Text → Recipe Generation
      ↓
MongoDB → Store Recipes

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)  
- React Router  
- Context API  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Multer  
- dotenv  

### AI Integration
- Groq Vision Model  
- Groq Text Model  

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Bindu12-tnk/ai-recipe-generator.git
cd ai-recipe-generator    

2. Install Dependencies
cd server
npm install

cd ../client
npm install

3. Environment Variables

Create .env inside server:

PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
4. Run Project
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev

📊 Advantages
📸 Image-first interaction (natural input)
🥗 Reduces food wastage
🤖 Fully AI-driven
⚡ Fast and efficient
💾 Persistent storage
🎯 Personalized cooking

🚀 Future Improvements
🔐 User authentication
📱 Mobile responsive design
🌐 Recipe sharing
📸 Image history
🎨 Enhanced UI