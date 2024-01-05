export const createData = (qty = 100) => {
  let data = [];

  for (let i = 0; i < qty; i++) {
    const d = {
      id: i,
      product: "Product " + i,
      price: Math.floor(Math.random() * 100),
      calories: Math.floor(Math.random() * 100),
      fat: Math.floor(Math.random() * 100),
      carbs: Math.floor(Math.random() * 100),
      protein: Math.floor(Math.random() * 100),
    };

    data.push(d);
  }

  return data;
};

export const COLUMNS = [
  {
    label: "Product",
    dataKey: "product",
  },
  {
    label: "Price\u00A0($)",
    dataKey: "price",
    width: 120,
  },
  {
    label: "Calories\u00A0(g)",
    dataKey: "calories",
    numeric: true,
    width: 120,
  },
  {
    label: "Fat\u00A0(g)",
    dataKey: "fat",
    numeric: true,
    width: 120,
  },
  {
    label: "Carbs\u00A0(g)",
    dataKey: "carbs",
    numeric: true,
    width: 120,
  },
  {
    label: "Protein\u00A0(g)",
    dataKey: "protein",
    numeric: true,
    width: 120,
  },
];
