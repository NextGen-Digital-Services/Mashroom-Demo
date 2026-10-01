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
        id: "prod-101",
        name: "Artisanal Lion's Mane Focus Powder",
        variant: "100g Glass Jar",
        price: 799,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "prod-104",
        name: "Himachali Spiced Oyster Mushroom Pickle",
        variant: "250g Glass Mason Jar",
        price: 349,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 1947,
    discount: 100,
    couponCode: "WELCOME10",
    tax: 92,
    shippingFee: 0,
    total: 1939,
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
        id: "prod-113",
        name: "Pink Pearl Oyster Mushroom Home Grow Log",
        variant: "Single Grow Kit Box",
        price: 699,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop"
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
        id: "prod-107",
        name: "Wild Foraged Himalayan Morel (Guchhi)",
        variant: "50g Luxury Box",
        price: 3499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?q=80&w=800&auto=format&fit=crop"
      }
    ],
    subtotal: 3499,
    discount: 350,
    couponCode: "FUNGI15",
    tax: 157,
    shippingFee: 0,
    total: 3306,
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
