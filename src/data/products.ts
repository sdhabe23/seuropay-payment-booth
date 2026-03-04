export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export const ALL_PRODUCTS: Omit<Product, "quantity">[] = [
  { id: 1,  name: "Espresso",          price: 1.80,  category: "Drinks" },
  { id: 2,  name: "Cappuccino",        price: 2.90,  category: "Drinks" },
  { id: 3,  name: "Flat White",        price: 3.20,  category: "Drinks" },
  { id: 4,  name: "Orange Juice",      price: 2.50,  category: "Drinks" },
  { id: 5,  name: "Sparkling Water",   price: 1.50,  category: "Drinks" },
  { id: 6,  name: "Croissant",         price: 2.20,  category: "Food"   },
  { id: 7,  name: "Cheese Sandwich",   price: 4.50,  category: "Food"   },
  { id: 8,  name: "Club Sandwich",     price: 6.80,  category: "Food"   },
  { id: 9,  name: "Granola Bowl",      price: 5.20,  category: "Food"   },
  { id: 10, name: "Avocado Toast",     price: 7.50,  category: "Food"   },
  { id: 11, name: "Blueberry Muffin",  price: 2.80,  category: "Food"   },
  { id: 12, name: "Almond Milk Latte", price: 3.80,  category: "Drinks" },
  { id: 13, name: "Green Tea",         price: 2.10,  category: "Drinks" },
  { id: 14, name: "Chocolate Cake",    price: 4.90,  category: "Desserts"},
  { id: 15, name: "Tiramisu",          price: 5.50,  category: "Desserts"},
  { id: 16, name: "Brownie",           price: 3.10,  category: "Desserts"},
  { id: 17, name: "Bagel & Cream Cheese", price: 3.90, category: "Food" },
  { id: 18, name: "Fruit Salad",       price: 4.20,  category: "Food"   },
];

export function generateRandomOrder(): Product[] {
  const shuffled = [...ALL_PRODUCTS].sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * 7) + 2; // 2 to 8 items
  return shuffled.slice(0, count).map((p) => ({
    ...p,
    quantity: Math.floor(Math.random() * 3) + 1,
  }));
}
