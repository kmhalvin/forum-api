# Automation Testing Guide

Welcome to the Trendy Tech shop!

## Application Overview

This is a Next.js 14 application that combines Server-Side Rendering (SSR) and Client-Side Rendering (CSR). 
It features:
- **Product Listing:** View products loaded from an SQLite database.
- **Cart Management:** Add products to a client-side cart (managed with Zustand and `localStorage`).
- **Authentication:** NextAuth.js credentials provider for signing up and logging in. 
- **Checkout:** A mock payment form that submits an order to the backend (requires authentication).
- **Admin Dashboard:** A protected route where admins can view and delete users and orders.

### Session Management (Cookies)
Authentication sessions are managed using **HTTP-only, encrypted cookies** (NextAuth's default JWT strategy).
- When a user logs in, an encrypted token containing their session data (like `id` and `role`) is stored in a cookie (e.g., `next-auth.session-token`).
- Since the cookie is `HttpOnly`, it cannot be accessed directly via client-side JavaScript. 
- For test automation, if you need to bypass the login UI, you would need to programmatically set this cookie or simply automate the login form directly.

### Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **User** | `test@example.com` | `test1234` |

*Note: You can also create new user accounts via the Sign Up page.*

---

## Data Test IDs (`data-testid`)

To make testing easier and less brittle, almost all interactive and structural elements have been tagged with a `data-testid` attribute.

### Navigation / Global
- `navbar`: The main navigation bar container.
- `nav-home-link`: The logo link pointing to the homepage.
- `nav-cart-link`: The cart icon link.
- `cart-badge`: The badge showing the number of items in the cart (only renders if items > 0).
- `nav-admin-link`: Link to the admin dashboard (only visible to admins).
- `nav-login-link`: Link to the login page (visible to guests).
- `nav-logout-btn`: The logout button (visible when logged in).

### Home Page (`/`)
- `home-page`: Container for the home page.
- `home-title`: The main H1 title.
- `no-items-message`: Displays if the database has no items.
- `product-grid`: The grid container holding all product cards.
- `product-card-{id}`: The card container for a specific product.
- `product-title-{id}`: The title of the product.
- `product-desc-{id}`: The description of the product.
- `product-price-{id}`: The price of the product.
- `add-to-cart-{id}`: The button to add the product to the cart.

### Cart Page (`/cart`)
- `cart-page`: Container for the cart page.
- `cart-page-loading`: Loading state for the cart page.
- `cart-title`: The "Your Cart" title.
- `empty-cart-message`: Displays if the cart is empty.
- `continue-shopping-btn`: Button to return to the homepage when the cart is empty.
- `cart-items-list`: Container for the list of items in the cart.
- `cart-item-{id}`: A specific item in the cart.
- `cart-item-name-{id}`: The name of the item in the cart.
- `cart-item-price-{id}`: The price text of the item in the cart.
- `remove-from-cart-{id}`: The button to remove the item from the cart.
- `cart-summary-card`: The order summary card on the right side.
- `cart-total`: The total price display in the summary.
- `checkout-btn`: The button to proceed to the payment page.

### Login Page (`/auth/login`)
- `login-page`: Container for the login page.
- `login-form`: The form element.
- `login-email-input`: Email input field.
- `login-password-input`: Password input field.
- `login-submit-btn`: The submit button.
- `link-to-register`: The link to navigate to the sign-up page.

### Register Page (`/auth/register`)
- `register-page`: Container for the register page.
- `register-form`: The form element.
- `register-name-input`: Name input field.
- `register-email-input`: Email input field.
- `register-password-input`: Password input field.
- `register-submit-btn`: The submit button.
- `link-to-login`: The link to navigate to the login page.

### Payment Page (`/payment`)
- `payment-page`: Container for the payment page.
- `payment-unauthenticated`: Container shown if the user is not logged in.
- `login-to-pay-btn`: Button to navigate to login from the unauthenticated state.
- `payment-empty-cart`: Container shown if the user reaches payment with an empty cart.
- `payment-form`: The payment form element.
- `payment-total`: The total amount displayed above the form.
- `payment-name-input`: Name on card input.
- `payment-card-input`: Card number input.
- `payment-expiry-input`: Expiry date input.
- `payment-cvc-input`: CVC input.
- `payment-submit-btn`: The "Pay Now" submit button.

### Admin Dashboard (`/admin`)
- `admin-dashboard`: Container for the admin page.
- `admin-no-users`: Message displayed if no users exist.
- `admin-users-table`: The table element for users.
- `user-row-{id}`: A specific user row.
- `delete-user-{id}`: The button to delete a specific user.
- `admin-no-orders`: Message displayed if no orders exist.
- `admin-orders-table`: The table element for orders.
- `order-row-{id}`: A specific order row.
- `delete-order-{id}`: The button to delete a specific order.
