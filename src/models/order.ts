export class Order {
  id: string;
  customerName: string;
  email: string;
  products: ProductOrder[];
  orderCode: string;
  timestamp: Date;
  total : number =0

  constructor(
    id: string = '',               // Asignar valor por defecto
    customerName: string = '',    // Asignar valor por defecto
    email: string = '',           // Asignar valor por defecto
    products: ProductOrder[] = [], // Asignar valor por defecto
    orderCode: string = '',       // Asignar valor por defecto
    timestamp: Date = new Date() 
   // Asignar valor por defecto
  ) {
    this.id = id;
    this.customerName = customerName;
    this.email = email;
    this.products = products;
    this.orderCode = orderCode;
    this.timestamp = timestamp;
  }
}

export class ProductOrder {
  productId: string | undefined;
  quantity: number | undefined;
  stock: number | undefined;
  price: number | undefined;
  total: number | undefined;

  constructor(
    productId: string = '',       // Asignar valor por defecto
    quantity: number = 0,         // Asignar valor por defecto
    stock: number = 0,            // Asignar valor por defecto
    price: number = 0             // Asignar valor por defecto
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.stock = stock;
    this.price = price;
    this.total = quantity * price;
  }
}