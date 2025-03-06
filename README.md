# NextShop E-commerce Platform

A modern e-commerce platform built with Next.js 15, featuring Stripe payments and cash on delivery options.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add, remove, and update product quantities
- **Checkout Process**: Multiple payment options
  - Stripe integration for credit/debit card payments
  - Cash on delivery option
- **Order Management**: Track order status and history
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **State Management**: React Context API, Zustand
- **UI Components**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- Stripe account for payment processing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextshop.git
   cd nextshop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"

   # Next Auth
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages and API routes
│   │   ├── api/         # API endpoints
│   │   ├── auth/        # Authentication pages
│   │   ├── cart/        # Shopping cart page
│   │   ├── checkout/    # Checkout flow
│   │   └── products/    # Product listings
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── ui/          # UI components
│   ├── lib/             # Utility functions and hooks
│   │   └── hooks/       # Custom React hooks
│   └── types/           # TypeScript type definitions
└── ...
```

## Payment Testing

For testing Stripe payments, use the following test card details:
- Card Number: 4242 4242 4242 4242
- Expiry Date: Any future date
- CVC: Any 3 digits
- Name: Any name

## Deployment

This application can be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
