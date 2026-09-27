# RAZEN Perfume — Next.js E-Commerce Website

Build a complete, production-ready perfume e-commerce website inspired by the existing RAZEN perfume website.

## 1. Existing Website Assets

I have already downloaded the RAZEN website assets using HTTrack Website Copier.

The downloaded assets are located at:

```text
D:\websiteclones\razen-perfume\Razen
```

### Important

First inspect this entire directory and understand:

* Existing images
* Logos
* Fonts
* Icons
* CSS
* Product images
* Background images
* Any other useful visual assets

Reuse the available RAZEN assets wherever appropriate.

**Do not simply run the HTTrack HTML as the website.**

Rebuild the website properly using Next.js components while using the downloaded assets for visual inspiration and product imagery.

The final website should look like a polished, modern perfume brand website rather than looking like a raw website clone.

---

# 2. Technology Stack

Use:

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* Next.js API routes / Server Actions where appropriate
* Cloudflare R2 for product images
* SMTP for transactional emails
* Secure admin authentication
* Responsive design

Use clean and maintainable architecture.

Do NOT use React CRA.

---

# 3. Brand / Website Concept

The brand is **RAZEN Perfume**.

The website should feel:

* Premium
* Minimal
* Elegant
* Modern
* Luxury
* Fashion-oriented
* Image-focused
* Mobile friendly

Avoid making the website look like a generic Shopify template.

Use large product photography, whitespace, elegant typography, subtle animations and a premium color palette based on the existing RAZEN assets.

---

# 4. Product Catalog

RAZEN currently has only around 3 signature perfumes.

Do NOT create a traditional large "Shop" page containing hundreds of products.

Instead, create a premium curated collection experience.

For example:

### Homepage

Hero section

↓

Featured / Signature Collection

↓

3 perfume products

↓

Brand story

↓

Fragrance discovery section

↓

Call to action

↓

Footer

---

# 5. Product Categories

Although there are only a few products, the database must support categories.

Products should support:

* Male
* Female
* Unisex

The user should be able to filter products by these categories.

Example:

```text
Shop

All
Men
Women
Unisex
```

However, because the catalog is small, keep the UI elegant and simple.

Do not make filtering unnecessarily complicated.

---

# 6. Product Database

Create a proper product management system.

Suggested Product model:

```text
Product
---------
id
name
slug
description
shortDescription
price
compareAtPrice
category
stock
sku
size
fragranceNotes
topNotes
middleNotes
baseNotes
featured
active
createdAt
updatedAt
```

Products should also support multiple images.

Create a separate ProductImage model:

```text
ProductImage
------------
id
productId
imageUrl
r2Key
altText
sortOrder
createdAt
```

The admin should be able to:

* Create product
* Edit product
* Delete product
* Enable/disable product
* Set price
* Set stock
* Set category
* Upload images
* Set featured product
* Reorder product images
* Add fragrance notes
* Add product description

---

# 7. Cloudflare R2 Image Storage

Do NOT store uploaded product images inside the Next.js server permanently.

Use **Cloudflare R2**.

Create an image upload system where the admin can upload product images from the admin portal.

The flow should be:

```text
Admin
 ↓
Select Image
 ↓
Next.js API
 ↓
Cloudflare R2
 ↓
Return public image URL
 ↓
Save URL + R2 key in PostgreSQL
```

Use environment variables:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

Use the official S3-compatible API for Cloudflare R2.

Images should be optimized for Next.js.

Configure `next/image` correctly for the R2 domain.

---

# 8. Homepage

Create a premium homepage.

Suggested structure:

## Hero

Large visual hero section.

Use the downloaded RAZEN assets where appropriate.

Include:

```text
RAZEN

Signature fragrances,
crafted for presence.

[Explore Collection]
```

The exact copy can be adapted to fit the existing RAZEN branding.

---

## Signature Collection

Show the 3 main perfumes in a visually impressive layout.

Example:

```text
THE SIGNATURE COLLECTION

[Product 1]   [Product 2]   [Product 3]
```

Each product card should contain:

* Image
* Name
* Category
* Price
* Short description
* View product button

---

## Brand Story

Create a short editorial section describing the brand.

Use large imagery and elegant typography.

---

## Fragrance Discovery

Explain:

* Top Notes
* Heart Notes
* Base Notes

This should visually communicate the fragrance experience.

---

# 9. Product Details Page

URL:

```text
/products/[slug]
```

Product page should contain:

* Large image gallery
* Product name
* Category
* Price
* Compare-at price if applicable
* Description
* Size
* Fragrance notes
* Stock status
* Quantity selector
* Add to cart
* Buy now

Example:

```text
RAZEN
Signature No. 01

Rs. 7,500

50ml

[ - ] 1 [ + ]

[ Add to Cart ]

[ Buy Now ]
```

Make the image gallery premium and responsive.

On mobile, use a swipeable image gallery.

---

# 10. Shopping Cart

Create a proper cart system.

Cart should support:

* Add product
* Remove product
* Change quantity
* Calculate subtotal
* Shipping
* Total

Cart page:

```text
Your Cart

Product
Quantity
Price
Subtotal

Subtotal
Shipping
Total

[Proceed to Checkout]
```

For a small perfume store, keep checkout simple.

---

# 11. Checkout

Create a simple checkout.

Fields:

```text
Full Name
Email
Phone
Address
City
Province
Postal Code
Order Notes
```

Payment method should initially support:

```text
Cash on Delivery
```

Structure the database so online payment can be added later.

Before submitting the order, show:

```text
Order Summary
Shipping Information
Total Amount

[Place Order]
```

---

# 12. Order System

Create a complete order management system.

Order model:

```text
Order
-----
id
orderNumber
customerName
email
phone
address
city
province
postalCode
notes
subtotal
shippingAmount
totalAmount
paymentMethod
paymentStatus
status
trackingNumber
createdAt
updatedAt
```

OrderItem:

```text
OrderItem
---------
id
orderId
productId
productName
productImage
quantity
unitPrice
totalPrice
```

Store product name and price in OrderItem so historical orders don't change if the product is later edited.

---

# 13. Order Status

Orders must support these statuses:

```text
PENDING
CONFIRMED
DISPATCHED
COMPLETED
CANCELLED
RETURNED
```

Admin should be able to move an order between statuses.

Recommended flow:

```text
Pending
   ↓
Confirmed
   ↓
Dispatched
   ↓
Completed
```

Alternative paths:

```text
Pending → Cancelled

Confirmed → Cancelled

Dispatched → Returned

Completed → Returned
```

Do not allow nonsensical status transitions without confirmation.

---

# 14. Order Status History

Create an OrderStatusHistory table.

```text
OrderStatusHistory
------------------
id
orderId
status
comment
createdAt
```

Every time an admin changes the order status, create a history record.

Example:

```text
Order #RAZ-10231

Pending
21 Sep 2026 01:15 PM

Confirmed
21 Sep 2026 02:10 PM

Dispatched
22 Sep 2026 10:30 AM
Tracking: TRK123456
```

This will be used by the customer order tracking page.

---

# 15. Customer Order Tracking

Create:

```text
/track-order
```

Customer enters:

```text
Order Number
Email or Phone
```

Then show the order.

Example:

```text
Order #RAZ-10231

✓ Order Placed
✓ Confirmed
✓ Dispatched
○ Completed
```

Show:

* Order number
* Order date
* Current status
* Items
* Total
* Shipping information
* Tracking number
* Status history

Do not require customers to create an account just to track an order.

---

# 16. Admin Portal

Create a separate admin portal.

Example:

```text
/admin/login
/admin
/admin/orders
/admin/products
/admin/customers
/admin/settings
```

Admin portal should have authentication.

Do not expose admin pages publicly.

Protect all admin APIs/server actions with authentication and authorization.

---

# 17. Admin Dashboard

Dashboard should show:

```text
Total Orders
Pending Orders
Confirmed Orders
Dispatched Orders
Completed Orders
Cancelled Orders
Returned Orders

Total Revenue
Today's Orders
Today's Revenue
```

Also show a recent orders table:

```text
Order #
Customer
Amount
Status
Date
Actions
```

---

# 18. Admin Orders Page

Create:

```text
/admin/orders
```

Features:

* Search order number
* Search customer
* Filter status
* Filter date
* View order
* Change status
* Add tracking number
* Add admin comment

Order details page:

```text
Order #RAZ-10231

Customer Information

Order Items

Shipping Information

Payment Information

Order Status

[Confirm Order]
[Dispatch]
[Complete]
[Cancel]
[Return]
```

Only show relevant status actions based on the current status.

---

# 19. Admin Product Management

Create:

```text
/admin/products
```

Show:

```text
Image
Product
Category
Price
Stock
Status
Featured
Actions
```

Buttons:

```text
Add Product
Edit
Delete
Enable/Disable
```

Product editor should support R2 image upload.

Allow multiple product images.

---

# 20. Customer Management

Create:

```text
/admin/customers
```

Customers can be derived from orders.

Show:

```text
Name
Email
Phone
Number of Orders
Total Spent
Last Order
```

Customer details should show their order history.

Do not require customer accounts initially.

---

# 21. Support / Contact Page

Create:

```text
/contact
```

and optionally:

```text
/support
```

Contact form:

```text
Name
Email
Phone
Subject
Message

[Send Message]
```

Display the official support email prominently.

Use an environment variable:

```env
SUPPORT_EMAIL=
```

Do not hardcode sensitive email configuration.

---

# 22. SMTP Email System

Implement transactional emails using SMTP.

Environment variables:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SUPPORT_EMAIL=
```

Use Nodemailer or another reliable SMTP library.

Emails should be sent automatically for order events.

---

# 23. Order Confirmation Email

When an order is successfully placed:

Send an email to the customer.

Subject:

```text
RAZEN Order Confirmation — #RAZ-10231
```

Email should contain:

```text
Thank you for your order.

Order Number
Order Date

Products
Quantity
Price

Subtotal
Shipping
Total

Shipping Address

Track your order:
[Track Order]
```

Use a beautiful HTML email matching the RAZEN brand.

---

# 24. Status Change Emails

Whenever an admin changes the order status, send the customer an email.

### Confirmed

Subject:

```text
Your RAZEN Order Has Been Confirmed
```

### Dispatched

Subject:

```text
Your RAZEN Order Has Been Dispatched
```

Include tracking number when available.

### Completed

Subject:

```text
Your RAZEN Order Has Been Completed
```

### Cancelled

Subject:

```text
Your RAZEN Order Has Been Cancelled
```

Include the reason/comment if provided.

### Returned

Subject:

```text
Your RAZEN Order Has Been Marked as Returned
```

Every status email should contain:

* Customer name
* Order number
* Current status
* Order summary
* Tracking link where applicable
* Support contact

---

# 25. Email Reliability

Do not allow email failure to cause the order itself to fail.

For example:

```text
Order Created
     ↓
Database transaction succeeds
     ↓
Attempt email
     ↓
Email succeeds / fails
```

If SMTP fails:

* Keep the order
* Log the email error
* Allow the admin to retry the email later

Create an email log table if appropriate.

---

# 26. Contact Form Email

When a customer submits the contact form:

Send the message to:

```env
SUPPORT_EMAIL
```

Also optionally send an acknowledgement email to the customer.

Protect the contact form against spam.

Add basic:

* Validation
* Rate limiting
* Email validation
* Server-side validation

---

# 27. Navigation

Keep navigation minimal.

Suggested:

```text
RAZEN

Home
Collection
Men
Women
Unisex
Our Story
Contact

Cart
```

Do not make the navigation huge.

Because the store only has a few products, the website should feel curated.

---

# 28. Footer

Footer should contain:

```text
RAZEN

A modern fragrance house.

Shop
Men
Women
Unisex

Support
Contact
Track Order

Social
Instagram
Facebook

© RAZEN
All rights reserved.
```

Use actual social links/configuration only when provided.

---

# 29. Responsive Design

The website MUST work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Pay particular attention to:

* Hero section
* Product grid
* Product gallery
* Cart
* Checkout
* Admin tables
* Admin forms

On mobile, admin tables should become cards or horizontally scrollable where appropriate.

---

# 30. SEO

Implement proper Next.js metadata.

Each product should have:

* Title
* Description
* Open Graph image
* Canonical URL

Create:

```text
/sitemap.xml
/robots.txt
```

Use product structured data where appropriate.

---

# 31. Security

Implement:

* Secure admin authentication
* Password hashing
* HTTP-only cookies
* CSRF protection where applicable
* Input validation
* Server-side authorization
* Rate limiting for public forms
* SQL injection protection through Prisma
* Secure file upload validation
* Image MIME/type validation
* File size limits
* Do not expose R2 credentials to the browser
* Do not expose SMTP credentials
* Do not expose database credentials

Never put:

```text
R2_SECRET_ACCESS_KEY
SMTP_PASSWORD
DATABASE_URL
```

in client-side code.

---

# 32. Environment Variables

Create:

```env
DATABASE_URL=

NEXT_PUBLIC_SITE_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

SUPPORT_EMAIL=

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Prefer a proper admin user table instead of permanently relying on ADMIN_PASSWORD after initial setup.

---

# 33. Database

Use Prisma migrations.

Create all required tables.

At minimum:

```text
AdminUser
Product
ProductImage
Order
OrderItem
OrderStatusHistory
EmailLog
ContactMessage
```

Use appropriate indexes for:

* orderNumber
* email
* phone
* status
* product slug
* createdAt

---

# 34. Admin UI Design

The admin portal does NOT need to look like the customer-facing luxury website.

Make it:

* Simple
* Clean
* Fast
* Bootstrap/dashboard-like
* Responsive

Use a sidebar:

```text
Dashboard
Orders
Products
Customers
Messages
Settings
Logout
```

Dashboard cards and tables should be easy to use.

---

# 35. Customer UI Design

The customer website should be much more visual.

Use:

* Large imagery
* Elegant typography
* Generous whitespace
* Subtle hover effects
* Smooth transitions
* Product-focused layouts
* Minimal buttons
* Premium editorial sections

Do not overcrowd the page.

---

# 36. Animations

Use subtle animations only.

Examples:

* Fade-in hero
* Image hover zoom
* Product reveal
* Smooth page transitions
* Cart interaction

Avoid excessive animations that hurt performance.

---

# 37. Performance

Optimize for fast loading.

Use:

* Next.js Image
* Lazy loading
* Proper image dimensions
* Server components where appropriate
* Minimal client-side JavaScript
* Database indexes
* Efficient queries

Do not load unnecessary HTTrack CSS/JS from the old website.

Extract only the visual assets that are actually needed.

---

# 38. Important Development Requirement

Before writing the UI:

1. Inspect:

```text
D:\websiteclones\razen-perfume\Razen
```

2. Identify the original:

   * Logo
   * Product images
   * Fonts
   * Colors
   * Icons
   * Layout inspiration

3. Build the new Next.js application around those assets.

4. Do not blindly copy the old site's HTML.

5. Do not copy unnecessary scripts or tracking code from the downloaded website.

6. Keep the new implementation clean and maintainable.

---

# 39. Suggested Project Structure

Use a structure similar to:

```text
razen/
│
├── app/
│   ├── page.tsx
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── cart/
│   ├── checkout/
│   ├── track-order/
│   ├── contact/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── page.tsx
│   │   ├── orders/
│   │   ├── products/
│   │   ├── customers/
│   │   ├── messages/
│   │   └── settings/
│   │
│   └── api/
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── admin/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── r2.ts
│   ├── email.ts
│   └── orders.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── razen-assets/
│
└── ...
```

Adjust the structure if there is a better Next.js architecture.

---

# 40. Seed Data

Create Prisma seed data for the initial 3 RAZEN perfumes.

Use the actual product information available in the downloaded RAZEN assets/site where it can be reliably identified.

Do not invent product specifications if they are not present.

Create approximately:

```text
3 Products
```

with appropriate categories and images.

---

# 41. Admin Initial Setup

Create a secure way to create the first admin account.

Do not hardcode credentials into the source code.

For development, provide a seed/setup mechanism.

For production, require the admin password to come from secure configuration or a setup command.

---

# 42. Order Number

Generate human-friendly order numbers.

Format:

```text
RAZ-10001
RAZ-10002
RAZ-10003
```

Order numbers must be unique.

Do not expose the database numeric ID as the customer-facing order number.

---

# 43. Stock Management

When an order is placed:

```text
Product Stock
     ↓
Decrease quantity
```

Prevent customers from ordering more than available stock.

Handle concurrent orders safely using database transactions.

If an order is cancelled or returned, define a clear stock-restoration strategy.

---

# 44. Order Status UI

Use a visual status timeline.

Example:

```text
● Pending
│
● Confirmed
│
● Dispatched
│
○ Completed
```

For cancelled/returned orders:

```text
● Pending
│
● Confirmed
│
● Cancelled
```

Show dates for every completed status.

---

# 45. No Customer Account Requirement

Initially, customers should NOT need to register/login.

The shopping experience should be:

```text
Browse
 ↓
Product
 ↓
Cart
 ↓
Checkout
 ↓
Order
 ↓
Email Confirmation
 ↓
Track Order
```

This keeps the website simple.

The architecture can support customer accounts later.

---

# 46. Final UX Goal

The finished website should feel like a **small premium perfume house with three carefully curated fragrances**, not like a massive marketplace.

The key idea is:

```text
3 Products
+
Premium Branding
+
Simple Shopping
+
Excellent Product Pages
+
Simple Checkout
+
Order Tracking
+
Admin Order Management
```

Keep everything intentionally simple.

---

# 47. Development Process

Work in this order:

### Phase 1

Inspect the RAZEN HTTrack assets.

### Phase 2

Initialize Next.js project.

### Phase 3

Build database + Prisma schema.

### Phase 4

Build customer-facing UI.

### Phase 5

Build product/catalog system.

### Phase 6

Build cart + checkout.

### Phase 7

Build order system.

### Phase 8

Build admin authentication.

### Phase 9

Build admin dashboard.

### Phase 10

Build R2 image upload.

### Phase 11

Build SMTP email system.

### Phase 12

Build order tracking.

### Phase 13

Build contact/support system.

### Phase 14

SEO + performance + security.

### Phase 15

Test the complete flow.

---

# 48. Required Testing

Test this complete scenario:

```text
Admin creates perfume
        ↓
Uploads image to Cloudflare R2
        ↓
Product appears on website
        ↓
Customer opens product
        ↓
Adds product to cart
        ↓
Checkout
        ↓
Order created
        ↓
Stock decreases
        ↓
Customer receives confirmation email
        ↓
Admin sees Pending order
        ↓
Admin confirms
        ↓
Customer receives Confirmed email
        ↓
Admin adds tracking number
        ↓
Admin dispatches
        ↓
Customer receives Dispatched email
        ↓
Customer tracks order
        ↓
Admin completes order
        ↓
Customer receives Completed email
```

Also test:

```text
Pending → Cancelled
Confirmed → Cancelled
Dispatched → Returned
Completed → Returned
```

Make sure emails, status history and stock handling work correctly.

---

# 49. Important Final Instruction

Do not stop after creating only the homepage.

Build the complete working application including:

* Customer website
* Product catalog
* Product detail pages
* Categories
* Cart
* Checkout
* Orders
* Order tracking
* Admin login
* Admin dashboard
* Product management
* R2 image uploads
* Order status management
* Status history
* Customer/order management
* Contact/support
* SMTP transactional emails
* Database
* Prisma migrations
* Seed data
* Validation
* Security
* Responsive design

The final result should be runnable locally with:

```bash
npm install
npm run dev
```

and should be structured so it can later be deployed to a production VPS/IIS or another Node.js hosting environment.

Before considering the task complete, verify that there are no TypeScript errors, broken routes, missing environment variables, broken images, or non-functional admin actions.
