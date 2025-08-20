# Frontend - Mental Wellness Seminar Landing Page

This is the frontend React application for the Pulse & Pause mental wellness seminar registration system.

## Features

- **Modern Landing Page**: Beautiful gradient design with professional layout
- **Speaker Profiles**: Two featured speakers with professional images and detailed bios
- **Registration Form**: Complete form with all required fields
- **Payment Integration**: Razorpay payment gateway integration
- **Responsive Design**: Works perfectly on all devices
- **Interactive UI**: Smooth animations and hover effects

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Razorpay
Replace the Razorpay key in `src/App.tsx`:
```javascript
key: 'rzp_test_your_key_here', // Replace with your actual Razorpay key
```

### 3. Update API Endpoint
The frontend is configured to connect to a backend at `http://localhost:5000`. Make sure your backend server is running on this port, or update the API URL in the `handleSubmit` function.

### 4. Run the Application
```bash
npm run dev
```

## Key Components

### Registration Form Fields
- Full Name
- Phone Number  
- Email Address
- Address
- Occupation
- Date of Birth

### Pricing Display
- Original Price: ₹499 (crossed out)
- Discounted Price: ₹99
- "Only for Today" urgency banner
- 80% OFF badge

### Speaker Information
- Dr. Sarah Chen - Clinical Psychologist
- Michael Johnson - Wellness Coach
- Professional images from Pexels
- Detailed expertise areas

## Payment Flow

1. User fills out registration form
2. Form data is sent to backend API
3. If successful, Razorpay payment modal opens
4. User completes payment
5. Success confirmation is shown

## API Integration

The frontend expects these backend endpoints:

- `POST /api/register` - Register new participant
- Response should be JSON with success status

## Customization

### Update Speaker Information
Edit the `speakers` array in `src/App.tsx`:
```javascript
const speakers = [
  {
    id: 1,
    name: "Your Speaker Name",
    title: "Their Title",
    // ... other fields
  }
];
```

### Change Pricing
Update the amount in the Razorpay options:
```javascript
amount: 9900, // Amount in paise (₹99 = 9900 paise)
```

### Modify Form Fields
Add or remove fields in the `FormData` interface and corresponding form inputs.

## Dependencies

- React 18
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Vite (build tool)

## Browser Support

- Modern browsers with ES6+ support
- Razorpay checkout requires JavaScript enabled
- Responsive design works on all screen sizes

## Notes

- Make sure to get proper Razorpay API keys from their dashboard
- Test payments should use Razorpay test keys
- For production, use live Razorpay keys and update CORS settings
- Images are loaded from Pexels CDN for demo purposes