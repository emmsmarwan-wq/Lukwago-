# Security Specification: Papaz Spot Firestore Rules

## 1. Data Invariants
- `orders`:
  1. An order document must contain a valid ID conforming to standard ID format (length <= 64, alphanumerics/hyphens).
  2. The `orderMode` must be one of `['dine-in', 'takeaway', 'delivery']`.
  3. `customerName` and `customerPhone` must be non-empty strings with strict length boundaries (<= 100 chars and <= 25 chars respectively).
  4. `subtotal` and `grandTotal` must be positive numbers (>= 0).
  5. `status` must be one of `['received', 'preparing', 'dispatched', 'delivered', 'cancelled']`.
  6. State transitions on updates can only modify operational status and timestamp (`status`, `updatedAt`).
  7. Creation is open for customers placing orders (guest checkout supported for physical dining and WhatsApp delivery).
  8. Reading individual orders (`get`) is allowed if the user provides the order ID or for tracking.
- `reviews`:
  1. Star rating must be an integer between 1 and 5.
  2. `customerName` <= 80 characters.
  3. `comment` <= 500 characters.
  4. Public read allowed for customer testimonials.

## 2. The "Dirty Dozen" Payloads (Must be blocked)
1. **Payload 1 (Ghost Field Injection)**: Attempt to inject `isStaff: true` or `vipDiscount: 100` into an order. (Blocked by `hasOnly()` key validator).
2. **Payload 2 (Massive String Poisoning)**: Setting `customerName` to a 50KB string. (Blocked by `.size() <= 100`).
3. **Payload 3 (Negative Price Manipulation)**: Setting `grandTotal` to `-50000`. (Blocked by `data.grandTotal >= 0`).
4. **Payload 4 (Invalid Status Enumeration)**: Setting `status: "free_meal"`. (Blocked by enum validation).
5. **Payload 5 (Order Tampering Update)**: Attempting to update `grandTotal` after order creation. (Blocked by update `affectedKeys().hasOnly(['status', 'updatedAt'])`).
6. **Payload 6 (Oversized Review Comment)**: Setting review comment to 5,000 characters. (Blocked by `.size() <= 500`).
7. **Payload 7 (Invalid Star Rating)**: Setting rating to `10` or `-1`. (Blocked by `data.rating >= 1 && data.rating <= 5`).
8. **Payload 8 (Arbitrary Document ID Attack)**: Writing to an order ID with malicious path characters like `../etc/passwd` or 1KB string. (Blocked by `isValidId(orderId)`).
9. **Payload 9 (Invalid Order Mode)**: Setting `orderMode: "teleport"`. (Blocked by enum whitelist).
10. **Payload 10 (Empty Items Array)**: Placing an order with `items` that is not a list. (Blocked by `data.items is list`).
11. **Payload 11 (Empty Customer Name)**: Order with `customerName == ""`. (Blocked by `size() >= 2`).
12. **Payload 12 (Empty Phone Number)**: Order with `customerPhone == ""`. (Blocked by `size() >= 7`).
