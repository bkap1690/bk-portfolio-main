import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import logo from '../assets/WBL_Logo.svg';
import { addUser } from '../data/usersData';

const STORAGE_KEY = 'wasatch_signup_data';

export default function AccountSuccessPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    firstName: string;
    username: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Load Roboto font
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load signup data and create user
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const formData = parsed.formData;

        // Set user data for display
        setUserData({
          firstName: formData.personalInfo.firstName,
          username: formData.accountDetails.username,
          email: formData.personalInfo.email,
        });

        // Add user to users database
        try {
          addUser({
            firstName: formData.personalInfo.firstName,
            lastName: formData.personalInfo.lastName,
            email: formData.personalInfo.email,
            username: formData.accountDetails.username,
            accountType: formData.accountType as 'individual' | 'institutional',
            organization:
              formData.accountType === 'institutional'
                ? formData.organizationInfo.name
                : undefined,
            role:
              formData.accountType === 'institutional' ? formData.organizationInfo.role : undefined,
            phone: formData.personalInfo.phone,
            twoFactorEnabled: formData.verificationInfo.twoFactorEnabled,
          });
          console.log('User added successfully');
        } catch (err) {
          console.error('Failed to add user:', err);
        }

        // Clear signup data from localStorage
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to process signup data:', error);
      }
    }

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleGoToDashboard = () => {
    navigate('/prototypes/wasatch-dashboard');
  };

  const handleTakeTour = () => {
    // In a real app, this would start a product tour
    alert('Product tour would start here');
  };

  const handleSetupProfile = () => {
    // In a real app, this would navigate to profile settings
    alert('Profile setup would open here');
  };

  const handleClose = () => {
    navigate('/prototypes');
  };

  if (!userData) {
    return (
      <div className="wasatch-app font-wasatch-sans min-h-screen bg-wasatch-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-wasatch-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wasatch-app font-wasatch-sans min-h-screen bg-wasatch-bg flex flex-col">
      {/* Header */}
      <header className="bg-wasatch-bg-elevated border-b border-wasatch-border">
        <div className="max-w-7xl mx-auto px-wasatch-6 py-wasatch-4 flex items-center justify-between">
          <div className="w-20" /> {/* Spacer for centering */}
          <img src={logo} alt="WASATCH.BIOLABS" className="h-10" />
          <button
            onClick={handleClose}
            className="flex items-center gap-wasatch-2 text-wasatch-text-secondary hover:text-wasatch-text-heading transition-colors"
          >
            <span className="text-wasatch-sm font-wasatch-medium">MENU</span>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-wasatch-6 py-wasatch-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-wasatch-8">
            <h1 className="text-wasatch-4xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">You're all set!</h1>
            <p className="text-wasatch-text-secondary">Your account has been created successfully.</p>
          </div>

          <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-8 text-center">
            <p className="text-wasatch-lg text-wasatch-text-secondary mb-wasatch-6">
              Welcome to Wasatch BioLabs, {userData.firstName}! We're excited to have you on board.
            </p>

            {/* Success Icon */}
            <div className="flex justify-center mb-wasatch-6">
              <div className="w-16 h-16 rounded-wasatch-full bg-wasatch-accent flex items-center justify-center">
                <Check size={32} className="text-wasatch-text-inverse" />
              </div>
            </div>

            {/* Account Details */}
            <div className="mb-wasatch-8">
              <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-2">
                Here are your account details for your reference:
              </p>
              <div className="space-y-wasatch-1">
                <p className="text-wasatch-sm text-wasatch-text-secondary">
                  <span className="font-wasatch-medium">Username:</span> {userData.username}
                </p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">
                  <span className="font-wasatch-medium">Email Address:</span> {userData.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-wasatch-3 mb-wasatch-8">
              <button
                onClick={handleGoToDashboard}
                className="w-full px-wasatch-6 py-wasatch-3 bg-wasatch-accent text-wasatch-text-inverse rounded-wasatch-sm font-wasatch-medium hover:bg-wasatch-accent-hover transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleTakeTour}
                className="w-full px-wasatch-6 py-wasatch-3 bg-wasatch-neutral-600 text-wasatch-text-inverse rounded-wasatch-sm font-wasatch-medium hover:bg-wasatch-neutral-700 transition-colors"
              >
                Take a Tour
              </button>
              <button
                onClick={handleSetupProfile}
                className="w-full px-wasatch-6 py-wasatch-3 border border-wasatch-border-strong text-wasatch-text-secondary rounded-wasatch-sm font-wasatch-medium hover:bg-wasatch-surface-subtle transition-colors"
              >
                Set Up Your Profile
              </button>
            </div>

            <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
              You can update your information anytime in your profile settings.
            </p>

            {/* Help Section */}
            <div className="border-t border-wasatch-border pt-wasatch-6">
              <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-3">Need help getting started?</p>
              <div className="space-y-wasatch-2">
                <a
                  href="#"
                  className="block text-wasatch-sm text-wasatch-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Getting Started Guide would open here');
                  }}
                >
                  Read our Getting Started Guide
                </a>
                <a
                  href="#"
                  className="block text-wasatch-sm text-wasatch-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Tutorial Videos would open here');
                  }}
                >
                  Watch Tutorial Videos
                </a>
                <a
                  href="#"
                  className="block text-wasatch-sm text-wasatch-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact Support would open here');
                  }}
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wasatch-neutral-800 py-wasatch-4 text-center text-wasatch-sm text-wasatch-text-inverse">
        © 2024 Wasatch BioLabs. All rights reserved
      </footer>
    </div>
  );
}
