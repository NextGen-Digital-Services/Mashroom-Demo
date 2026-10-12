export const initialOrders = [
  {
    id: "ORD-89241",
    date: "2026-09-28T14:32:00.000Z",
    customer: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98123 45678",
      address: "42 Golf Links, Apartment 3B",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110003"
    },
    items: [
      {
        id: "prod-105",
        name: "Mushroom Powder",
        variant: "100g Pouch",
        price: 449,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "prod-106",
        name: "Oyster Mushroom Pickle",
        variant: "250g Jar",
        price: 349,
        quantity: 1,
        image: "https://images.pexels.com/photos/8599631/pexels-photo-8599631.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    subtotal: 1247,
    discount: 100,
    couponCode: "WELCOME10",
    tax: 57,
    shippingFee: 0,
    total: 1204,
    status: "Delivered",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    trackingNumber: "TRK-IN-9920148",
    timeline: [
      { status: "Placed", time: "Sep 28, 02:32 PM", done: true },
      { status: "Confirmed", time: "Sep 28, 03:00 PM", done: true },
      { status: "Packed", time: "Sep 29, 09:15 AM", done: true },
      { status: "Shipped", time: "Sep 29, 02:30 PM", done: true },
      { status: "Delivered", time: "Oct 01, 11:20 AM", done: true }
    ]
  },
  {
    id: "ORD-89242",
    date: "2026-09-30T10:15:00.000Z",
    customer: {
      name: "Priyanjali Sen",
      email: "priya.sen@example.com",
      phone: "+91 97654 32109",
      address: "18 Jubilee Hills, Road No 10",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033"
    },
    items: [
      {
        id: "prod-112",
        name: "Oyster Mushroom Home Growing Kit",
        variant: "Single Grow Kit",
        price: 699,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 699,
    discount: 0,
    couponCode: "",
    tax: 35,
    shippingFee: 99,
    total: 833,
    status: "Shipped",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    trackingNumber: "TRK-IN-9920311",
    timeline: [
      { status: "Placed", time: "Sep 30, 10:15 AM", done: true },
      { status: "Confirmed", time: "Sep 30, 10:30 AM", done: true },
      { status: "Packed", time: "Sep 30, 04:00 PM", done: true },
      { status: "Shipped", time: "Oct 01, 09:00 AM", done: true },
      { status: "Delivered", time: "Expected Oct 03", done: false }
    ]
  },
  {
    id: "ORD-89243",
    date: "2026-10-01T08:45:00.000Z",
    customer: {
      name: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 99887 76655",
      address: "75 Koregaon Park, Lane 4",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    items: [
      {
        id: "prod-109",
        name: "Sun-Dried Shiitake Mushrooms",
        variant: "100g Pouch",
        price: 499,
        quantity: 1,
        image: "https://images.pexels.com/photos/12809556/pexels-photo-12809556.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    ],
    subtotal: 499,
    discount: 0,
    couponCode: "",
    tax: 25,
    shippingFee: 99,
    total: 623,
    status: "Confirmed",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    trackingNumber: "TRK-IN-9920405",
    timeline: [
      { status: "Placed", time: "Oct 01, 08:45 AM", done: true },
      { status: "Confirmed", time: "Oct 01, 09:15 AM", done: true },
      { status: "Packed", time: "Pending", done: false },
      { status: "Shipped", time: "Pending", done: false },
      { status: "Delivered", time: "Pending", done: false }
    ]
  }
];
