# Trucking Logistics Management System

## Overview

The **Trucking Logistics Management System** is a web application built using **Next.js**, **NextAuth** for authentication, **React Query** for data fetching, and **JSON Server** to simulate a REST API backend. The application aims to manage trucks, drivers, and orders in a logistics environment. The frontend is responsive and user-friendly, built with TypeScript and styled using SCSS.

## Features

### User Authentication (Google OAuth 2.0 with NextAuth)
- Implemented **Google OAuth 2.0** login using **NextAuth**.
- Users can log in using their Google accounts to access the dashboard.

### Dashboard (After Login)
- Upon login, users are redirected to a dashboard page.
- The dashboard displays the summary of available trucks, drivers, and active orders.
- A personalized welcome message with the user's name and email is shown.

### Truck Management
- Display a list of trucks with details such as **Truck ID**, **Plate Number**, **Capacity**, and **Status** (e.g., Available, Delivering, Maintenance).
- Users can **view**, **add**, **edit**, and **remove** trucks.
- A form is used for adding and editing truck details.
- Users can change the truck's status between **Available** and **Delivering**.

### Driver Management
- Display a list of drivers with details such as **Driver Name**, **License Number**, **Assigned Truck**, and **Contact Number**.
- Users can **view**, **add**, **edit**, and **remove** drivers.
- A form is used for adding and editing driver details.
- Users can assign a driver to a specific truck.

### Order Management
- Display a list of orders with details such as **Order ID**, **Customer Name**, **Truck Assigned**, **Driver Assigned**, and **Order Status** (e.g., Pending, In Progress, Completed).
- Users can **view**, **add**, and **edit** orders.
- Users can assign a driver to a specific order. When assigning a driver, the truck's status changes to **Delivering**.
- Drivers with a truck in **Delivering** status cannot be reassigned to new orders until the truck becomes available.
- Orders can be completed, and the truck status will return to **Available**.

### API Integration
- Uses **React Query** to fetch data from the backend.
- CRUD operations (Create, Read, Update, Delete) are performed on trucks, drivers, and orders.

### Mobile-Friendly Design
- The application is fully responsive and provides a good experience on both desktop and mobile devices.

### Error Handling
- Basic error handling is implemented to manage failed API requests.
- Form validation is applied with meaningful error messages.

## Project Requirements

- **Next.js** (v14 or higher) for building the frontend.
- **NextAuth** for Google OAuth 2.0 authentication.
- **JSON Server** for simulating a backend with mock data for trucks, drivers, and orders.
- **React Query** for handling API requests.
- **SCSS** for styling the application (no CSS framework).
- **TypeScript** for static typing.
- **State Management** with React state or Context API.

## Installation

### Prerequisites
Ensure that you have the following installed:
- **Node.js** and **npm** (version 14 or higher)

### 1. Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/Himbaza123h/tlms-fn.git
```

### 2. Install Dependencies
Navigate into the project directory and install the required dependencies:

```bash
cd tlms-fn
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project and add the following environment variables:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Make sure to replace the placeholder values with your actual credentials.

### 4. Start the JSON Server
Run the following command to start the **JSON Server** on port 3001:

```bash
json-server --watch db.json --port 3001
```

### 5. Run the Development Server
In a new terminal window, run the Next.js development server:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`.


## Conclusion
The **Trucking Logistics Management System** allows you to efficiently manage trucks, drivers, and orders. The system leverages the power of Next.js, NextAuth for authentication, React Query for data fetching, and JSON Server for simulating a backend. It provides a responsive and user-friendly interface to ensure smooth logistics operations.

Enjoy trucking logistics management system!
```