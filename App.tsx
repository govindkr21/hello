import React, { useState } from 'react';
import { Calendar, Clock, Users, Star, CheckCircle, User, Phone, Mail, MapPin, Briefcase, Cake } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  dob: string;
}

const speakers = [
  {
    id: 1,
    name: "Miss Neera Grover",
    title: "Clinical Psychologist",
    experience: "15+ years in mental health research",
    image:
      "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    description:
      "Specializing in cognitive behavioral therapy and mindfulness-based interventions for anxiety and depression.",
    expertise: ["Cognitive Behavioral Therapy", "Mindfulness Training", "Stress Management"],
  },
  {
    id: 2,
    name: "Dr. Divya Sharma",
    title: "Wellness Coach",
    experience: "Certified meditation instructor",
    image:
      "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    description:
      "Expert in workplace wellness programs and stress management techniques for modern professionals.",
    expertise: ["Meditation Practices", "Workplace Wellness", "Life Balance"],
  },
];

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    dob: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const API_BASE = import.meta.env.VITE_API_URL || '';
  const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1) Save registration
      const regRes = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const regData = await regRes.json();
      if (!regRes.ok || !regData.success) {
        throw new Error(regData.message || 'Registration failed');
      }
      const registrationId = regData?.data?.id || null;

      // 2) Create Razorpay order (₹99 => 9900 paise)
      const orderRes = await fetch(`${API_BASE}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 9900, registrationId }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok || !order.success || !order.id) {
        throw new Error(order.message || 'Order creation failed');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Ensure the script is included in index.html');
      }

      // 3) Open Razorpay checkout
      const options: any = {
        key: RZP_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Pulse & Pause Seminar',
        description: 'Mental Wellness Seminar Registration',
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#3B82F6' },
        handler: async function (response: any) {
          try {
            // 4) Verify on backend
            const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                registrationId,
              }),
            });
            const verify = await verifyRes.json();
            if (verifyRes.ok && verify.success) {
              setShowSuccess(true);
              setShowRegistration(false);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Could not verify payment.');
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Payment popup closed');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment/Registration error:', error);
      alert((error as any)?.message || 'Payment failed to start. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
    --- Kept original extra lines (commented) so no data is lost ---
    These lines were duplicated outside the try/catch and caused syntax errors.

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P&P</span>
            </div>
            <h1 className="text-white text-xl font-bold">Pulse & Pause</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-8">
              <div className="inline-block bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full text-sm">
                • Mental Wellness Seminar
              </div>

              <h3 className="text-5xl lg:text-6xl font-bold leading-tight">If your mind feels cluttered, your focus keeps slipping, or stress is starting to feel normal this session is for you</h3>

              <p className="text-xl text-gray-200 leading-relaxed">
                Pulse & Pause is organizing a live 90-minute experience designed to help you quiet the noise, take control of your thoughts, and feel like yourself again.
Led by psychologist Miss. Neera Grover, you'll walk away with practical tools to handle anxiety, improve focus, and feel more grounded in everyday life.
This isn’t theory  it’s real help, for real life.

              </p>

              <p className="text-lg text-gray-300">
                This 90-minute session is for anyone feeling mentally scattered, stuck in overthinking, or simply tired of feeling “off.” You’ll learn how to cut through distractions, calm the noise in your head, and rebuild your ability to focus—without relying on willpower alone. Using real, relatable tools backed by psychology (not fluff), we’ll show you how to manage anxiety as it comes, think with more clarity, and feel more in control of your day. If you’ve been craving a little breathing room and a clearer mind, this session might be exactly what you need.
              </p>

              <div className="space-y-4">
                <p className="text-gray-300">What you'll learn:</p>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Creating healthy work-life boundaries</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Practical meditation and breathing exercises</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Evidence-based mindfulness practices</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>Techniques for daily stress management</span>
                  </li>
                </ul>
              </div>

              {/* Event Details */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Sept 15, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span> 90-Minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Limited Seats</span>
                </div>
              </div>

              <button
                onClick={() => setShowRegistration(true)}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-12 py-6 rounded-xl font-bold text-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 w-full max-w-md"
              >
                <span>Register Now</span>
                <span className="text-2xl">→</span>
              </button>

              {/* Pricing and Urgency Boxes */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {/* Pricing Box */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex-1">
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-2">Special Price</p>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-gray-400 line-through text-2xl">₹499</span>
                      <span className="text-green-400 font-bold text-3xl">₹99</span>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mt-2 inline-block">
                      80% OFF
                    </div>
                  </div>
                </div>

                {/* Urgency Box */}
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-300/30 flex-1">
                  <div className="text-center">
                    <p className="text-red-300 font-bold text-lg mb-2">⏰ HURRY UP!</p>
                    <p className="text-white font-semibold text-xl">Register Fast</p>
                    <p className="text-red-200 text-sm mt-1">Only for Today</p>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block animate-pulse">
                      LIMITED TIME
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Speakers */}
            <div className="space-y-8">
              <h2 className="text-white text-3xl font-bold text-center mb-8">Featured Speakers</h2>

              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-50 h-50 rounded-full object-cover border-4 border-white/20"
                    />
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold">{speaker.name}</h3>
                      <p className="text-teal-300 font-medium">{speaker.title}</p>
                      <p className="text-gray-300 text-sm mb-2">{speaker.experience}</p>
                      <p className="text-gray-200 text-sm mb-3">{speaker.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {speaker.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="relative z-10 px-6 py-16 bg-gradient-to-r from-purple-800/50 to-blue-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">What You'll Learn</h2>
          <p className="text-xl text-gray-200 mb-12">
            Discover how to stay focused, manage anxiety, and unlock a calmer, more productive version of yourself.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🧠',
                title: 'Stress Management',
                description: 'Practical techniques for daily stress relief.',
              },
              {
                icon: '💙',
                title: 'Emotional Resilience',
                description: 'Build stronger mental and emotional strength.',
              },
              {
                icon: '🎯',
                title: 'Mindfulness Tools',
                description: 'Evidence-based mindfulness practices.',
              },
              {
                icon: '⚖️',
                title: 'Life Balance',
                description: 'Achieve better work-life harmony.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ---------- Landing Page Additions ---------- */}

{/* Hero Section */}
<section className="text-center py-20 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-900 text-white">
  <h1 className="text-5xl font-extrabold mb-6">
    Ready to Transform Your Life?
  </h1>
  <p className="text-lg max-w-2xl mx-auto">
    Join thousands who have already taken the first step towards better
    mental health and well-being.
  </p>
</section>

{/* Features Section */}
<section className="px-10 py-10 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-900 text-white">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-purple-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-2">🧠 Stress Management</h3>
      <p>Practical techniques for daily stress relief.</p>
    </div>
    <div className="bg-purple-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-2">💙 Emotional Resilience</h3>
      <p>Build stronger mental and emotional strength.</p>
    </div>
    <div className="bg-purple-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-2">🌀 Mindfulness Tools</h3>
      <p>Evidence-based mindfulness practices.</p>
    </div>
    <div className="bg-purple-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-2">⚖ Life Balance</h3>
      <p>Achieve better work-life harmony.</p>
    </div>
  </div>
</section>
{/* Hero Section */}


{/* Contact Section */}

<section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 py-10 bg-purple-900 text-white">
  
  <div className="bg-purple-800 rounded-2xl shadow-lg p-6 text-center">
    <div className="text-4xl mb-4">📧</div>
    <h3 className="text-xl font-bold">Email Us</h3>
    <a
      href="mailto:pulseandpause23@gmail.com"
      className="text-blue-300 underline hover:text-blue-400"
    >
      pulseandpause23@gmail.com
    </a>
  </div>

  <div className="bg-purple-800 rounded-2xl shadow-lg p-6 text-center">
    <div className="text-4xl mb-4">📞</div>
    <h3 className="text-xl font-bold">Call Us</h3>
    <a
      href="tel:+919603935352"
      className="text-blue-300 underline hover:text-blue-400"
    >
      +919263935852
    </a>
  </div>

  <div className="bg-purple-800 rounded-2xl shadow-lg p-6 text-center">
    <div className="text-4xl mb-4">💕</div>
    <h3 className="text-xl font-bold">Instagram</h3>
    <a
      href="https://www.instagram.com/pulseandpause_?igsh=ZmVqeTE0ZHk3bmdi" 
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-300 underline hover:text-blue-400"
    >
      Pulse&Pause
    </a>
  </div>
</section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Register for Seminar</h3>
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                <p className="text-red-700 font-bold text-sm">⏰ ONLY FOR TODAY!</p>
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <span className="text-gray-500 line-through text-lg">₹499</span>
                  <span className="text-green-600 font-bold text-2xl">₹99</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">80% OFF</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Occupation</span>
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your occupation"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <Cake className="w-4 h-4" />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Pay ₹99 & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for registering for the Pulse & Pause seminar. You'll receive a confirmation email shortly.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Razorpay Script */}
    </div>
  );
}

export default App;
