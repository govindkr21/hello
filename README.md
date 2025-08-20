# Pulse & Pause - Mental Wellness Seminar Landing Page

A comprehensive seminar registration platform with payment integration and database management.

## Features

- **Beautiful Landing Page**: Modern gradient design matching the reference UI
- **Speaker Profiles**: Professional speaker cards with detailed information
- **Registration Form**: Complete form with all required fields
- **Payment Integration**: Secure Razorpay payment gateway
- **Database Storage**: MongoDB integration for storing registration data
- **Responsive Design**: Works on all devices
- **Real-time Validation**: Form validation and error handling

## Setup Instructions

### 1. Frontend Setup

The React frontend is already configured. Make sure you have the environment variables set up:

Create a `.env` file in the root directory:
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_API_URL=http://localhost:5000
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/seminar-registrations
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
```

### 3. MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically create the database and collections

### 4. Razorpay Setup

1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Get your API keys from the dashboard
3. Add them to your `.env` files

### 5. Running the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend (in a new terminal):
```bash
npm run dev
```

## API Endpoints

- `POST /api/register` - Register a new participant
- `POST /api/payment-success` - Confirm payment completion
- `GET /api/registrations` - Get all registrations (admin)
- `GET /api/health` - Health check

## Database Schema

The registration data includes:
- Name, Phone, Email
- Address, Occupation, Date of Birth
- Registration timestamp
- Payment status and details

## Payment Flow

1. User fills registration form
2. Data is saved to MongoDB
3. Razorpay payment modal opens
4. On successful payment, registration is confirmed
5. User receives confirmation

## Security Features

- Input validation and sanitization
- Secure payment processing via Razorpay
- Environment variable protection
- CORS configuration
- Error handling and logging

## Customization

- Update speaker information in `src/App.tsx`
- Modify pricing in the registration form
- Customize design colors and styling
- Add additional form fields as needed

## Deployment

1. Build the React app: `npm run build`
2. Deploy the backend to your preferred hosting service
3. Update API URLs in production environment
4. Configure production MongoDB and Razorpay credentials"# backend" 
