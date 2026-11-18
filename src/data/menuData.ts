export interface MenuItem {
  id: string;
  name: string;
  category: 'main' | 'breakfast_snacks' | 'beverages' | 'sides';
  subcategory?: string;
  price: number;
  secondaryPrice?: number; // for Lusaniya 80k / 100k
  unit?: string;
  description: string;
  image: string;
  popular?: boolean;
  spicy?: boolean;
  isSpecialty?: boolean;
  ingredients?: string[];
  dietary?: 'meat' | 'poultry' | 'fish' | 'vegetarian';
}

export interface OriginalBoard {
  title: string;
  description: string;
  imagePath: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export const RESTAURANT_INFO = {
  name: "Papaz Spot",
  tagline: "better food, better mood",
  phone: "0708300003",
  formattedPhone: "+256 708 300 003",
  whatsappNumber: "256708300003",
  takeawayPackingFee: 1000,
  defaultDeliveryFee: 5000,
  currency: "UGX",
  currencySymbol: "USh",
  openingHours: "Open 24 Hours · 7 Days a Week (24/7)",
  location: "Kampala, Uganda",
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'cbd', name: 'Kampala CBD / Nakasero / Old Kampala', fee: 3000, estimatedTime: '20-30 mins' },
  { id: 'kololo', name: 'Kololo / Kamwokya / Mulago / Makerere', fee: 4000, estimatedTime: '25-35 mins' },
  { id: 'ntinda', name: 'Ntinda / Bukoto / Naguru / Kisaasi', fee: 5000, estimatedTime: '30-45 mins' },
  { id: 'bugolobi', name: 'Bugolobi / Luzira / Mbuya / Mutungo', fee: 5000, estimatedTime: '30-45 mins' },
  { id: 'muyenga', name: 'Muyenga / Kansanga / Kabalagala / Ggaba', fee: 5000, estimatedTime: '30-45 mins' },
  { id: 'naalya', name: 'Naalya / Kiwatule / Kyaliwajjala / Namugongo', fee: 7000, estimatedTime: '40-55 mins' },
  { id: 'kira', name: 'Kira / Najjera / Kasangati', fee: 8000, estimatedTime: '45-60 mins' },
  { id: 'lubowa', name: 'Lubowa / Seguku / Kajjansi / Entebbe Rd', fee: 8000, estimatedTime: '45-60 mins' },
  { id: 'other', name: 'Other Kampala / Greater Metropolitan Area', fee: 6000, estimatedTime: '40-60 mins' },
];

export const ORIGINAL_MENU_BOARDS: OriginalBoard[] = [
  {
    title: "Updated Menu Prices Board",
    description: "Main Course specials, Lusaniya options, side dishes, takeaway fee, and contact number 0708300003.",
    imagePath: "/assets/aistudio/Screenshot_2026-10-14-10-02-35-950_com.google.android.googlequicksearchbox_269fde32.jpg"
  },
  {
    title: "Official Food Menu Board",
    description: "Full menu listing Main Course, Beverages, and Breakfast & Snacks selections.",
    imagePath: "/assets/aistudio/Screenshot_2026-10-14-10-02-27-112_com.google.android.googlequicksearchbox_9df83ee9.jpg"
  },
  {
    title: "Breakfast & Beverage Focus",
    description: "Close-up view of fresh tropical drinks, Rolex, Katogo, and fresh pastries.",
    imagePath: "/assets/aistudio/Screenshot_2026-10-14-10-02-15-718_com.google.android.googlequicksearchbox_632f3d35.jpg"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // --- MAIN COURSE SPECIALTIES ---
  {
    id: "beef-luwombo",
    name: "Beef Luwombo",
    category: "main",
    subcategory: "Luwombo Specialties",
    price: 20000,
    description: "Prime beef gently tied and slow-steamed inside fresh banana leaves, infused with roasted spices, garlic, onion, and rich aromatic broth.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Tender Beef", "Banana Leaves", "Garlic & Ginger", "Onions", "Natural Spiced Broth"],
    dietary: "meat"
  },
  {
    id: "goat-luwombo",
    name: "Goat Luwombo",
    category: "main",
    subcategory: "Luwombo Specialties",
    price: 20000,
    description: "Traditional East African royal delicacy: succulent choice goat meat sealed in fragrant banana leaves and steamed until fall-apart tender.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Lean Goat Meat", "Banana Leaves", "Fresh Coriander", "Tomatoes", "Simmered Herbs"],
    dietary: "meat"
  },
  {
    id: "chicken-luwombo",
    name: "Chicken Luwombo",
    category: "main",
    subcategory: "Luwombo Specialties",
    price: 20000,
    description: "Farm-fresh chicken portions delicately seasoned and slow-cooked in steamed banana leaf pouches with traditional aromatic spices.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Country Chicken", "Banana Leaves", "Sweet Peppers", "Spring Onions", "Savory Jus"],
    dietary: "poultry"
  },
  {
    id: "goat-pilawo",
    name: "Goat Pilawo",
    category: "main",
    subcategory: "Pilau & Rice",
    price: 20000,
    description: "Fragrant long-grain East African spiced rice simmered with tender goat cuts, browned onions, cinnamon, cumin, and cloves.",
    image: "/src/assets/images/food_goat_pilau_1793271706537.jpg",
    popular: true,
    ingredients: ["Fragrant Pilau Rice", "Succulent Goat", "Crispy Onions", "Cardamom & Clove", "Kachumbari Side"],
    dietary: "meat"
  },
  {
    id: "chicken-pilawo",
    name: "Chicken Pilawo",
    category: "main",
    subcategory: "Pilau & Rice",
    price: 20000,
    description: "Rich, aromatic spiced pilaw rice cooked in savory chicken stock with spiced chicken portions and caramelized onions.",
    image: "/src/assets/images/food_goat_pilau_1793271706537.jpg",
    popular: true,
    ingredients: ["Pilau Rice", "Tender Chicken", "Garlic", "Ginger", "Warm Masala Spices"],
    dietary: "poultry"
  },
  {
    id: "beef-box",
    name: "Beef Box",
    category: "main",
    subcategory: "Boxes & Combos",
    price: 20000,
    description: "Generous boxed combination of hearty seasoned beef served with steamed matooke, rice, and fresh vegetables.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Braised Beef", "Steamed Matooke", "Rice", "Fresh Greens"],
    dietary: "meat"
  },
  {
    id: "chicken-box",
    name: "Chicken Box",
    category: "main",
    subcategory: "Boxes & Combos",
    price: 20000,
    description: "Full combo box containing spiced juicy chicken pieces paired with your favorite staples and rich gravy.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Roast Chicken", "Choice Staples", "Papaz Gravy", "Slaw"],
    dietary: "poultry"
  },
  {
    id: "goat-box",
    name: "Goat Box",
    category: "main",
    subcategory: "Boxes & Combos",
    price: 20000,
    description: "Tender goat cuts served in a hearty meal box with authentic accompaniments and flavorful sauces.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Goat Meat Cuts", "Staple Accompanients", "Savory Gravy"],
    dietary: "meat"
  },
  {
    id: "goat-stew",
    name: "Goat Stew",
    category: "main",
    subcategory: "Stews & Curries",
    price: 20000,
    description: "Slow-simmered rich goat stew cooked with fresh tomatoes, bell peppers, garlic, ginger, and aromatic spices.",
    image: "/src/assets/images/food_goat_pilau_1793271706537.jpg",
    ingredients: ["Goat Chunks", "Ripe Tomatoes", "Garlic", "Coriander", "Simmered Broth"],
    dietary: "meat"
  },
  {
    id: "pasted-beef",
    name: "Pasted Beef",
    category: "main",
    subcategory: "Traditional Pasted",
    price: 20000,
    description: "Tender braised beef chunks enveloped in a luxurious, silky roasted peanut (g-nut) paste sauce.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    isSpecialty: true,
    ingredients: ["Braised Beef", "Roasted Groundnut Paste", "Natural Broth"],
    dietary: "meat"
  },
  {
    id: "pasted-fish",
    name: "Pasted Fish",
    category: "main",
    subcategory: "Fish & Seafood",
    price: 20000,
    description: "Crisp fried fresh lake fish simmered gently in rich creamy roasted groundnut sauce.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Lake Victoria Fish", "Creamy G-nut Paste", "Herbs"],
    dietary: "fish"
  },
  {
    id: "fresh-fish",
    name: "Fresh Fish",
    category: "main",
    subcategory: "Fish & Seafood",
    price: 20000,
    description: "Whole fresh Lake Victoria tilapia cooked to golden crispiness or gently stewed with tomatoes and lime.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    popular: true,
    ingredients: ["Whole Fresh Tilapia", "Garlic Butter", "Fresh Lemon", "Herbs"],
    dietary: "fish"
  },
  {
    id: "dry-fish",
    name: "Dry Fish",
    category: "main",
    subcategory: "Fish & Seafood",
    price: 20000,
    description: "Traditionally wood-smoked dry fish simmered into savory tenderness with deep natural umami richness.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Smoked Lake Fish", "Tomato Gravy", "Red Onions"],
    dietary: "fish"
  },
  {
    id: "lusaniya",
    name: "Lusaniya (Grand Sharing Platter)",
    category: "main",
    subcategory: "Platters & Feasts",
    price: 80000,
    secondaryPrice: 100000,
    description: "The ultimate celebratory East African feast platter piled with Luwombo, Pilau, chicken, goat, sausages, plantains, matooke & sides. Available in Regular (80k) or Jumbo (100k).",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Assorted Meats", "Luwombo Parcels", "Pilau Rice", "Chapatis", "Sausages", "Sides"],
    dietary: "meat"
  },
  {
    id: "molokoni",
    name: "Molokoni (Cow Trotters Soup)",
    category: "main",
    subcategory: "Stews & Curries",
    price: 15000,
    description: "Uganda's legendary collagen-rich cow trotter bone broth, slow-simmered overnight with ginger, garlic, chili, and herbs.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    popular: true,
    ingredients: ["Cow Trotters", "Rich Bone Broth", "Ginger", "Garlic", "Chili Pepper"],
    dietary: "meat"
  },
  {
    id: "pasted-mushroom",
    name: "Pasted Mushroom (G.nuts Mushroom)",
    category: "main",
    subcategory: "Vegetarian Mains",
    price: 13000,
    description: "Tender forest button mushrooms stewed in velvety roasted peanut paste with a touch of garlic.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    ingredients: ["Fresh Mushrooms", "Roasted Groundnut Paste", "Garlic", "Seasonings"],
    dietary: "vegetarian"
  },
  {
    id: "peas-stew",
    name: "Peas Stew",
    category: "main",
    subcategory: "Vegetarian Mains",
    price: 13000,
    description: "Sweet garden green peas gently simmered in a light aromatic carrot, onion, and mild curry gravy.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Garden Green Peas", "Carrots", "Mild Curry", "Fresh Coriander"],
    dietary: "vegetarian"
  },
  {
    id: "beans-main",
    name: "Beans Stew",
    category: "main",
    subcategory: "Vegetarian Mains",
    price: 10000,
    description: "Slow-cooked Ugandan red beans simmered to creamy perfection with savory seasonings and herbs.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Red Beans", "Sweet Peppers", "Onions", "Coriander"],
    dietary: "vegetarian"
  },
  {
    id: "gnuts-plain",
    name: "G.nuts Plain",
    category: "main",
    subcategory: "Vegetarian Mains",
    price: 10000,
    description: "Silky, hearty bowl of stone-ground roasted Ugandan peanut sauce, perfect over steamed staples.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Roasted Groundnuts", "Salt", "Warm Water"],
    dietary: "vegetarian"
  },
  {
    id: "plain-food",
    name: "Plain Food (Staples Assortment)",
    category: "main",
    subcategory: "Staples & Bases",
    price: 8000,
    description: "A generous comforting plate of traditional steamed staples including soft matooke, sweet potatoes, cassava, and posho.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Steamed Matooke", "Sweet Potatoes", "Cassava", "Posho"],
    dietary: "vegetarian"
  },
  {
    id: "kalo",
    name: "Kalo (Millet Bread)",
    category: "main",
    subcategory: "Staples & Bases",
    price: 8000,
    description: "Warm, nourishing traditional millet and cassava bread loaf with authentic earthy taste.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Millet Flour", "Cassava Flour", "Boiling Water"],
    dietary: "vegetarian"
  },

  // --- BREAKFAST & SNACKS ---
  {
    id: "katogo",
    name: "Katogo Combo",
    category: "breakfast_snacks",
    subcategory: "Breakfast Delicacies",
    price: 10000,
    description: "Beloved Kampala breakfast plate loaded with eggs, hot chapati, fresh creamy avocado slices, and spaghetti.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    popular: true,
    ingredients: ["Fried Eggs", "Layered Chapati", "Fresh Avocado", "Spaghetti"],
    dietary: "vegetarian"
  },
  {
    id: "rolex",
    name: "Ugandan Rolex",
    category: "breakfast_snacks",
    subcategory: "Breakfast Delicacies",
    price: 5000,
    description: "World-famous Ugandan street icon: warm layered flaky chapati rolled tightly with seasoned 2-egg omelette, diced tomatoes, crisp cabbage, and onion.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Fresh Chapati", "Farm Eggs", "Diced Tomatoes", "Shredded Cabbage"],
    dietary: "vegetarian"
  },
  {
    id: "sausages-pair",
    name: "Sausages Pair",
    category: "breakfast_snacks",
    subcategory: "Savory Bites",
    price: 5000,
    description: "Pair of juicy, perfectly grilled seasoned beef sausages served hot.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Beef Sausages", "Mild Mustard Dip"],
    dietary: "meat"
  },
  {
    id: "samsa",
    name: "Samsa (Meat Samosa)",
    category: "breakfast_snacks",
    subcategory: "Savory Bites",
    price: 5000,
    description: "Golden flaky pastry pockets generously stuffed with spiced minced meat, onions, and cumin.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    popular: true,
    ingredients: ["Crisp Pastry", "Spiced Minced Beef", "Spring Onions", "Lime"],
    dietary: "meat"
  },
  {
    id: "kebab",
    name: "Kebab",
    category: "breakfast_snacks",
    subcategory: "Savory Bites",
    price: 5000,
    description: "Skewered spiced minced meat grilled over hot coals with fragrant garlic and chili rub.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Minced Beef", "Garlic & Herbs", "Charcoal Grill"],
    dietary: "meat"
  },
  {
    id: "chap",
    name: "Meat Chap",
    category: "breakfast_snacks",
    subcategory: "Savory Bites",
    price: 5000,
    description: "Seasoned potato croquette filled with savory spiced minced meat and pan-crisped to golden brown.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Mashed Potatoes", "Spiced Minced Meat", "Golden Crust"],
    dietary: "meat"
  },
  {
    id: "chapat",
    name: "Chapat (Chapati)",
    category: "breakfast_snacks",
    subcategory: "Bakery & Breads",
    price: 2000,
    description: "Classic East African flaky, layered flatbread, freshly cooked on the griddle with golden crispy spots.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    popular: true,
    ingredients: ["Wheat Flour", "Sunflower Oil", "Sea Salt"],
    dietary: "vegetarian"
  },
  {
    id: "mandanzi",
    name: "Mandanzi (Mandazi)",
    category: "breakfast_snacks",
    subcategory: "Bakery & Breads",
    price: 2000,
    description: "Fluffy, golden East African fried sweet dough scented with aromatic cardamom.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    ingredients: ["Cardamom", "Sweet Dough", "Crisp Golden Fry"],
    dietary: "vegetarian"
  },
  {
    id: "cakes",
    name: "Fresh Cake Slice",
    category: "breakfast_snacks",
    subcategory: "Bakery & Breads",
    price: 3000,
    description: "Moist freshly baked sponge tea cake slice, sweet and soft.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    ingredients: ["Vanilla Sponge", "Sugar Glaze"],
    dietary: "vegetarian"
  },
  {
    id: "scones",
    name: "Scones",
    category: "breakfast_snacks",
    subcategory: "Bakery & Breads",
    price: 5000,
    description: "Traditional golden oven-baked sweet scones with rich buttery texture.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    ingredients: ["Butter", "Flour", "Sweet Cream"],
    dietary: "vegetarian"
  },
  {
    id: "cookies",
    name: "Papaz Fresh Cookies",
    category: "breakfast_snacks",
    subcategory: "Bakery & Breads",
    price: 3000,
    description: "Crisp-edged, freshly baked butter cookies with rich chocolate chips and warm vanilla spice. Perfect accompaniment with hot tea or chilled fresh juice.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    popular: true,
    ingredients: ["Butter", "Flour", "Chocolate Chips", "Vanilla Extract", "Brown Sugar"],
    dietary: "vegetarian"
  },
  {
    id: "katogo-matooke",
    name: "Katogo (Matooke & Beef Stew)",
    category: "breakfast_snacks",
    subcategory: "Breakfast Delicacies",
    price: 10000,
    description: "Uganda's legendary hearty morning breakfast: soft steamed matooke slow-cooked with tender beef chunks, fresh tomatoes, and savory rich broth.",
    image: "/src/assets/images/food_beef_luwombo_1793271704441.jpg",
    popular: true,
    ingredients: ["Fresh Green Matooke", "Braised Beef Chunks", "Tomatoes", "Onions", "Spiced Gravy"],
    dietary: "meat"
  },
  {
    id: "spanish-omelette",
    name: "Spanish Omelette & Toast",
    category: "breakfast_snacks",
    subcategory: "Breakfast Delicacies",
    price: 6000,
    description: "Fluffy 3-egg omelette loaded with diced bell peppers, sweet red onions, tomatoes, and herbs, served with golden buttered toast.",
    image: "/src/assets/images/food_ugandan_rolex_1793271704589.jpg",
    ingredients: ["3 Farm Eggs", "Bell Peppers", "Red Onions", "Fresh Coriander", "Toasted Bread"],
    dietary: "vegetarian"
  },

  // --- BEVERAGES ---
  {
    id: "passion-juice",
    name: "Passion Fruit Juice",
    category: "beverages",
    subcategory: "Fresh Juices",
    price: 5000,
    description: "Freshly squeezed authentic Ugandan purple passion fruit juice served icy cold and refreshingly sweet-tart.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    popular: true,
    ingredients: ["Fresh Passion Fruit", "Chilled Spring Water", "Raw Cane Sugar"],
    dietary: "vegetarian"
  },
  {
    id: "cocktail-juice",
    name: "Tropical Cocktail Juice",
    category: "beverages",
    subcategory: "Fresh Juices",
    price: 7000,
    description: "Papaz signature blend of fresh sweet mango, ripe passion fruit, watermelon, and pineapple over crushed ice.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    popular: true,
    isSpecialty: true,
    ingredients: ["Mango", "Passion Fruit", "Pineapple", "Melon", "Mint"],
    dietary: "vegetarian"
  },
  {
    id: "mango-juice",
    name: "Fresh Mango Juice",
    category: "beverages",
    subcategory: "Fresh Juices",
    price: 7000,
    description: "Thick, luscious nectar made from sun-ripened tropical Ugandan mangoes.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["Ripe Mango Nectar", "Crushed Ice"],
    dietary: "vegetarian"
  },
  {
    id: "pineapple-juice",
    name: "Fresh Pineapple Juice",
    category: "beverages",
    subcategory: "Fresh Juices",
    price: 7000,
    description: "Cold-pressed sweet and zesty tropical pineapple juice packed with vitamins and enzymes.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["Fresh Sweet Pineapple", "Chilled Ice"],
    dietary: "vegetarian"
  },
  {
    id: "melon-juice",
    name: "Fresh Melon Juice",
    category: "beverages",
    subcategory: "Fresh Juices",
    price: 7000,
    description: "Crisp and cooling freshly blended sweet watermelon juice, incredibly refreshing on warm afternoons.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["Fresh Watermelon", "Hint of Lime"],
    dietary: "vegetarian"
  },
  {
    id: "soda",
    name: "Soda (Chilled Glass Bottle)",
    category: "beverages",
    subcategory: "Chilled Drinks",
    price: 3000,
    description: "Ice-cold bottled soda: Coca-Cola, Fanta Orange, Sprite, Stoney Tangawisi, or Novida.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["300ml Chilled Bottle"],
    dietary: "vegetarian"
  },
  {
    id: "mineral-water",
    name: "Mineral Water (Bottled)",
    category: "beverages",
    subcategory: "Chilled Drinks",
    price: 3000,
    description: "Pure refreshing sealed natural spring mineral water bottle.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["Natural Spring Water 500ml"],
    dietary: "vegetarian"
  },
  {
    id: "african-spiced-tea",
    name: "African Spiced Milk Tea (Chai)",
    category: "beverages",
    subcategory: "Hot Beverages",
    price: 3000,
    description: "Steaming hot traditional Ugandan tea brewed with fresh crushed ginger, cinnamon, cardamom, cloves, and whole creamy milk.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    popular: true,
    ingredients: ["Fresh Cow Milk", "Black Tea Leaves", "Fresh Ginger", "Cardamom & Spices"],
    dietary: "vegetarian"
  },
  {
    id: "dawa-tea",
    name: "Dawa Herbal Tea (Ginger, Lemon & Honey)",
    category: "beverages",
    subcategory: "Hot Beverages",
    price: 4000,
    description: "Soothing immunity-boosting hot herbal infusion with crushed fresh ginger root, freshly squeezed lemon juice, and pure organic honey.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    isSpecialty: true,
    ingredients: ["Crushed Ginger Root", "Fresh Lemon", "Pure Honey", "Hot Spring Water"],
    dietary: "vegetarian"
  },
  {
    id: "black-coffee",
    name: "Ugandan Arabica Black Coffee",
    category: "beverages",
    subcategory: "Hot Beverages",
    price: 3000,
    description: "Freshly brewed rich and aromatic Ugandan highland Arabica coffee served piping hot with optional brown sugar.",
    image: "/src/assets/images/food_fresh_tropical_juices_1793271705994.jpg",
    ingredients: ["100% Ugandan Arabica Coffee", "Hot Filtered Water"],
    dietary: "vegetarian"
  },

  // --- SIDES & EXTRAS ---
  {
    id: "side-beans",
    name: "Side Beans Portion",
    category: "sides",
    subcategory: "Accompaniments",
    price: 5000,
    description: "Extra side bowl of rich savory slow-cooked stewed beans.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Stewed Red Beans", "Savory Broth"],
    dietary: "vegetarian"
  },
  {
    id: "side-gnuts",
    name: "G. Nuts Sauce (Side)",
    category: "sides",
    subcategory: "Accompaniments",
    price: 0,
    description: "Rich traditional roasted groundnut sauce served complimentary with meals as shown on menu board.",
    image: "/src/assets/images/hero_papaz_feast_1793271703559.jpg",
    ingredients: ["Roasted Groundnut Paste", "Herbs"],
    dietary: "vegetarian"
  }
];
