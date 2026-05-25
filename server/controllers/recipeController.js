const Groq = require("groq-sdk");
const Recipe = require("../models/Recipe");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ FIXED MODEL
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const TEXT_MODEL = "llama-3.1-8b-instant";

// ── ANALYZE IMAGE ────────────────────────────────────────────
const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("Image received:", req.file.originalname);

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify food ingredients in this image. Return ONLY a JSON array. Example: [\"tomato\",\"onion\"]",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
    });

    const text = completion.choices[0].message.content.trim();

    let ingredients;
    try {
      ingredients = JSON.parse(text);
    } catch {
      ingredients = text
        .replace(/```json|```/g, "")
        .replace(/\[|\]|"/g, "")
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    console.log("Detected ingredients:", ingredients);

    res.json({
      success: true,
      ingredients,
    });
  } catch (error) {
    console.error("🔥 REAL ERROR:", error); // IMPORTANT

    res.status(500).json({
      error: error.message || "Failed to analyze image",
    });
  }
};

// ── GENERATE RECIPE ──────────────────────────────────────────
const generateRecipe = async (req, res) => {
  try {
    const { ingredients = [], dietaryPreference = "" } = req.body;

    if (!ingredients.length) {
      return res.status(400).json({ error: "No ingredients provided" });
    }

    const completion = await groq.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        {
          role: "user",
          content: `
Create a recipe using: ${ingredients.join(", ")}
Diet: ${dietaryPreference || "none"}

Return ONLY JSON:
{
  "title": "",
  "ingredients": [{ "name": "", "quantity": "" }],
  "instructions": [{ "step": 1, "description": "" }],
  "nutrition": {
    "calories": "",
    "protein": "",
    "carbs": "",
    "fat": "",
    "fiber": ""
  },
  "servings": "",
  "prepTime": "",
  "cookTime": "",
  "dietaryTags": [],
  "difficulty": "",
  "detectedIngredients": [],
  "servingSuggestions": []
}

Important:
difficulty must be only "Easy", "Medium", or "Hard".
dietaryTags must contain only: vegan, vegetarian, keto, gluten-free, dairy-free, low-carb, high-protein, paleo.
`,
        },
      ],
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json|```/g, "").trim();

    const recipe = JSON.parse(text);

    // ✅ Fix difficulty
    const d = (recipe.difficulty || "").toLowerCase();

    if (d === "easy") {
      recipe.difficulty = "Easy";
    } else if (d === "hard") {
      recipe.difficulty = "Hard";
    } else {
      recipe.difficulty = "Medium";
    }

    // ✅ Fix dietary tags
    const allowedTags = [
      "vegan",
      "vegetarian",
      "keto",
      "gluten-free",
      "dairy-free",
      "low-carb",
      "high-protein",
      "paleo",
    ];

    recipe.dietaryTags = (recipe.dietaryTags || []).filter((tag) =>
      allowedTags.includes(tag)
    );

    // ✅ Make sure detected ingredients are saved
    recipe.detectedIngredients = ingredients;

    res.json({ recipe });
  } catch (error) {
    console.error("Generate error:", error);

    res.status(500).json({
      error: error.message || "Failed to generate recipe",
    });
  }
};
// ── SUGGESTIONS ──────────────────────────────────────────────
const generateMultipleRecipes = async (req, res) => {
  try {
    const { ingredients = [] } = req.body;

    const completion = await groq.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        {
          role: "user",
          content: `Give 5 recipe names using: ${ingredients.join(", ")}.
Return ONLY JSON array.`,
        },
      ],
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json|```/g, "");

    const suggestions = JSON.parse(text);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};

// ── SAVE ─────────────────────────────────────────────────────
const saveRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

// ── FETCH ────────────────────────────────────────────────────
const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });
    res.json(recipe);
  } catch {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete" });
  }
};

module.exports = {
  analyzeImage,
  generateRecipe,
  generateMultipleRecipes,
  saveRecipe,
  getSavedRecipes,
  getRecipeById,
  deleteRecipe,
};