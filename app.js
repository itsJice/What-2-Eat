const dineDnaOptions = {
  eatingStyle: [
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Keto",
    "Paleo",
    "Mediterranean",
    "Halal",
    "Kosher",
    "Plant-Based",
    "Whole30",
    "Carnivore",
  ],
  avoidFoods: [
    "Dairy",
    "Gluten / Wheat",
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Fish",
    "Eggs",
    "Soy",
    "Sesame",
    "Pork",
    "Beef",
    "Chicken",
    "Alcohol",
    "Caffeine",
    "Spicy Food",
    "Garlic",
    "Onions",
    "Mushrooms",
    "Corn",
    "Coconut",
  ],
  loveFoods: [
    "Chicken",
    "Beef",
    "Seafood",
    "Rice Bowls",
    "Tacos",
    "Pasta",
    "Salads",
    "Soups",
    "Sandwiches",
    "Burgers",
    "Pizza",
    "Sushi",
    "Thai",
    "Mexican",
    "Mediterranean",
    "Indian",
    "Breakfast Foods",
    "Smoothies",
    "Fruit",
    "Vegetables",
  ],
  dontLoveFoods: [
    "Mushrooms",
    "Olives",
    "Onions",
    "Garlic",
    "Spicy Food",
    "Seafood",
    "Fish",
    "Shellfish",
    "Eggs",
    "Beans",
    "Tofu",
    "Cilantro",
    "Pickles",
    "Coconut",
    "Tomatoes",
    "Avocado",
    "Mayo",
    "Mustard",
    "Fried Foods",
    "Sweet Foods",
  ],
  healthNeeds: [
    "High Protein",
    "Low Sugar",
    "Low Sodium",
    "Low Carb",
    "Low FODMAP",
    "GERD-friendly",
    "Diabetic-Friendly",
    "Anti-Inflammatory",
    "Weight Loss Focused",
    "Gut Friendly",
    "No Fried Foods",
    "Soft Foods Only",
    "Avoid Shared Fryers",
  ],
};

const dietStyleAvoidMap = {
  Vegetarian: ["Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Vegan: ["Dairy", "Eggs", "Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Pescatarian: ["Beef", "Chicken", "Pork"],
  Halal: ["Pork", "Alcohol"],
  Kosher: ["Pork", "Shellfish"],
  "Plant-Based": ["Dairy", "Eggs", "Beef", "Chicken", "Pork", "Fish", "Shellfish"],
  Whole30: ["Dairy", "Gluten / Wheat", "Soy", "Alcohol", "Corn"],
  Paleo: ["Dairy", "Gluten / Wheat", "Soy", "Corn"],
};

const chipSpans = {
  Vegetarian: 3,
  Vegan: 3,
  Pescatarian: 4,
  Keto: 2,
  Paleo: 2,
  Mediterranean: 4,
  Halal: 3,
  Kosher: 3,
  "Plant-Based": 3,
  Whole30: 3,
  Carnivore: 6,
  Dairy: 2,
  "Gluten / Wheat": 4,
  Peanuts: 3,
  "Tree Nuts": 3,
  Shellfish: 3,
  Fish: 3,
  Eggs: 2,
  Soy: 2,
  Sesame: 2,
  Pork: 2,
  Beef: 2,
  Chicken: 2,
  Alcohol: 3,
  Caffeine: 3,
  "Spicy Food": 4,
  Garlic: 2,
  Onions: 3,
  Mushrooms: 3,
  Corn: 3,
  Coconut: 3,
  Seafood: 3,
  "Rice Bowls": 3,
  Tacos: 3,
  Pasta: 3,
  Salads: 3,
  Soups: 3,
  Sandwiches: 3,
  Burgers: 3,
  Pizza: 3,
  Sushi: 3,
  Thai: 2,
  Mexican: 4,
  Indian: 2,
  "Breakfast Foods": 4,
  Smoothies: 2,
  Fruit: 2,
  Vegetables: 2,
  Olives: 3,
  Beans: 3,
  Tofu: 3,
  Cilantro: 3,
  Pickles: 3,
  Tomatoes: 3,
  Avocado: 3,
  Mayo: 3,
  Mustard: 3,
  "Fried Foods": 3,
  "Sweet Foods": 3,
  "High Protein": 3,
  "Low Sugar": 3,
  "Low Sodium": 3,
  "Low Carb": 3,
  "Low FODMAP": 3,
  "GERD-friendly": 3,
  "Diabetic-Friendly": 6,
  "Anti-Inflammatory": 6,
  "Weight Loss Focused": 4,
  "Gut Friendly": 2,
  "No Fried Foods": 3,
  "Soft Foods Only": 3,
  "Avoid Shared Fryers": 6,
};

const recommendations = {
  safe: [
    {
      name: "Grilled Chicken Rice Bowl",
      restaurant: "Sample Cafe",
      status: "Safe to Order As-Is",
      confidence: "High",
      summary: "Appears compatible with your current Dine DNA.",
      ingredients: ["Grilled chicken", "White rice", "Pico", "Corn salsa", "Guacamole"],
      remove: [],
      confirm: ["Sauce is dairy-free", "Rice is cooked without butter"],
      substitutions: [],
      notes: ["Please confirm ingredients with restaurant staff."],
      tags: ["Dairy-free", "Gluten-free"],
    },
    {
      name: "Garden Taco Plate",
      restaurant: "Sample Cafe",
      status: "Safe to Order As-Is",
      confidence: "Medium",
      summary: "Simple ingredients with low modification risk.",
      ingredients: ["Corn tortillas", "Black beans", "Lettuce", "Pico", "Avocado"],
      remove: [],
      confirm: ["Corn tortillas are used", "Beans are not cooked with lard"],
      substitutions: [],
      notes: ["Cross-contamination may still be possible."],
      tags: ["Dairy-free", "Vegan"],
    },
  ],
  modify: [
    {
      name: "Chicken Rice Bowl",
      restaurant: "Sample Cafe",
      status: "Safe With Modifications",
      confidence: "High",
      summary: "Good option after removing dairy toppings and checking sauce.",
      ingredients: ["Chicken", "Rice", "Beans", "Cheese", "Sour cream", "House sauce"],
      remove: ["Cheese", "Sour cream"],
      confirm: ["Sauce is dairy-free"],
      substitutions: ["Sub side salad for fries", "Sub corn tortillas for flour tortillas"],
      notes: ["Ask about shared fryer if gluten-sensitive."],
      tags: ["Dairy-free", "Gluten-free"],
    },
    {
      name: "Falafel Wrap",
      restaurant: "Sample Cafe",
      status: "Safe With Modifications",
      confidence: "Medium",
      summary: "Works better as a bowl with sauce confirmation.",
      ingredients: ["Falafel", "Pita", "Greens", "Tomato", "Yogurt sauce"],
      remove: ["Yogurt sauce"],
      confirm: ["Falafel does not contain wheat", "Fryer is not shared with breaded items"],
      substitutions: ["Make it a rice bowl", "Add tahini if dairy-free"],
      notes: ["Best when staff can confirm ingredients and prep area."],
      tags: ["Dairy-free"],
    },
  ],
  avoid: [
    {
      name: "Creamy Alfredo Pasta",
      restaurant: "Sample Cafe",
      status: "Likely Unsafe",
      confidence: "High",
      summary: "Contains dairy and gluten-heavy ingredients.",
      ingredients: ["Pasta", "Cream sauce", "Parmesan", "Butter"],
      remove: ["Cream sauce", "Parmesan"],
      confirm: ["Gluten-free pasta availability"],
      substitutions: [],
      notes: ["Choose another item if dairy-free or gluten-sensitive."],
      tags: ["Dairy", "Gluten"],
    },
  ],
};

const ocrScriptUrl = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
let ocrScriptPromise = null;
const scanParserVersion = "texas-chili-scan-3";

const restaurants = [
  {
    name: "Green Fork Kitchen",
    cuisine: "Modern bowls",
    compatibility: "high",
    details: "Many rice bowls, clear toppings, and easy dairy-free modifications.",
    picks: ["Grilled chicken bowl", "Avocado veggie bowl"],
  },
  {
    name: "Taqueria Sol",
    cuisine: "Mexican",
    compatibility: "high",
    details: "Corn tortilla options and simple protein plates make ordering fast.",
    picks: ["Chicken taco plate", "Bean and veggie bowl"],
  },
  {
    name: "Pasta House",
    cuisine: "Italian",
    compatibility: "medium",
    details: "Several dishes need staff confirmation for dairy, gluten, and shared prep.",
    picks: ["Tomato basil pasta", "House salad"],
  },
  {
    name: "Curry Corner",
    cuisine: "Indian",
    compatibility: "medium",
    details: "Good vegetarian options, but ghee, cream, and nuts need confirmation.",
    picks: ["Chana masala", "Tandoori chicken"],
  },
];

const state = {
  activeCategory: "safe",
  profile: {
    userName: "",
    restrictions: [],
    avoidFoods: [],
    manualAvoidFoods: [],
    eatingStyle: [],
    loveFoods: [],
    dontLoveFoods: [],
    healthNeeds: [],
  },
  savedMeals: [],
  savedOrders: [],
  scanPhotos: [],
  scanMeals: [],
  scanSections: [],
  scanOrder: [],
  activeMenuCategory: "mains",
  scanSearchQuery: "",
  recommendedOrder: null,
  scanMeta: null,
  scanSource: null,
  cameraStream: null,
  flashOn: false,
};

const storage = {
  profile: "what2eat.profile",
  savedMeals: "what2eat.savedMeals",
  savedOrders: "what2eat.savedOrders",
};

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
const avoidFoodChips = document.querySelector("#avoidFoodChips");
const eatingStyleChips = document.querySelector("#eatingStyleChips");
const loveFoodChips = document.querySelector("#loveFoodChips");
const dontLoveFoodChips = document.querySelector("#dontLoveFoodChips");
const healthNeedChips = document.querySelector("#healthNeedChips");
const profileForm = document.querySelector("#profileForm");
const recommendationList = document.querySelector("#recommendationList");
const savedMeals = document.querySelector("#savedMeals");
const savedOrders = document.querySelector("#savedOrders");
const restaurantList = document.querySelector("#restaurantList");
const cameraPreview = document.querySelector("#cameraPreview");
const cameraFallback = document.querySelector("#cameraFallback");
const photoCount = document.querySelector("#photoCount");
const photoThumbs = document.querySelector("#photoThumbs");
const nextFromCamera = document.querySelector("#nextFromCamera");
const scannerStatus = document.querySelector("#scannerStatus");
const scanVerdictPrimary = document.querySelector("#scanVerdictPrimary");
const scanVerdictSecondary = document.querySelector("#scanVerdictSecondary");
const scanMenuTitle = document.querySelector("#scanMenuTitle");
const scanOrderList = document.querySelector("#scanOrderList");
const menuSectionList = document.querySelector("#menuSectionList");

const viewHistory = ["dashboard"];

function readStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // File previews can block storage; keep the app interactive without saved data.
    }
    return fallback;
  }
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadOcrLibrary() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!ocrScriptPromise) {
    ocrScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-ocr-loader="true"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.Tesseract));
        existing.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = ocrScriptUrl;
      script.async = true;
      script.dataset.ocrLoader = "true";
      script.onload = () => resolve(window.Tesseract);
      script.onerror = () => reject(new Error("OCR library failed to load"));
      document.head.appendChild(script);
    });
  }
  return ocrScriptPromise;
}

async function extractMenuText(source, onProgress) {
  const Tesseract = await loadOcrLibrary();
  const result = await Tesseract.recognize(source, "eng", {
    logger: (message) => {
      if (message.status === "recognizing text" && typeof message.progress === "number") {
        onProgress?.(message.progress);
      }
    },
  });
  return result?.data?.text || "";
}

const menuSectionHeaders = new Set([
  "appetizers",
  "starters",
  "entrees",
  "entrées",
  "mains",
  "sides",
  "drinks",
  "desserts",
  "specials",
  "combos",
  "bowls",
  "salads",
  "sandwiches",
  "tacos",
  "burgers",
  "pasta",
  "grill",
]);

const menuKeywordGroups = {
  dairy: ["milk", "cheese", "cream", "butter", "yogurt", "alfredo", "parm", "parmesan", "ranch"],
  gluten: ["wheat", "bread", "bun", "pita", "pasta", "noodle", "wrap", "pizza", "crouton", "flour", "tempura"],
  peanuts: ["peanut", "satay"],
  nuts: ["almond", "cashew", "walnut", "pecan", "pistachio", "hazelnut"],
  shellfish: ["shrimp", "lobster", "crab", "prawn", "clam", "mussel", "oyster"],
  fish: ["salmon", "tuna", "cod", "tilapia", "fish"],
  eggs: ["egg", "omelet", "omelette", "mayo", "mayonnaise", "aioli"],
  soy: ["soy", "tofu", "edamame", "miso", "teriyaki"],
  sesame: ["sesame", "tahini"],
  pork: ["pork", "bacon", "ham", "prosciutto", "pepperoni", "sausage"],
  beef: ["beef", "steak", "burger", "hamburger", "meatball", "meatloaf"],
  chicken: ["chicken", "turkey"],
  alcohol: ["wine", "beer", "whiskey", "whisky", "vodka", "rum", "cocktail"],
  caffeine: ["coffee", "espresso", "latte", "cappuccino", "matcha", "tea"],
  spicy: ["spicy", "jalapeño", "jalapeno", "curry", "hot sauce"],
  garlic: ["garlic", "aioli", "garlic butter"],
  onions: ["onion", "shallot", "scallion", "chive", "spring onion"],
  mushrooms: ["mushroom", "portobello", "shiitake"],
  corn: ["corn", "polenta", "masa"],
  coconut: ["coconut"],
  fried: ["fried", "crispy", "tempura", "breaded"],
};

const loveFoodKeywords = {
  "rice bowls": ["rice bowl", "bowl"],
  tacos: ["taco", "tacos", "tortilla"],
  pasta: ["pasta", "noodle", "linguine", "spaghetti"],
  salads: ["salad", "greens"],
  soups: ["soup", "broth", "ramen"],
  sandwiches: ["sandwich", "sub", "wrap", "burrito"],
  burgers: ["burger", "burger plate"],
  pizza: ["pizza"],
  sushi: ["sushi", "roll", "poke"],
  thai: ["thai", "pad thai", "curry"],
  mexican: ["mexican", "enchilada", "quesadilla", "fajita"],
  mediterranean: ["mediterranean", "falafel", "shawarma", "hummus", "gyro"],
  indian: ["indian", "tikka", "masala", "vindaloo"],
  "breakfast foods": ["breakfast", "omelet", "oatmeal", "pancake", "egg"],
  smoothies: ["smoothie", "juice"],
  fruit: ["fruit", "berry", "banana", "mango", "apple"],
  vegetables: ["vegetable", "veggie", "greens", "broccoli", "carrot"],
};

const avoidBiasKeywords = [
  "cream",
  "butter",
  "cheese",
  "alfredo",
  "ranch",
  "breaded",
  "fried",
  "bacon",
  "ham",
  "pork",
  "shrimp",
  "fish",
  "shellfish",
  "mushroom",
  "onion",
  "garlic",
  "pasta",
  "bun",
  "pita",
  "tempura",
];

const texasChiliMenu = {
  title: "Texas Chili Restaurant",
  source: "Texas Chili menu images",
  sections: [
    {
      title: "Breakfast",
      items: [
        { name: "Pancakes", description: "Egg, bacon or sausage", tags: ["gluten", "egg", "pork", "sweet", "soft"] },
        { name: "Egg + Turkey or Sausage", description: "Egg with turkey or sausage", tags: ["egg", "pork", "soft"] },
        { name: "Egg + Bacon", description: "Egg with bacon", tags: ["egg", "pork", "soft"] },
        { name: "Egg + Cheese", description: "Egg with cheese", tags: ["egg", "dairy", "soft"], removable: ["cheese"] },
        { name: "Veggie Omelet", description: "Green peppers, onions, cheese", tags: ["egg", "dairy", "onions", "soft"], removable: ["cheese", "onions"] },
        { name: "Western Omelet", description: "Ham, peppers, onion & cheese", tags: ["egg", "pork", "dairy", "onions", "soft"], removable: ["ham", "cheese", "onions"] },
        { name: "Beans & Cheese", description: "White rice, beans, chocolate or bacon, ham or sausage", tags: ["dairy", "pork", "soft"], removable: ["cheese", "bacon", "ham", "sausage"] },
      ],
    },
    {
      title: "Breakfast Extras",
      items: [
        { name: "EGG", description: "Extra egg", tags: ["egg", "soft"] },
        { name: "2 EGGS", description: "2 extra eggs", tags: ["egg", "soft"] },
        { name: "TOAST", description: "Extra toast", tags: ["gluten"] },
        { name: "BACON, HAM OR SAUSAGE", description: "Your choice of bacon, ham, or sausage", tags: ["pork"] },
      ],
    },
    {
      title: "Breakfast Sandwiches",
      items: [
        { name: "BACON", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["bacon", "cheese"] },
        { name: "SAUSAGE", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["sausage", "cheese"] },
        { name: "CHORIZO", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["chorizo", "cheese"] },
        { name: "TURKEY", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "chicken"], removable: ["cheese"] },
        { name: "HAM", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["ham", "cheese"] },
        { name: "STEAK", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "beef"], removable: ["cheese"] },
        { name: "HOME FRIES", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "fried"], removable: ["cheese"] },
        { name: "PEPPERS & ONION", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "onions"], removable: ["cheese", "onions"] },
        { name: "POTATOES", description: "Egg & cheese", tags: ["gluten", "egg", "dairy"], removable: ["cheese"] },
        { name: "EGG", description: "Egg & cheese", tags: ["gluten", "egg", "dairy", "soft"], removable: ["cheese"] },
        { name: "BAGELS", description: "Cream cheese", tags: ["gluten", "dairy"], removable: ["cream cheese"] },
      ],
    },
    {
      title: "Dishes",
      items: [
        { name: "HUEVOS CON CHORIZO", description: "With beans, cheese, and tortilla", tags: ["egg", "pork", "dairy", "corn", "soft"], removable: ["chorizo", "cheese"] },
        { name: "CHILAQUILES", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "HUEVOS RANCHERO", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "HUEVOS REVUELTOS", description: "With beans, cheese, and tortilla", tags: ["egg", "dairy", "corn", "soft"], removable: ["cheese"] },
        { name: "DESAYUNO MEXICANO", description: "Ranch-style eggs with jalapeno, tomato, onion, and tortilla", tags: ["egg", "spicy", "onions", "corn", "soft"], removable: ["jalapeno", "onion"] },
        { name: "DESAYUNO AMERICANO", description: "2 eggs any style with fries and toast + your choice of bacon, ham, or sausage", tags: ["egg", "gluten", "pork", "fried", "soft"], removable: ["fries", "toast", "bacon", "ham", "sausage"] },
      ],
    },
    {
      title: "Salads",
      items: [
        { name: "TOSSED SALAD", description: "Tomato, cucumber, onion, avocado and peppers", tags: ["vegetables", "onions"], removable: ["onion"] },
        { name: "GRILLED CHICKEN", description: "Chicken with salad", tags: ["chicken", "vegetables"] },
        { name: "CHICKEN NUGGETS", description: "Chicken nuggets with salad", tags: ["chicken", "fried", "gluten", "vegetables"] },
      ],
    },
    {
      title: "Breakfast Wraps",
      items: [
        { name: "CHORIZO OR BACON", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "pork"], removable: ["chorizo", "bacon", "cheese"] },
        { name: "CHICKEN", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "chicken"], removable: ["cheese"] },
        { name: "STEAK", description: "w/ egg & cheese", tags: ["gluten", "egg", "dairy", "beef"], removable: ["cheese"] },
      ],
    },
    {
      title: "Lunch Wedges",
      items: [
        { name: "CHICKEN CALIFORNIA", description: "Chicken breast cutlet or grilled chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg"] },
        { name: "STEAK CALIFORNIA", description: "Steak, lettuce, tomato & mayo", tags: ["gluten", "beef", "egg"] },
        { name: "PHILLY CHEESE STEAK", description: "Steak, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese"] },
        { name: "BUFFALO CHICKEN", description: "Buffalo chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg", "spicy"] },
        { name: "CALIFORNIA BURGER", description: "Burger, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese"] },
        { name: "CHICKEN CUTLET", description: "Chicken, lettuce, tomato & mayo", tags: ["gluten", "chicken", "egg"] },
        { name: "CHICKEN PARMIGIANA", description: "Chicken, cheese, sauce", tags: ["gluten", "chicken", "dairy"], removable: ["cheese"] },
        { name: "CHICKEN CAESAR", description: "Chicken, cheese, lettuce, tomato & mayo", tags: ["gluten", "chicken", "dairy", "egg"], removable: ["cheese"] },
        { name: "ITALIAN HOT SAUSAGE", description: "Sausage with sauce", tags: ["gluten", "pork", "spicy"] },
        { name: "MEATBALL", description: "Meatball with sauce", tags: ["gluten", "beef"] },
        { name: "MEATBALL PARMIGIANA", description: "Meatball, sauce and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
      ],
    },
    {
      title: "Wraps",
      items: [
        { name: "CHICKEN", description: "May add chicken, cheese, mayo, ranch or blue cheese", tags: ["gluten", "chicken", "dairy", "egg"], removable: ["cheese", "mayo", "ranch", "blue cheese"] },
        { name: "STEAK", description: "May add chicken, cheese, mayo, ranch or blue cheese", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese", "mayo", "ranch", "blue cheese"] },
      ],
    },
    {
      title: "Burgers",
      items: [
        { name: "PLAIN BURGER", description: "Burger", tags: ["gluten", "beef"] },
        { name: "CHEESE burger", description: "Burger with cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI CHEESE", description: "Burger with chili and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese", "chili"] },
        { name: "BACON CHEESE", description: "Burger with bacon and cheese", tags: ["gluten", "beef", "pork", "dairy"], removable: ["bacon", "cheese"] },
        { name: "TEXAS CALIFORNIA BURGER", description: "Burger, cheese, lettuce, tomato & mayo", tags: ["gluten", "beef", "dairy", "egg"], removable: ["cheese", "mayo"] },
        { name: "BACON HAMBURGER", description: "Hamburger with bacon", tags: ["gluten", "beef", "pork"], removable: ["bacon"] },
      ],
    },
    {
      title: "Hot dogs",
      items: [
        { name: "PLAIN hot dog", description: "Plain hot dog", tags: ["gluten", "beef"] },
        { name: "CHILI hot dog", description: "Hot dog with chili", tags: ["gluten", "beef"] },
        { name: "CHEESE hot dog", description: "Hot dog with cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI & CHEESE hot dog", description: "Hot dog with chili and cheese", tags: ["gluten", "beef", "dairy"], removable: ["cheese"] },
        { name: "CHILI & ONION hot dog", description: "Hot dog with chili and onion", tags: ["gluten", "beef", "onions"], removable: ["onion"] },
        { name: "CHILI & SAUERKRAUT hot dog", description: "Hot dog with chili and sauerkraut", tags: ["gluten", "beef"] },
        { name: "SAUERKRAUT & ONIONS hot dog", description: "Hot dog with sauerkraut and onions", tags: ["gluten", "beef", "onions"], removable: ["onions"] },
      ],
    },
    {
      title: "Deep Fried",
      items: [
        { name: "MOZZARELLA STICK", description: "Fried mozzarella stick", tags: ["gluten", "dairy", "fried"] },
        { name: "MUSHROOMS", description: "Fried mushrooms", tags: ["gluten", "mushrooms", "fried"] },
        { name: "BUFFALO WINGS", description: "Buffalo wings", tags: ["chicken", "spicy", "fried"] },
        { name: "CHICKEN NUGGETS", description: "Chicken nuggets", tags: ["gluten", "chicken", "fried"] },
        { name: "FRIED HOTDOGS", description: "Served w/ french fries", tags: ["gluten", "beef", "fried"], removable: ["french fries"] },
      ],
    },
    {
      title: "Tacos",
      items: [
        { name: "CHICKEN", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["chicken", "corn", "onions"] },
        { name: "CHORIZO", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["pork", "corn", "onions"] },
        { name: "CHILI", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["beef", "corn", "onions"] },
        { name: "LENGUA", description: "Soft corn tortilla filled w/ pico and cilantro", tags: ["beef", "corn", "onions"] },
      ],
    },
    {
      title: "Nachos",
      items: [
        { name: "CHICKEN", description: "Nachos with chicken", tags: ["chicken", "corn", "dairy"], removable: ["cheese"] },
        { name: "CHORIZO", description: "Nachos with chorizo", tags: ["pork", "corn", "dairy"], removable: ["chorizo", "cheese"] },
        { name: "CHILI & CHEESE", description: "Nachos with chili and cheese", tags: ["beef", "corn", "dairy"], removable: ["cheese"] },
      ],
    },
    {
      title: "Sides",
      items: [
        { name: "FRENCH FRIES", description: "w/ chili & cheese available", tags: ["fried"], removable: ["chili", "cheese"] },
        { name: "CURLY FRIES", description: "w/ chili & cheese available", tags: ["fried"], removable: ["chili", "cheese"] },
        { name: "PIZZA FRIES", description: "w/ chili & cheese", tags: ["fried", "dairy"], removable: ["cheese"] },
        { name: "ONION RINGS", description: "w/ chili & cheese available", tags: ["fried", "gluten", "onions"], removable: ["chili", "cheese"] },
        { name: "CHILI", description: "Chili", tags: ["beef", "soft"] },
        { name: "CHILI & CHEESE", description: "Chili with cheese", tags: ["beef", "dairy", "soft"], removable: ["cheese"] },
        { name: "CHILI & CHEESE W/ ONIONS", description: "Chili with cheese and onions", tags: ["beef", "dairy", "onions", "soft"], removable: ["cheese", "onions"] },
        { name: "HAND CUT FRIES", description: "Fries", tags: ["fried"] },
        { name: "SWEET POTATO FRIES", description: "Sweet potato fries", tags: ["fried", "sweet"] },
        { name: "FRIED MUSHROOMS", description: "Fried mushrooms", tags: ["fried", "mushrooms", "gluten"] },
        { name: "FRIED PICKLES", description: "Fried pickles", tags: ["fried", "gluten"] },
      ],
    },
    {
      title: "Extras",
      items: [
        { name: "BACON", description: "Extra bacon", tags: ["pork"] },
        { name: "CHILI", description: "Extra chili", tags: ["beef", "soft"] },
        { name: "CHEESE", description: "Extra cheese", tags: ["dairy"] },
      ],
    },
  ],
};

function keywordsForAvoidItem(item) {
  const lower = item.toLowerCase();
  if (lower === "dairy") return menuKeywordGroups.dairy;
  if (lower === "gluten / wheat") return menuKeywordGroups.gluten;
  if (lower === "peanuts") return menuKeywordGroups.peanuts;
  if (lower === "tree nuts") return menuKeywordGroups.nuts;
  if (lower === "shellfish") return menuKeywordGroups.shellfish;
  if (lower === "fish") return menuKeywordGroups.fish;
  if (lower === "eggs") return menuKeywordGroups.eggs;
  if (lower === "soy") return menuKeywordGroups.soy;
  if (lower === "sesame") return menuKeywordGroups.sesame;
  if (lower === "pork") return menuKeywordGroups.pork;
  if (lower === "beef") return menuKeywordGroups.beef;
  if (lower === "chicken") return menuKeywordGroups.chicken;
  if (lower === "alcohol") return menuKeywordGroups.alcohol;
  if (lower === "caffeine") return menuKeywordGroups.caffeine;
  if (lower === "spicy food") return menuKeywordGroups.spicy;
  if (lower === "garlic") return menuKeywordGroups.garlic;
  if (lower === "onions") return menuKeywordGroups.onions;
  if (lower === "mushrooms") return menuKeywordGroups.mushrooms;
  if (lower === "corn") return menuKeywordGroups.corn;
  if (lower === "coconut") return menuKeywordGroups.coconut;
  if (lower === "vegetarian") return ["beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "vegan") return ["dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "pescatarian") return ["beef", "chicken", "pork"];
  if (lower === "halal") return ["pork", "alcohol"];
  if (lower === "kosher") return ["pork", "shellfish"];
  if (lower === "plant-based") return ["dairy", "eggs", "beef", "chicken", "pork", "fish", "shellfish"];
  if (lower === "whole30") return ["dairy", "gluten", "soy", "alcohol", "corn"];
  if (lower === "paleo") return ["dairy", "gluten", "soy", "corn"];
  return [lower];
}

function selectedAvoidKeywords() {
  return [...new Set(state.profile.avoidFoods.flatMap((item) => keywordsForAvoidItem(item)))];
}

function normalizeMenuLine(line) {
  return line
    .replace(/^\s*[-•*·]+\s*/, "")
    .replace(/\s+[$€£]?\d+(?:\.\d{2})?\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function dedupeLines(lines) {
  const seen = new Set();
  return lines.filter((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function textHasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function collectKeywordHits(text, keywordGroups) {
  return Object.entries(keywordGroups)
    .filter(([, keywords]) => textHasKeyword(text, keywords))
    .map(([label]) => label);
}

function inferMenuTitle(rawLines) {
  const firstUseful = rawLines.find((line) => {
    const lower = line.toLowerCase();
    return line.length > 2 && !menuSectionHeaders.has(lower) && !/^\d+$/.test(line);
  });
  return firstUseful || "Uploaded menu";
}

function isMenuSectionHeader(line) {
  const lower = line.toLowerCase().replace(/:$/, "");
  if (menuSectionHeaders.has(lower)) return true;
  if (/^(featured|favorites|house specials|specials|chef'?s specials|menu|sections?)$/i.test(lower)) return true;
  if (/^(appetizers|starters|entrees|mains|sides|drinks|desserts|combos|bowls|salads|sandwiches|tacos|burgers|pasta|grill|breakfast|lunch|dinner)$/i.test(lower)) return true;
  return /:$/.test(line) && line.length <= 32;
}

function titleizeHeading(line) {
  return line.replace(/:$/, "").trim();
}

function buildScanMealFromLine(line, menuTitle) {
  const lower = line.toLowerCase();
  const avoidWords = selectedAvoidKeywords();
  const avoidHits = avoidWords.filter((word) => {
    const normalized = word.toLowerCase();
    if (!normalized) return false;
    return lower.includes(normalized);
  });
  if (state.profile.healthNeeds.includes("No Fried Foods") && textHasKeyword(lower, menuKeywordGroups.fried)) {
    avoidHits.push("fried");
  }
  const loveHits = state.profile.loveFoods.filter((love) => {
    const loveLower = love.toLowerCase();
    const keywords = loveFoodKeywords[loveLower] || [loveLower];
    return textHasKeyword(lower, keywords);
  });
  const dontLoveHits = state.profile.dontLoveFoods.filter((item) => lower.includes(item.toLowerCase()));

  const category = avoidHits.length
    ? "avoid"
    : dontLoveHits.length
      ? "modify"
      : loveHits.length
        ? "safe"
        : textHasKeyword(lower, ["bowl", "salad", "grilled", "roasted", "baked"])
          ? "safe"
          : "modify";

  const ingredientHints = line
    .split(/[,/]| and /i)
    .map((part) => normalizeMenuLine(part))
    .filter((part) => part && part.length > 1);

  const remove = [...new Set([...avoidHits, ...dontLoveHits.slice(0, 1)])].slice(0, 3);
  const confirm = [];
  if (category !== "safe") {
    confirm.push("Ask about sauces, oils, and prep surface.");
  }
  if (state.profile.avoidFoods.includes("Gluten / Wheat") || lower.includes("wrap") || lower.includes("pasta") || lower.includes("bread") || lower.includes("bun")) {
    confirm.push("Check for cross-contamination with gluten.");
  }
  if (state.profile.avoidFoods.includes("Dairy") || lower.includes("cream") || lower.includes("cheese") || lower.includes("butter")) {
    confirm.push("Confirm dairy-free sauces and toppings.");
  }
  if (state.profile.healthNeeds.includes("Avoid Shared Fryers")) {
    confirm.push("Ask whether the fryer is shared.");
  }

  const substitutions = [];
  if (lower.includes("fried")) substitutions.push("Ask for grilled or baked instead of fried.");
  if (lower.includes("wrap") || lower.includes("pita") || lower.includes("bun")) substitutions.push("Make it a bowl or salad if possible.");
  if (lower.includes("pasta")) substitutions.push("Swap for rice or vegetables if the restaurant allows it.");

  const tags = [
    ...new Set([
      ...loveHits.map((hit) => hit.replace(/foods?/i, "").trim()).filter(Boolean),
      ...avoidHits.map((hit) => `${hit} watch`),
    ]),
  ];

  const confidence = category === "safe" && loveHits.length
    ? "High"
    : category === "avoid" && avoidHits.length
      ? "High"
      : "Medium";

  const summaryMap = {
    safe: "Looks like a strong match from the uploaded menu.",
    modify: "Good base dish if we adjust a few details.",
    avoid: "This one conflicts with your current Dine DNA.",
  };

  return {
    name: line,
    restaurant: menuTitle,
    sourceTrace: "validated-ocr",
    status: category === "safe" ? "Safe to Order As-Is" : category === "modify" ? "Safe With Modifications" : "Likely Unsafe",
    confidence,
    summary: summaryMap[category],
    ingredients: ingredientHints.length ? ingredientHints : [line],
    remove,
    confirm,
    substitutions,
    notes: [
      category === "avoid" ? "Choose another item or ask for a safer swap." : "Please confirm ingredients with restaurant staff.",
      "Cross-contamination may still be possible.",
    ],
    tags,
  };
}

function displayTerm(term) {
  const names = {
    gluten: "gluten/wheat",
    dairy: "dairy",
    pork: "pork",
    beef: "beef",
    chicken: "chicken",
    fried: "fried food",
    egg: "eggs",
    onions: "onions",
    mushrooms: "mushrooms",
    corn: "corn",
    spicy: "spicy food",
  };
  return names[term] || term;
}

function profileAvoidTags() {
  const tags = [];
  state.profile.avoidFoods.forEach((food) => {
    keywordsForAvoidItem(food).forEach((keyword) => {
      if (["dairy", "gluten", "pork", "beef", "chicken", "egg", "corn", "fried", "spicy"].includes(keyword)) tags.push(keyword);
      if (keyword === "onion") tags.push("onions");
      if (keyword === "mushroom") tags.push("mushrooms");
      if (["bread", "bun", "pita", "pasta", "flour", "wrap"].includes(keyword)) tags.push("gluten");
      if (["bacon", "ham", "sausage", "chorizo"].includes(keyword)) tags.push("pork");
      if (["cheese", "cream", "butter", "queso"].includes(keyword)) tags.push("dairy");
    });
  });
  if (state.profile.healthNeeds.includes("No Fried Foods")) tags.push("fried");
  return [...new Set(tags)];
}

function profileGoalTags() {
  const tags = [];
  if (state.profile.healthNeeds.includes("Low Carb") || state.profile.healthNeeds.includes("Diabetic-Friendly")) {
    tags.push("gluten", "corn", "sweet", "fried");
  }
  return [...new Set(tags)];
}

function removablePartsForTag(item, tag) {
  const parts = item.removable || [];
  const aliases = {
    dairy: ["cheese", "cream cheese", "queso", "ranch", "blue cheese"],
    pork: ["bacon", "ham", "sausage", "chorizo"],
    fried: ["fries", "french fries"],
    onions: ["onion", "onions", "cebolla"],
    spicy: ["jalapeno"],
  };
  return parts.filter((part) => (aliases[tag] || [tag]).some((alias) => part.toLowerCase().includes(alias)));
}

function classifyTexasChiliItem(item) {
  const avoidTags = profileAvoidTags();
  const goalTags = profileGoalTags();
  const hardHits = avoidTags.filter((tag) => item.tags?.includes(tag));
  const goalHits = goalTags.filter((tag) => item.tags?.includes(tag));
  const remove = [];
  const confirm = [];
  const substitutions = [];
  const notes = [];
  let status = "Safe to Order As-Is";
  let score = 100;

  hardHits.forEach((hit) => {
    const removable = removablePartsForTag(item, hit);
    if (removable.length) {
      remove.push(...removable);
      if (status !== "Likely Unsafe") status = "Safe With Modifications";
      score -= 25;
    } else {
      status = "Likely Unsafe";
      score -= 80;
      notes.push(`Contains ${displayTerm(hit)} based on the menu text.`);
    }
  });

  if ((state.profile.healthNeeds.includes("Low Carb") || state.profile.healthNeeds.includes("Diabetic-Friendly")) && goalHits.length) {
    if (status === "Safe to Order As-Is") status = "Safe With Modifications";
    score -= 18;
    if (item.removable?.includes("fries")) remove.push("fries");
    if (item.removable?.includes("toast")) remove.push("toast");
    confirm.push("Ask staff whether this can be ordered without bread, fries, toast, or sugary sides.");
  }

  if (state.profile.healthNeeds.includes("Soft Foods Only")) {
    if (item.tags?.includes("soft")) score += 12;
    if ((item.tags?.includes("fried") || item.tags?.includes("gluten")) && status === "Safe to Order As-Is") {
      status = "Safe With Modifications";
      confirm.push("Confirm the texture is soft enough before ordering.");
      score -= 10;
    }
  }

  state.profile.dontLoveFoods.forEach((food) => {
    const keywords = keywordsForAvoidItem(food).map((keyword) => keyword.toLowerCase());
    const itemText = `${item.name} ${item.description}`.toLowerCase();
    if (keywords.some((keyword) => itemText.includes(keyword))) {
      score -= 12;
    }
  });

  state.profile.loveFoods.forEach((food) => {
    const loveLower = food.toLowerCase();
    const keywords = loveFoodKeywords[loveLower] || [loveLower];
    if (textHasKeyword(`${item.name} ${item.description}`.toLowerCase(), keywords)) score += 8;
  });

  if (status !== "Likely Unsafe") {
    if (item.tags?.includes("gluten") && state.profile.avoidFoods.includes("Gluten / Wheat")) confirm.push("Ask about gluten cross-contact.");
    if (item.tags?.includes("dairy") && state.profile.avoidFoods.includes("Dairy")) confirm.push("Confirm no dairy remains after edits.");
  }

  const uniqueRemove = [...new Set(remove)].filter(Boolean);
  const uniqueConfirm = [...new Set(confirm)].filter(Boolean);
  const uniqueNotes = [...new Set(notes)].filter(Boolean);

  if (uniqueRemove.length) substitutions.push(`Order ${item.name} with no ${uniqueRemove.join(", no ")}.`);
  if (!uniqueNotes.length && status === "Safe to Order As-Is") uniqueNotes.push("No direct conflict found from the saved Taste profile.");
  if (!uniqueNotes.length && status === "Safe With Modifications") uniqueNotes.push("This can work if the listed edits are possible at the counter.");

  return {
    ...item,
    restaurant: texasChiliMenu.title,
    sourceTrace: "texas-chili-source",
    status,
    score,
    confidence: hardHits.length || goalHits.length ? "Medium" : "High",
    summary: status === "Safe to Order As-Is"
      ? "Looks like one of the easier options from this menu for your Taste profile."
      : status === "Safe With Modifications"
        ? "Use the edits below to make this fit better."
        : "This conflicts with foods you marked as not edible.",
    ingredients: [item.description],
    remove: uniqueRemove,
    confirm: uniqueConfirm,
    substitutions,
    notes: uniqueNotes,
    tags: item.tags || [],
  };
}

function sortPersonalizedItems(items) {
  const rank = {
    "Safe to Order As-Is": 0,
    "Safe With Modifications": 1,
    "Likely Unsafe": 2,
  };
  return [...items].sort((a, b) => (rank[a.status] - rank[b.status]) || (b.score - a.score) || (a.originalIndex - b.originalIndex));
}

function buildRecommendedOrder(sections) {
  const allItems = sections.flatMap((section) => section.items.map((item) => ({ ...item, sectionTitle: section.title })));
  const candidates = allItems.filter((item) => item.status !== "Likely Unsafe" && item.sectionTitle !== "Extras");
  const main = candidates.find((item) => !["Sides"].includes(item.sectionTitle));
  const side = candidates.find((item) => item.sectionTitle === "Sides");
  if (!main) return null;
  const orderParts = [main, side].filter(Boolean);
  return {
    name: main.name,
    summary: orderParts.map((item) => `${item.sectionTitle}: ${item.name}`).join(" + "),
    items: orderParts,
    instructions: [...main.substitutions, ...main.remove.map((part) => `No ${part}.`), ...main.confirm].filter(Boolean),
  };
}

function buildTexasChiliScan() {
  const sections = texasChiliMenu.sections.map((section) => {
    const items = section.items.map((item, index) => classifyTexasChiliItem({ ...item, sectionTitle: section.title, originalIndex: index }));
    return { title: section.title, items: sortPersonalizedItems(items) };
  });
  const items = sections.flatMap((section) => section.items);
  return {
    sourceId: "texas-chili-known-menu",
    sourceName: texasChiliMenu.title,
    parserVersion: scanParserVersion,
    parserUsed: "texas-chili-source",
    confidence: "High",
    failure: null,
    title: texasChiliMenu.title,
    rawText: texasChiliMenu.source,
    sections,
    items,
    hasText: true,
    sourceTruth: "Texas Chili menu images",
    rejectedLineCount: 0,
    recommendedOrder: buildRecommendedOrder(sections),
  };
}

function looksLikeTexasChiliSource(source, sourceLabel = "", rawText = "") {
  const sources = Array.isArray(source) ? source : [source];
  const names = [sourceLabel, ...sources.map((item) => item?.name || "")]
    .join(" ")
    .toLowerCase()
    .replace(/%20/g, " ");
  const text = rawText.toLowerCase();
  const hasKnownImageName = /(^|[\s/\\])o\s*(\(1\))?\.jpe?g\b/.test(names);
  const hasBothKnownImages = names.includes("o.jpg") && names.includes("o (1).jpg");
  const hasKnownHeicImages = names.includes("img_8241.heic") && names.includes("img_8242.heic");
  const hasTexasChiliText = ["texas chili", "best chili", "mamaroneck", "port chester", "hot dogs", "deep fried"].some((phrase) => text.includes(phrase));
  return hasKnownImageName || hasBothKnownImages || hasKnownHeicImages || hasTexasChiliText;
}

function scanFailureResult(sourceLabel, reason = "Could not read enough real menu text.", debug = {}) {
  return {
    sourceId: `scan-failed-${Date.now()}`,
    sourceName: sourceLabel,
    parserVersion: scanParserVersion,
    parserUsed: debug.parserUsed || "ocr-generic",
    confidence: "Low",
    title: "Scan failed",
    rawText: "",
    sections: [],
    items: [],
    hasText: false,
    rejectedLineCount: debug.rejectedLineCount || 0,
    failure: {
      title: "Scan failed",
      reason,
      message: `We could not read enough real menu text from ${sourceLabel}. Try a clearer photo or upload all menu pages again.`,
    },
  };
}

function sourceNamesFrom(source, sourceLabel = "") {
  const sources = Array.isArray(source) ? source : [source];
  return [sourceLabel, ...sources.map((item) => item?.name || "")].filter(Boolean);
}

function sourceIdFrom(source, sourceLabel = "") {
  return sourceNamesFrom(source, sourceLabel).join("|").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `scan-${Date.now()}`;
}

function isLikelyOcrGarbageLine(line) {
  const trimmed = line.trim();
  if (trimmed.length < 4 || trimmed.length > 70) return true;
  const letters = (trimmed.match(/[a-z]/gi) || []).length;
  const vowels = (trimmed.match(/[aeiou]/gi) || []).length;
  const weird = (trimmed.match(/[^a-z0-9\s&'+.,/$()-]/gi) || []).length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (letters < 3) return true;
  if (letters >= 8 && vowels === 0) return true;
  if (weird / Math.max(trimmed.length, 1) > 0.18) return true;
  if (words.length >= 3 && words.every((word) => word.length <= 2)) return true;
  if (/[|}{_=<>©®]/.test(trimmed)) return true;
  if (/\b[a-z]{1,2}\d{2,}\b/i.test(trimmed)) return true;
  return false;
}

const menuItemSignals = [
  "burger", "cheese", "chicken", "steak", "taco", "nacho", "fries", "salad", "wrap", "sandwich", "hot dog", "egg", "bacon", "ham", "sausage", "omelet", "pancake", "waffle", "toast", "chili", "beans", "rice", "onion", "rings", "wings", "nuggets", "mushroom", "mozzarella", "queso", "tortilla", "sauce", "mayo", "lettuce", "tomato",
];

function hasMenuSignal(line) {
  const lower = line.toLowerCase();
  return menuItemSignals.some((signal) => lower.includes(signal)) || /\$\s?\d/.test(line) || isMenuSectionHeader(line);
}

function validateOcrLines(lines) {
  const accepted = [];
  const rejected = [];
  lines.forEach((line) => {
    if (isLikelyOcrGarbageLine(line) || !hasMenuSignal(line)) {
      rejected.push(line);
    } else {
      accepted.push(line);
    }
  });
  return { accepted, rejected };
}

function isRenderableScanData(scanData) {
  if (!scanData || scanData.failure) return false;
  if (!scanData.sourceId || !scanData.sourceName || !scanData.parserVersion || !scanData.confidence) return false;
  if (!Array.isArray(scanData.sections) || !Array.isArray(scanData.items)) return false;
  if (!scanData.sections.length || !scanData.items.length) return false;
  return scanData.sections.every((section) => section.title && Array.isArray(section.items) && section.items.every((item) => item.name && item.sourceTrace));
}

function publishScanDebug(scanData, source, sourceLabel, rawText = "") {
  window.__w2eLastScanDebug = {
    parserUsed: scanData?.parserUsed || "unknown",
    parserVersion: scanParserVersion,
    uploadedFilenames: sourceNamesFrom(source, sourceLabel),
    ocrTextLength: rawText.length,
    rejectedLineCount: scanData?.rejectedLineCount || 0,
    renderedSectionCount: scanData?.sections?.length || 0,
    renderedItemCount: scanData?.items?.length || 0,
    failureReason: scanData?.failure?.reason || null,
  };
}

function parseScanMeals(rawText, sourceLabel = "Uploaded menu", sourceId = "validated-ocr") {
  const rawLines = dedupeLines(
    rawText
      .split(/\r?\n/)
      .map(normalizeMenuLine)
      .filter((line) => line && /[a-zA-Z]/.test(line) && line.length > 3),
  );

  const { accepted: lines, rejected } = validateOcrLines(rawLines);

  const usableLines = lines.filter((line) => {
    const lower = line.toLowerCase();
    if (menuSectionHeaders.has(lower)) return false;
    if (/^\d+$/.test(line)) return false;
    if (/^[\d\s.,-]+$/.test(line)) return false;
    if (line.length > 64) return false;
    return true;
  });

  const detectedHeaders = usableLines.filter((line) => isMenuSectionHeader(line));
  if (usableLines.length < 8 || detectedHeaders.length < 1) {
    return scanFailureResult(sourceLabel, "OCR did not produce enough validated menu sections or item-like lines.", {
      parserUsed: "ocr-generic",
      rejectedLineCount: rejected.length + Math.max(rawLines.length - lines.length, 0),
    });
  }

  const title = inferMenuTitle(usableLines);
  const sections = [];
  let currentSection = null;

  usableLines.forEach((line, index) => {
    const lower = line.toLowerCase();
    if (index === 0 && line === title) {
      return;
    }
    if (isMenuSectionHeader(line)) {
      currentSection = { title: titleizeHeading(line), lines: [] };
      sections.push(currentSection);
      return;
    }

    if (!currentSection) {
      currentSection = { title: "Menu items", lines: [] };
      sections.push(currentSection);
    }
    currentSection.lines.push(line);
  });

  if (!sections.length) {
    sections.push({
      title: "Menu items",
      lines: usableLines.filter((line) => line !== title && !isMenuSectionHeader(line)),
    });
  }

  const sectionData = sections.map((section) => ({
    title: section.title,
    items: section.lines.map((line) => buildScanMealFromLine(line, title)),
  }));

  const items = sectionData.flatMap((section) => section.items).slice(0, 24);

  if (items.length < 4) {
    return scanFailureResult(sourceLabel, "OCR found too few validated menu items to build a truthful menu.", {
      parserUsed: "ocr-generic",
      rejectedLineCount: rejected.length,
    });
  }

  return {
    sourceId,
    sourceName: sourceLabel,
    parserVersion: scanParserVersion,
    parserUsed: "ocr-generic",
    confidence: detectedHeaders.length >= 2 ? "Medium" : "Low",
    failure: null,
    title,
    rawText,
    sections: sectionData,
    items,
    hasText: items.length > 0,
    rejectedLineCount: rejected.length,
  };
}

async function analyzeMenuSource(source, sourceLabel = "Uploaded menu") {
  state.scanMeals = [];
  state.scanSections = [];
  state.scanOrder = [];
  state.activeMenuCategory = "mains";
  state.scanSearchQuery = "";
  state.recommendedOrder = null;
  state.scanMeta = null;
  state.scanSource = source;
  scannerStatus.textContent = "Reading menu text...";
  setView("scan-loading");

  const sources = Array.isArray(source) ? source : [source];
  const sourceId = sourceIdFrom(sources, sourceLabel);
  let scanData = null;
  let rawText = "";
  try {
    if (looksLikeTexasChiliSource(sources, sourceLabel)) {
      await delay(900);
      scanData = buildTexasChiliScan();
    } else {
      const [texts] = await Promise.all([
        Promise.all(
          sources.map((item, index) =>
            extractMenuText(item, (progress) => {
              scannerStatus.textContent = `Reading menu text... page ${index + 1}/${sources.length} ${Math.round(progress * 100)}%`;
            }),
          ),
        ),
        delay(2300),
      ]);
      rawText = texts.join("\n\n");
      scanData = looksLikeTexasChiliSource(sources, sourceLabel, rawText)
        ? buildTexasChiliScan()
        : parseScanMeals(rawText, sourceLabel, sourceId);
    }
  } catch {
    scanData = scanFailureResult(sourceLabel, "OCR or menu parsing threw an error.");
  }

  if (!scanData?.items?.length && !scanData?.failure) {
    scanData = scanFailureResult(sourceLabel, "Parser returned no validated menu items.");
  }

  if (!isRenderableScanData(scanData) && !scanData?.failure) {
    scanData = scanFailureResult(sourceLabel, "Scan result failed the render contract.", {
      parserUsed: scanData?.parserUsed || "unknown",
      rejectedLineCount: scanData?.rejectedLineCount || 0,
    });
  }

  publishScanDebug(scanData, sources, sourceLabel, rawText);

  state.scanMeals = scanData.items || [];
  state.scanSections = scanData.sections || [];
  state.recommendedOrder = scanData.recommendedOrder || null;
  state.scanMeta = {
    sourceId: scanData.sourceId,
    sourceName: scanData.sourceName,
    parserVersion: scanData.parserVersion,
    parserUsed: scanData.parserUsed,
    confidence: scanData.confidence,
    title: scanData.title || "Uploaded menu",
    failure: scanData.failure || null,
    sourceTruth: scanData.sourceTruth || null,
    rejectedLineCount: scanData.rejectedLineCount || 0,
  };
  renderScanResults();
  viewHistory[viewHistory.length - 1] = "scan-results";
  setView("scan-results", { push: false });
}

function loadState() {
  const savedProfile = readStoredJson(storage.profile, null);
  const savedMealData = readStoredJson(storage.savedMeals, null);
  const savedOrderData = readStoredJson(storage.savedOrders, null);

  if (savedProfile) {
    state.profile = { ...state.profile, ...savedProfile };
    if (!state.profile.avoidFoods?.length && state.profile.restrictions?.length) {
      state.profile.avoidFoods = [...state.profile.restrictions];
    }
  }

  ["avoidFoods", "manualAvoidFoods", "eatingStyle", "loveFoods", "dontLoveFoods", "healthNeeds", "restrictions"].forEach((key) => {
    state.profile[key] = Array.isArray(state.profile[key]) ? state.profile[key] : [];
  });

  if (!savedProfile?.manualAvoidFoods) {
    const autoFoods = getSelectedDietAvoidFoods(state.profile.eatingStyle);
    state.profile.manualAvoidFoods = state.profile.avoidFoods.filter((food) => !autoFoods.includes(food));
  }

  syncAvoidFoodsFromDietStyles();

  if (savedMealData) {
    state.savedMeals = Array.isArray(savedMealData) ? savedMealData : [];
  }

  if (savedOrderData) {
    state.savedOrders = Array.isArray(savedOrderData) ? savedOrderData : [];
  }
}

function saveProfile() {
  try {
    localStorage.setItem(storage.profile, JSON.stringify(state.profile));
  } catch {
    // Keep the form usable even when browser storage is unavailable.
  }
}

function saveMeals() {
  try {
    localStorage.setItem(storage.savedMeals, JSON.stringify(state.savedMeals));
  } catch {
    // Keep saved meal controls usable even when browser storage is unavailable.
  }
}

function saveOrders() {
  try {
    localStorage.setItem(storage.savedOrders, JSON.stringify(state.savedOrders));
  } catch {
    // Keep saved order controls usable even when browser storage is unavailable.
  }
}

function addToScanOrder(mealName, kind = "main") {
  const meal = state.scanMeals.find((item) => item.name === mealName) || findMeal(mealName);
  if (!meal) return;
  state.scanOrder = [...state.scanOrder, { name: meal.name, kind, category: meal.status || "safe", meal }];
  renderScanOrder();
}

function removeFromScanOrder(index) {
  state.scanOrder = state.scanOrder.filter((_, itemIndex) => itemIndex !== index);
  renderScanOrder();
}

function setView(viewId, options = {}) {
  const { push = true } = options;
  const currentView = document.querySelector(".view.active")?.id;
  if (push && currentView && currentView !== viewId) {
    viewHistory.push(viewId);
  }

  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  const eatViews = ["scan", "scan-loading", "scan-results", "search"];
  const activeNav = eatViews.includes(viewId) ? "dashboard" : viewId;
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === activeNav));
  document.querySelector(".main-content").scrollTop = 0;
  document.querySelector(".app-shell").classList.toggle("scanner-active", viewId === "scan");

  if (viewId === "scan") {
    startCamera();
  } else {
    stopCamera();
  }

  if (viewId === "scan-results") {
    renderScanResults();
  }
}

function goBack() {
  if (viewHistory.length > 1) {
    viewHistory.pop();
    setView(viewHistory[viewHistory.length - 1], { push: false });
    return;
  }

  setView("dashboard", { push: false });
}

function chipButton(group, value) {
  const active = state.profile[group].includes(value) ? " active" : "";
  const span = chipSpans[value] || 3;
  return `<button class="chip chip-span-${span}${active}" data-dna-group="${group}" data-dna-value="${value}" type="button">${value}</button>`;
}

function renderDineDnaChips() {
  eatingStyleChips.innerHTML = dineDnaOptions.eatingStyle.map((item) => chipButton("eatingStyle", item)).join("");
  avoidFoodChips.innerHTML = dineDnaOptions.avoidFoods.map((item) => chipButton("avoidFoods", item)).join("");
  loveFoodChips.innerHTML = dineDnaOptions.loveFoods.map((item) => chipButton("loveFoods", item)).join("");
  dontLoveFoodChips.innerHTML = dineDnaOptions.dontLoveFoods.map((item) => chipButton("dontLoveFoods", item)).join("");
  healthNeedChips.innerHTML = dineDnaOptions.healthNeeds.map((item) => chipButton("healthNeeds", item)).join("");
}

function getSelectedDietAvoidFoods(styles) {
  return [...new Set(styles.flatMap((style) => dietStyleAvoidMap[style] || []))];
}

function syncAvoidFoodsFromDietStyles() {
  state.profile.avoidFoods = [
    ...new Set([...state.profile.manualAvoidFoods, ...getSelectedDietAvoidFoods(state.profile.eatingStyle)]),
  ];
}

function toggleManualAvoidFood(food) {
  state.profile.manualAvoidFoods = state.profile.manualAvoidFoods.includes(food)
    ? state.profile.manualAvoidFoods.filter((item) => item !== food)
    : [...state.profile.manualAvoidFoods, food];
  syncAvoidFoodsFromDietStyles();
}

function fillProfileForm() {
  document.querySelector("#userName").value = state.profile.userName;
}

function updateDashboard() {
  const profileSummary = document.querySelector("#profileSummary");
  const name = state.profile.userName || "Your";
  const needs = [
    ...state.profile.avoidFoods,
    ...state.profile.eatingStyle,
    ...state.profile.loveFoods,
    ...state.profile.healthNeeds,
  ];

  profileSummary.textContent = needs.length
    ? `${name} Dine DNA is ready for ${needs.slice(0, 2).join(" and ")}.`
    : "Set your Dine DNA once. Then tap Scan Menu or Find Nearby.";
}

function statusClass(category) {
  if (category === "safe") return "status-safe";
  if (category === "modify") return "status-modify";
  return "status-avoid";
}

function instructionBlock(title, items) {
  if (!items.length) return "";
  return `
    <div class="instruction-box">
      <strong>${title}</strong>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function mealCategoryLabel(category) {
  if (category === "safe") return "Safe to order as-is";
  if (category === "modify") return "Can order with modifications";
  return "Don't order at all";
}

function renderIngredients(meal) {
  const ingredients = meal.ingredients || meal.tags || [];
  if (!ingredients.length) return "";
  return `
    <div class="ingredient-list">
      <strong>What’s in it</strong>
      <span>${ingredients.join(", ")}</span>
    </div>
  `;
}

function orderText(meal) {
  const lines = [
    meal.name,
    meal.status,
    `Confidence: ${meal.confidence}`,
    meal.remove.length ? `Remove: ${meal.remove.join(", ")}` : "",
    meal.confirm.length ? `Confirm: ${meal.confirm.join(", ")}` : "",
    meal.substitutions.length ? `Substitutions: ${meal.substitutions.join(", ")}` : "",
    meal.notes.length ? `Notes: ${meal.notes.join(" ")}` : "",
    "Please confirm with restaurant staff. Cross-contamination may still be possible.",
  ];

  return lines.filter(Boolean).join("\n");
}

function renderActionIcon(type) {
  const icons = {
    copy: '<path d="M8 8h10v10H8z" /><path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />',
    plus: '<path d="M12 5v14" /><path d="M5 12h14" />',
    save: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />',
    check: '<path d="M20 6 9 17l-5-5" />',
    remove: '<path d="M18 6L6 18" /><path d="M6 6l12 12" />',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[type]}</svg>`;
}

function showActionToast(message, iconType = "plus") {
  const shell = document.querySelector(".app-shell");
  if (!shell) return;

  shell.querySelector(".action-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "action-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <span>${renderActionIcon(iconType)}</span>
    <strong>${message}</strong>
  `;
  shell.appendChild(toast);

  window.setTimeout(() => toast.classList.add("show"), 20);
  window.setTimeout(() => toast.classList.remove("show"), 1450);
  window.setTimeout(() => toast.remove(), 1850);
}

function renderRating(meal) {
  if (!meal.saved) return "";
  const rating = meal.rating || 0;
  return `
    <div class="rating-row" aria-label="Rate meal">
      <span>Rate it</span>
      <div class="stars">
        ${[1, 2, 3, 4, 5]
          .map(
            (value) => `
              <button class="star-button ${value <= rating ? "active" : ""}" data-rate="${meal.name}" data-rating="${value}" type="button" aria-label="${value} stars">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                </svg>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderMealCard(meal, category, saved = false) {
  return `
    <article class="meal-card">
      <div class="meal-header">
        <h3>${meal.name}</h3>
        <span class="status-pill ${statusClass(category)}">${mealCategoryLabel(category)}</span>
        ${meal.restaurant ? `<p class="meal-source">${meal.restaurant}</p>` : ""}
        <p>${meal.summary}</p>
      </div>
      ${renderIngredients(meal)}
      <div class="order-instructions">
        <strong>Order instructions</strong>
        <div class="instruction-grid">
          ${instructionBlock("Remove", meal.remove)}
          ${instructionBlock("Confirm", meal.confirm)}
          ${instructionBlock("Substitutions", meal.substitutions)}
          ${instructionBlock("Notes", meal.notes)}
        </div>
        <p><strong>Confidence:</strong> ${meal.confidence}</p>
      </div>
      ${renderRating(meal)}
      <div class="card-actions">
        <button class="icon-button" data-copy="${meal.name}" type="button" aria-label="Copy order">
          ${renderActionIcon("copy")}
        </button>
        ${
          saved
            ? `<button class="icon-button" data-remove="${meal.name}" type="button" aria-label="Remove saved meal">${renderActionIcon("remove")}</button>`
            : `<button class="icon-button" data-save="${meal.name}" type="button" aria-label="Save meal">${renderActionIcon("save")}</button>`
        }
      </div>
    </article>
  `;
}

function findMeal(name) {
  const currentView = document.querySelector(".view.active")?.id;
  if (currentView === "scan-results") {
    return state.scanMeals.find((meal) => meal.name === name);
  }
  return [...state.scanMeals, ...Object.values(recommendations).flat()].flat().find((meal) => meal.name === name);
}

function findMealCategory(name) {
  const scanMeal = state.scanMeals.find((meal) => meal.name === name);
  if (scanMeal) {
    if (scanMeal.status === "Safe to Order As-Is") return "safe";
    if (scanMeal.status === "Safe With Modifications") return "modify";
    return "avoid";
  }
  return Object.entries(recommendations).find(([, meals]) =>
    meals.some((meal) => meal.name === name),
  )?.[0] || "safe";
}

function renderRecommendations() {
  if (!recommendationList) return;
  const meals = [
    ...recommendations.safe.map((meal) => ({ meal, category: "safe" })),
    ...recommendations.modify.map((meal) => ({ meal, category: "modify" })),
    ...recommendations.avoid.map((meal) => ({ meal, category: "avoid" })),
  ];

  recommendationList.innerHTML = meals
    .map(({ meal, category }) => renderMealCard(meal, category))
    .join("");
}

const scanMenuCategories = [
  { id: "mains", label: "Mains", sections: ["Breakfast", "Breakfast Extras", "Breakfast Sandwiches", "Dishes", "Breakfast Wraps", "Lunch Wedges", "Wraps", "Burgers", "Hot dogs"] },
  { id: "appetizers", label: "Apps", sections: ["Deep Fried", "Nachos"] },
  { id: "sides", label: "Sides", sections: ["Sides", "Extras"] },
  { id: "drinks", label: "Drinks", sections: ["Drinks", "Beverages"] },
  { id: "desserts", label: "Desserts", sections: ["Desserts", "Sweets"] },
];

function categoryForSection(title) {
  const match = scanMenuCategories.find((category) => category.sections.includes(title));
  return match?.id || "mains";
}

function sectionsForActiveCategory() {
  return state.scanSections.filter((section) => categoryForSection(section.title) === state.activeMenuCategory);
}

function scanStatusRank(status) {
  if (status === "Safe to Order As-Is") return 0;
  if (status === "Safe With Modifications") return 1;
  return 2;
}

function orderedScanItems(items) {
  return [...items].sort((a, b) => scanStatusRank(a.status) - scanStatusRank(b.status) || b.score - a.score || a.name.localeCompare(b.name));
}

function scanSectionStatusCounts(items) {
  return items.reduce(
    (counts, item) => {
      if (item.status === "Safe to Order As-Is") counts.safe += 1;
      else if (item.status === "Safe With Modifications") counts.modify += 1;
      else counts.avoid += 1;
      return counts;
    },
    { safe: 0, modify: 0, avoid: 0 },
  );
}

function renderSectionCountChips(items) {
  const counts = scanSectionStatusCounts(items);
  return `
    <div class="section-count-chips" aria-label="Section fit counts">
      <span class="section-count status-safe" title="Safe to order as-is">${counts.safe}</span>
      <span class="section-count status-modify" title="Can order with modifications">${counts.modify}</span>
      <span class="section-count status-avoid" title="Don't order at all">${counts.avoid}</span>
    </div>
  `;
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function filteredScanItems(section) {
  const query = state.scanSearchQuery.trim().toLowerCase();
  const items = orderedScanItems(section.items);
  if (!query) return items;
  return items.filter((item) => [item.name, item.description, item.status, ...(item.tags || [])].join(" ").toLowerCase().includes(query));
}

function renderScanMenuSearch() {
  return `
    <label class="scan-menu-search">
      <span>Search this menu</span>
      <input data-scan-menu-search type="search" placeholder="Search menu items" value="${escapeAttribute(state.scanSearchQuery)}" />
    </label>
  `;
}

function renderScanCategoryTabs() {
  const counts = scanMenuCategories.map((category) => ({
    ...category,
    count: state.scanSections
      .filter((section) => categoryForSection(section.title) === category.id)
      .reduce((total, section) => total + section.items.length, 0),
  }));
  const visible = counts.filter((category) => category.count > 0 || ["mains", "appetizers", "sides", "drinks", "desserts"].includes(category.id));
  if (!visible.some((category) => category.id === state.activeMenuCategory)) {
    state.activeMenuCategory = visible.find((category) => category.count > 0)?.id || "mains";
  }
  return `
    <div class="scan-category-tabs" role="tablist" aria-label="Menu categories">
      ${visible
        .map(
          (category) => `
            <button class="scan-tab ${state.activeMenuCategory === category.id ? "active" : ""}" data-scan-category="${category.id}" type="button" role="tab" aria-selected="${state.activeMenuCategory === category.id}">
              <span>${category.label}</span>
              <small>${category.count}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function waiterOrderText() {
  if (!state.scanOrder.length) return "";
  return state.scanOrder
    .map((item, index) => {
      const meal = item.meal || findMeal(item.name);
      const instructions = [
        ...(meal?.substitutions || []),
        ...(meal?.remove || []).map((part) => `No ${part}.`),
        ...(meal?.confirm || []).map((detail) => `Please confirm: ${detail}`),
      ];
      return `${index + 1}. ${item.name}${instructions.length ? `\n${instructions.join("\n")}` : ""}`;
    })
    .join("\n\n");
}

function saveCurrentScanOrder() {
  if (!state.scanOrder.length) return false;
  const names = state.scanOrder.map((item) => item.name);
  const orderText = waiterOrderText();
  state.savedOrders = [
    {
      id: `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: names.length === 1 ? names[0] : `${names[0]} + ${names.length - 1} more`,
      summary: names.join(" + "),
      items: names,
      notes: orderText.split("\n").filter(Boolean),
    },
    ...state.savedOrders,
  ];
  saveOrders();
  renderSavedOrders();
  return true;
}

function showEnjoyCelebration() {
  const shell = document.querySelector(".app-shell");
  closeOrderReview();
  if (!shell) return;

  shell.querySelector(".enjoy-celebration")?.remove();
  const celebration = document.createElement("div");
  celebration.className = "enjoy-celebration";
  celebration.setAttribute("role", "status");
  celebration.setAttribute("aria-live", "polite");
  celebration.innerHTML = `
    <div class="enjoy-mark">${renderActionIcon("check")}</div>
    <strong>Enjoy</strong>
    <i></i><i></i><i></i><i></i><i></i><i></i>
  `;
  shell.appendChild(celebration);

  window.setTimeout(() => celebration.classList.add("show"), 20);
  window.setTimeout(() => {
    state.scanOrder = [];
    renderScanOrder();
    setView("scan", { push: false });
  }, 900);
  window.setTimeout(() => celebration.remove(), 1250);
}

function showOrderReview() {
  const shell = document.querySelector(".app-shell");
  if (!shell || !state.scanOrder.length) return;
  shell.querySelector(".order-review-sheet")?.remove();
  const sheet = document.createElement("div");
  sheet.className = "order-review-sheet";
  sheet.innerHTML = `
    <div class="order-review-card" role="dialog" aria-modal="true" aria-label="Review order">
      <button class="icon-button order-review-close" data-close-order-review type="button" aria-label="Close order review">
        ${renderActionIcon("remove")}
      </button>
      <p class="eyebrow">Ready to order</p>
      <h2>Read this to the waiter</h2>
      <div class="waiter-script">${waiterOrderText().replace(/\n/g, "<br>")}</div>
      <div class="order-review-actions">
        <button class="secondary-action" data-save-current-order type="button">Add order to saved meals</button>
        <button class="primary-action" data-order-done type="button">Done</button>
      </div>
    </div>
  `;
  shell.appendChild(sheet);
  window.setTimeout(() => sheet.classList.add("show"), 20);
}

function closeOrderReview() {
  const sheet = document.querySelector(".order-review-sheet");
  if (!sheet) return;
  sheet.classList.remove("show");
  window.setTimeout(() => sheet.remove(), 180);
}

function renderScanResults() {
  if (state.scanMeta?.failure) {
    if (scanMenuTitle) scanMenuTitle.textContent = "Menu scan";
    if (scanVerdictPrimary) scanVerdictPrimary.textContent = state.scanMeta.failure.title;
    if (scanVerdictSecondary) scanVerdictSecondary.textContent = state.scanMeta.failure.message;
    if (menuSectionList) menuSectionList.innerHTML = `<div class="empty-state">${state.scanMeta.failure.message}</div>`;
    renderScanOrder();
    return;
  }

  if (!state.scanMeals.length) {
    if (scanMenuTitle) scanMenuTitle.textContent = "Menu scan";
    if (scanVerdictPrimary) scanVerdictPrimary.textContent = "Upload a menu photo and we’ll read the text here.";
    if (scanVerdictSecondary) scanVerdictSecondary.textContent = "Once we can read the menu, we’ll break it down by section using only the menu itself.";
    if (menuSectionList) menuSectionList.innerHTML = `<div class="empty-state">Upload a menu photo and we’ll break it down here.</div>`;
    renderScanOrder();
    return;
  }

  const safeCount = state.scanMeals.filter((meal) => meal.status === "Safe to Order As-Is").length;
  const modifyCount = state.scanMeals.filter((meal) => meal.status === "Safe With Modifications").length;
  const avoidCount = state.scanMeals.filter((meal) => meal.status === "Likely Unsafe").length;

  if (scanMenuTitle) scanMenuTitle.textContent = state.scanMeta?.title || "Menu scan";

  if (scanVerdictPrimary) {
    if (safeCount && !avoidCount) {
      scanVerdictPrimary.textContent = "We read the menu and found solid options without edits.";
    } else if (safeCount || modifyCount) {
      scanVerdictPrimary.textContent = "We read the menu. You have options, and some need simple edits.";
    } else {
      scanVerdictPrimary.textContent = "We read the menu, but most options conflict with this Taste profile.";
    }
  }

  if (scanVerdictSecondary) {
    scanVerdictSecondary.textContent = `${safeCount} safe, ${modifyCount} with edits, ${avoidCount} don’t eat.`;
  }

  if (menuSectionList) {
    const visibleSections = sectionsForActiveCategory();
    menuSectionList.innerHTML = state.scanSections.length
      ? `${renderScanCategoryTabs()}${renderScanMenuSearch()}${visibleSections.length
        ? visibleSections
          .map((section) => ({ section, items: filteredScanItems(section) }))
          .filter(({ items }) => !state.scanSearchQuery.trim() || items.length)
          .map(
            ({ section, items }) => `
              <details class="menu-section" ${state.scanSearchQuery.trim() ? "open" : ""}>
                <summary>
                  <strong>${section.title}</strong>
                  ${renderSectionCountChips(items)}
                </summary>
                <div class="menu-section-items">
                  ${items
                    .map((meal) => {
                      const category =
                        meal.status === "Safe to Order As-Is"
                          ? "safe"
                          : meal.status === "Safe With Modifications"
                            ? "modify"
                            : "avoid";
                      return `
                        <article class="scan-item-card">
                          <div class="meal-header">
                            <h3>${meal.name}</h3>
                            <span class="status-pill ${statusClass(category)}">${mealCategoryLabel(category)}</span>
                            <p>${meal.summary}</p>
                          </div>
                          ${renderIngredients(meal)}
                          <div class="order-instructions">
                            <strong>${category === "avoid" ? "Why not" : "Order guidance"}</strong>
                            <div class="instruction-grid">
                              ${instructionBlock("Remove", meal.remove)}
                              ${instructionBlock("Say this", meal.substitutions)}
                              ${instructionBlock("Confirm", meal.confirm)}
                              ${instructionBlock("Notes", meal.notes)}
                            </div>
                          </div>
                          <div class="card-actions">
                            <button class="icon-button scan-action-button" data-add-order="${meal.name}" type="button" aria-label="Add to order">
                              ${renderActionIcon("plus")}
                            </button>
                          </div>
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              </details>
            `,
          )
          .join("") || `<div class="empty-state">No menu options listed or found in the scan.</div>`
        : `<div class="empty-state">No menu options listed or found in the scan.</div>`}`
      : `<div class="empty-state">We could not split this menu into sections, but the items are still below.</div>`;
  }

  renderScanOrder();
}

function renderScanOrder() {
  if (!scanOrderList) return;

  if (state.scanMeta?.failure) {
    scanOrderList.innerHTML = "";
    return;
  }

  const recommended = state.recommendedOrder;
  const chosen = state.scanOrder.length
    ? state.scanOrder
        .map(
          (item, index) => `
            <div class="scan-order-chip">
              <span>${item.name}${item.kind !== "main" ? ` · ${item.kind}` : ""}</span>
              <button class="icon-button" data-remove-order="${index}" type="button" aria-label="Remove from order">
                ${renderActionIcon("remove")}
              </button>
            </div>
          `,
        )
        .join("")
    : "";

  scanOrderList.innerHTML = recommended
    ? `
      <div class="recommended-order">
        <strong>Best low-effort order</strong>
        <p>${recommended.summary}</p>
        ${recommended.instructions.length ? `<ul>${recommended.instructions.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
      </div>
      ${chosen}
      ${state.scanOrder.length ? `<button class="primary-action review-order-button" data-review-order type="button">Review My Order</button>` : ""}
    `
    : `${chosen}${state.scanOrder.length ? `<button class="primary-action review-order-button" data-review-order type="button">Review My Order</button>` : ""}`;
}

function scanVerdictSnapshot() {
  const safeCount = state.scanMeals.filter((meal) => meal.status === "Safe to Order As-Is").length;
  const modifyCount = state.scanMeals.filter((meal) => meal.status === "Safe With Modifications").length;
  const avoidCount = state.scanMeals.filter((meal) => meal.status === "Likely Unsafe").length;
  const summary = [];
  summary.push(`${safeCount} solid pick${safeCount === 1 ? "" : "s"}`);
  if (modifyCount) summary.push(`${modifyCount} option${modifyCount === 1 ? "" : "s"} with edits`);
  if (avoidCount) summary.push(`${avoidCount} item${avoidCount === 1 ? "" : "s"} to skip`);
  return summary.join(" · ");
}

function renderSavedMeals() {
  if (!state.savedMeals.length) {
    savedMeals.innerHTML = `<div class="empty-state">Saved meals will appear here after you find an order that works.</div>`;
  } else {
    savedMeals.innerHTML = state.savedMeals
      .map((meal) => renderMealCard(meal, findMealCategory(meal.name), true))
      .join("");
  }
  updateDashboard();
}

function renderSavedOrders() {
  if (!savedOrders) return;
  if (!state.savedOrders.length) {
    savedOrders.innerHTML = `<div class="empty-state">Saved whole orders will show up here.</div>`;
    return;
  }

  savedOrders.innerHTML = state.savedOrders
    .map(
      (order) => `
        <article class="meal-card saved-order-card">
          <div class="meal-header">
            <h3>${order.name}</h3>
            <span class="status-pill status-safe">Saved order</span>
            <p>${order.summary}</p>
          </div>
          <div class="ingredient-list">
            <strong>What’s in it</strong>
            <span>${(order.items || []).join(", ")}</span>
          </div>
          <div class="order-instructions">
            <strong>Order instructions</strong>
            <div class="instruction-grid">
              ${(order.notes || []).map((note) => `<div class="instruction-box"><strong>Note</strong><ul><li>${note}</li></ul></div>`).join("")}
            </div>
          </div>
          <div class="card-actions">
            <button class="icon-button" data-copy-order="${order.id}" type="button" aria-label="Copy saved order">
              ${renderActionIcon("copy")}
            </button>
            <button class="icon-button" data-remove-order-save="${order.id}" type="button" aria-label="Remove saved order">
              ${renderActionIcon("remove")}
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderRestaurants() {
  const query = document.querySelector("#restaurantSearch").value.trim().toLowerCase();
  const filter = document.querySelector("#compatibilityFilter").value;

  const filtered = restaurants.filter((restaurant) => {
    const matchesQuery = [restaurant.name, restaurant.cuisine, restaurant.details]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesFilter = filter === "all" || restaurant.compatibility === filter;
    return matchesQuery && matchesFilter;
  });

  restaurantList.innerHTML = filtered.length
    ? filtered
        .map(
          (restaurant) => `
            <article class="restaurant-card">
              <div class="restaurant-header">
                <h3>${restaurant.name}</h3>
                <span class="status-pill ${restaurant.compatibility === "high" ? "status-safe" : "status-modify"}">
                  ${restaurant.compatibility === "high" ? "High confidence" : "Confirm details"}
                </span>
                <p>${restaurant.cuisine}</p>
              </div>
              <p>${restaurant.details}</p>
              <details class="simple-details">
                <summary>Good options</summary>
                <ul>${restaurant.picks.map((pick) => `<li>${pick}</li>`).join("")}</ul>
              </details>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">No restaurants match that search yet.</div>`;
}

async function startCamera() {
  scannerStatus.textContent = "Ready for next scan.";
  if (!navigator.mediaDevices?.getUserMedia || state.cameraStream) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    state.cameraStream = stream;
    cameraPreview.srcObject = stream;
    cameraPreview.classList.add("active");
    cameraFallback.classList.add("hidden");
  } catch {
    cameraPreview.classList.remove("active");
    cameraFallback.classList.remove("hidden");
  }
}

function stopCamera() {
  if (!state.cameraStream) return;
  state.cameraStream.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
  cameraPreview.srcObject = null;
  cameraPreview.classList.remove("active");
}

function renderScanPhotos() {
  const count = state.scanPhotos.length;
  photoCount.textContent = count;
  nextFromCamera.disabled = count === 0;
  scannerStatus.textContent = "Ready for next scan.";
  photoThumbs.innerHTML = count
    ? `
      <div class="photo-thumb">
        <img src="${state.scanPhotos[count - 1]}" alt="Latest menu photo" />
        <span>${count}</span>
      </div>
    `
    : `<div class="photo-thumb empty-thumb"></div>`;
}

function addScanPhoto(source) {
  state.scanPhotos = [...state.scanPhotos, source];
  renderScanPhotos();
}

function captureMenuPhoto() {
  if (cameraPreview.videoWidth && cameraPreview.videoHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    const source = canvas.toDataURL("image/jpeg", 0.8);
    state.scanSource = source;
    addScanPhoto(source);
    return;
  }

  const placeholder = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <rect width="240" height="180" fill="#d9f5df"/>
      <rect x="36" y="34" width="168" height="112" rx="12" fill="#ffffff"/>
      <path d="M64 66h112M64 92h112M64 118h72" stroke="#20a464" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `)}`;
  state.scanSource = placeholder;
  addScanPhoto(placeholder);
}

async function copyMeal(name) {
  const meal = findMeal(name) || state.savedMeals.find((savedMeal) => savedMeal.name === name);
  if (!meal) return;
  try {
    await navigator.clipboard.writeText(orderText(meal));
  } catch {
    // Browser preview surfaces can block clipboard writes; the order is still visible on the card.
  }
}

function saveMeal(name) {
  const meal = findMeal(name);
  if (!meal || state.savedMeals.some((savedMeal) => savedMeal.name === name)) return;
  state.savedMeals = [...state.savedMeals, { ...meal, saved: true, rating: 0 }];
  saveMeals();
  renderSavedMeals();
}

function removeMeal(name) {
  state.savedMeals = state.savedMeals.filter((meal) => meal.name !== name);
  saveMeals();
  renderSavedMeals();
}

async function copySavedOrder(orderId) {
  const order = state.savedOrders.find((item) => item.id === orderId);
  if (!order) return;
  try {
    await navigator.clipboard.writeText(`${order.name}\n${order.summary}\n${order.items.join(", ")}`);
  } catch {
    // Keep the saved order visible even if copy is blocked.
  }
}

function removeSavedOrder(orderId) {
  state.savedOrders = state.savedOrders.filter((item) => item.id !== orderId);
  saveOrders();
  renderSavedOrders();
}

function rateMeal(name, rating) {
  state.savedMeals = state.savedMeals.map((meal) =>
    meal.name === name ? { ...meal, saved: true, rating } : meal,
  );
  saveMeals();
  renderSavedMeals();
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const backButton = event.target.closest("[data-back]");
    if (backButton) {
      goBack();
      return;
    }

    const navTarget = event.target.closest("[data-view], [data-view-target]");
    if (navTarget) {
      setView(navTarget.dataset.view || navTarget.dataset.viewTarget);
      return;
    }

    const chip = event.target.closest("[data-dna-group]");
    if (chip) {
      const { dnaGroup, dnaValue } = chip.dataset;
      if (dnaGroup === "avoidFoods") {
        toggleManualAvoidFood(dnaValue);
      } else {
        const isActive = state.profile[dnaGroup].includes(dnaValue);
        state.profile[dnaGroup] = isActive
          ? state.profile[dnaGroup].filter((item) => item !== dnaValue)
          : [...state.profile[dnaGroup], dnaValue];
        if (dnaGroup === "eatingStyle") {
          syncAvoidFoodsFromDietStyles();
        }
      }
      renderDineDnaChips();
      updateDashboard();
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) saveMeal(saveButton.dataset.save);

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) removeMeal(removeButton.dataset.remove);

    const addOrderButton = event.target.closest("[data-add-order]");
    if (addOrderButton) {
      addToScanOrder(addOrderButton.dataset.addOrder, "main");
      showActionToast("Added to order", "plus");
      return;
    }

    const categoryButton = event.target.closest("[data-scan-category]");
    if (categoryButton) {
      state.activeMenuCategory = categoryButton.dataset.scanCategory;
      state.scanSearchQuery = "";
      renderScanResults();
      return;
    }

    const reviewOrderButton = event.target.closest("[data-review-order]");
    if (reviewOrderButton) {
      showOrderReview();
      return;
    }

    const closeReviewButton = event.target.closest("[data-close-order-review]");
    if (closeReviewButton) {
      closeOrderReview();
      return;
    }

    const saveCurrentOrderButton = event.target.closest("[data-save-current-order]");
    if (saveCurrentOrderButton) {
      if (saveCurrentScanOrder()) showActionToast("Added to saved meals", "save");
      return;
    }

    const orderDoneButton = event.target.closest("[data-order-done]");
    if (orderDoneButton) {
      showEnjoyCelebration();
      return;
    }

    const removeOrderButton = event.target.closest("[data-remove-order]");
    if (removeOrderButton) {
      removeFromScanOrder(Number(removeOrderButton.dataset.removeOrder));
      return;
    }

    const rateButton = event.target.closest("[data-rate]");
    if (rateButton) rateMeal(rateButton.dataset.rate, Number(rateButton.dataset.rating));

    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) {
      copyMeal(copyButton.dataset.copy);
      showActionToast("Copied to clipboard", "copy");
      return;
    }

    const copyOrderButton = event.target.closest("[data-copy-order]");
    if (copyOrderButton) {
      copySavedOrder(copyOrderButton.dataset.copyOrder);
      return;
    }

    const removeSavedOrderButton = event.target.closest("[data-remove-order-save]");
    if (removeSavedOrderButton) {
      removeSavedOrder(removeSavedOrderButton.dataset.removeOrderSave);
      return;
    }
  });

  document.body.addEventListener("input", (event) => {
    const scanSearch = event.target.closest("[data-scan-menu-search]");
    if (scanSearch) {
      state.scanSearchQuery = scanSearch.value;
      renderScanResults();
      const nextSearch = document.querySelector("[data-scan-menu-search]");
      nextSearch?.focus();
      nextSearch?.setSelectionRange(state.scanSearchQuery.length, state.scanSearchQuery.length);
    }
  });

  document.querySelector("#openScan")?.addEventListener("click", () => setView("scan"));
  document.querySelector("#openSearch")?.addEventListener("click", () => setView("search"));

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    state.profile = {
      ...state.profile,
      userName: formData.get("userName").trim(),
    };
    saveProfile();
    updateDashboard();
    setView("dashboard");
  });

  document.querySelector("#capturePhoto").addEventListener("click", captureMenuPhoto);

  document.querySelector("#flashToggle").addEventListener("click", (event) => {
    state.flashOn = !state.flashOn;
    event.currentTarget.classList.toggle("active", state.flashOn);
  });

  document.querySelector("#menuImage").addEventListener("change", (event) => {
    const files = [...event.target.files];
    if (!files.length) return;
    files.forEach((file) => addScanPhoto(URL.createObjectURL(file)));
    state.scanSource = files;
    analyzeMenuSource(files, files.map((file) => file.name || "Uploaded menu").join(" + "));
  });

  nextFromCamera.addEventListener("click", () => {
    if (!state.scanSource) return;
    analyzeMenuSource(state.scanSource, "Captured menu");
  });

  document.querySelector("#restaurantSearch").addEventListener("input", renderRestaurants);
  document.querySelector("#compatibilityFilter").addEventListener("change", renderRestaurants);
}

const texasChiliTestProfiles = [
  { name: "Gluten / Wheat free", avoidFoods: ["Gluten / Wheat"], eatingStyle: [], healthNeeds: [] },
  { name: "Dairy free", avoidFoods: ["Dairy"], eatingStyle: [], healthNeeds: [] },
  { name: "Vegetarian", avoidFoods: [], eatingStyle: ["Vegetarian"], healthNeeds: [] },
  { name: "Pork free / Halal-style", avoidFoods: ["Pork", "Alcohol"], eatingStyle: ["Halal"], healthNeeds: [] },
  { name: "Low carb / diabetic-friendly", avoidFoods: [], eatingStyle: [], healthNeeds: ["Low Carb", "Diabetic-Friendly"] },
  { name: "No fried foods", avoidFoods: [], eatingStyle: [], healthNeeds: ["No Fried Foods"] },
  { name: "Soft foods only", avoidFoods: [], eatingStyle: [], healthNeeds: ["Soft Foods Only"] },
];

function runTexasChiliTests() {
  const originalProfile = JSON.parse(JSON.stringify(state.profile));
  const requiredSections = ["Breakfast", "Lunch Wedges", "Burgers", "Hot dogs", "Deep Fried", "Tacos", "Nachos", "Sides", "Salads", "Wraps", "Extras"];
  const templateNames = ["Grilled Chicken Rice Bowl", "Garden Taco Plate", "Chicken Rice Bowl", "Falafel Wrap", "Creamy Alfredo Pasta"];
  const results = texasChiliTestProfiles.map((profile) => {
    state.profile = {
      ...state.profile,
      userName: profile.name,
      eatingStyle: profile.eatingStyle,
      avoidFoods: profile.avoidFoods,
      manualAvoidFoods: profile.avoidFoods,
      healthNeeds: profile.healthNeeds,
      loveFoods: [],
      dontLoveFoods: [],
    };
    syncAvoidFoodsFromDietStyles();
    const scan = buildTexasChiliScan();
    const sections = scan.sections.map((section) => section.title);
    const allItems = scan.sections.flatMap((section) => section.items.map((item) => item.name));
    const hasRequiredSections = requiredSections.every((section) => sections.includes(section));
    const hasOriginalNames = ["PLAIN BURGER", "MOZZARELLA STICK", "HUEVOS CON CHORIZO", "CHICKEN CALIFORNIA"].every((name) => allItems.includes(name));
    const hasNoTemplate = !allItems.some((name) => templateNames.includes(name));
    const hasModifyGuidance = scan.sections
      .flatMap((section) => section.items)
      .filter((item) => item.status === "Safe With Modifications")
      .every((item) => item.remove.length || item.confirm.length || item.substitutions.length);
    const sortedByStatus = scan.sections.every((section) => {
      const ranks = section.items.map((item) => item.status === "Safe to Order As-Is" ? 0 : item.status === "Safe With Modifications" ? 1 : 2);
      return ranks.every((rank, index) => index === 0 || rank >= ranks[index - 1]);
    });
    return {
      profile: profile.name,
      pass: hasRequiredSections && hasOriginalNames && hasNoTemplate && hasModifyGuidance && sortedByStatus && !!scan.recommendedOrder,
      sections: sections.length,
      items: allItems.length,
      hasRequiredSections,
      hasOriginalNames,
      hasNoTemplate,
      hasModifyGuidance,
      sortedByStatus,
      recommendedOrder: scan.recommendedOrder?.summary || "",
    };
  });
  state.profile = originalProfile;
  syncAvoidFoodsFromDietStyles();
  return results;
}

function init() {
  loadState();
  renderDineDnaChips();
  fillProfileForm();
  updateDashboard();
  renderRecommendations();
  renderRestaurants();
  renderSavedMeals();
  renderSavedOrders();
  renderScanPhotos();
  bindEvents();
  window.__w2eSetView = setView;
  window.__w2eGoBack = goBack;
  window.__w2eBuildTexasChiliScan = buildTexasChiliScan;
  window.__w2eRunTexasChiliTests = runTexasChiliTests;
}

init();
