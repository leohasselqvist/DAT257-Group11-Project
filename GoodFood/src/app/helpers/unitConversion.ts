export default function toKg(quantity: number, unit: string): number | null {
  switch (unit.toLowerCase().trim()) {
    case "g":
    case "gram":
    case "grams":
      return quantity / 1000;

    case "kg":
    case "kilogram":
    case "kilograms":
      return quantity;

    case "lb":
    case "pound":
    case "pounds":
      return (quantity * 450)/ 1000;

    // Approximate conversions 
    case "ml":
      return quantity / 1000;

    case "cl":
    case "centiliter":
    case "centiliters":
      return quantity / 100;

    case "dl":
    case "deciliter":
    case "deciliters":
      return quantity / 100;

    case "l":
    case "liter":
    case "liters":
      return quantity;

    case "tbsp":
    case "tablespoon":
    case "tablespoons":
      return (quantity * 15) / 1000;

    case "tsp":
    case "teaspoon":
    case "teaspoons":
      return (quantity * 5) / 1000;

    case "pinch":
    case "pinches":
      return (quantity * 0.3) / 1000;

    case "leaf":
    case "leaves":
      return (quantity * 0.5) / 1000;

    case "slice":
    case "slices":
      return (quantity * 30) / 1000;

    case "cup":
    case "cups":
      return (quantity * 240) / 1000;

    case "oz":
    case "ounce":
    case "ounces":
      return (quantity * 28) / 1000;

    case "piece":
    case "pieces":
      return (quantity * 100) / 1000;

    case "clove":
    case "cloves":
      return (quantity * 5) / 1000;

    case "bunch":
    case "bunches":
      return (quantity * 50) / 1000;

    case "sprig":
    case "sprigs":
      return (quantity * 10) / 1000;


    default:
      return null;
  }
}