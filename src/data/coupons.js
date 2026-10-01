export const initialCoupons = [
  {
    id: "coup-1",
    code: "WELCOME10",
    discountType: "percentage", // percentage or flat
    discountValue: 10,
    minOrderAmount: 499,
    maxDiscount: 200,
    expiryDate: "2026-12-31",
    usageLimit: 1000,
    usedCount: 142,
    active: true,
    description: "10% Off on your first order over ₹499"
  },
  {
    id: "coup-2",
    code: "FUNGI15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 1499,
    maxDiscount: 500,
    expiryDate: "2026-11-30",
    usageLimit: 500,
    usedCount: 89,
    active: true,
    description: "15% Off on premium harvests over ₹1499"
  },
  {
    id: "coup-3",
    code: "FARMFLAT200",
    discountType: "flat",
    discountValue: 200,
    minOrderAmount: 1999,
    maxDiscount: 200,
    expiryDate: "2026-10-31",
    usageLimit: 250,
    usedCount: 45,
    active: true,
    description: "Flat ₹200 discount on combo packs & bulk orders"
  }
];
