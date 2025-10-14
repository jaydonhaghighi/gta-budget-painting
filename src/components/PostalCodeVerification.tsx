import React, { useState, useEffect } from 'react';
import './PostalCodeVerification.css';

interface PostalCodeVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

// GTA postal code prefixes (first 3 characters)
const GTA_POSTAL_PREFIXES = [
  'M1A', 'M1B', 'M1C', 'M1E', 'M1G', 'M1H', 'M1J', 'M1K', 'M1L', 'M1M', 'M1N', 'M1P', 'M1R', 'M1S', 'M1T', 'M1V', 'M1W', 'M1X',
  'M2H', 'M2J', 'M2K', 'M2L', 'M2M', 'M2N', 'M2P', 'M2R',
  'M3A', 'M3B', 'M3C', 'M3H', 'M3J', 'M3K', 'M3L', 'M3M', 'M3N',
  'M4A', 'M4B', 'M4C', 'M4E', 'M4G', 'M4H', 'M4J', 'M4K', 'M4L', 'M4M', 'M4N', 'M4P', 'M4R', 'M4S', 'M4T', 'M4V', 'M4W', 'M4X', 'M4Y',
  'M5A', 'M5B', 'M5C', 'M5E', 'M5G', 'M5H', 'M5J', 'M5K', 'M5L', 'M5M', 'M5N', 'M5P', 'M5R', 'M5S', 'M5T', 'M5V', 'M5W', 'M5X',
  'M6A', 'M6B', 'M6C', 'M6E', 'M6G', 'M6H', 'M6J', 'M6K', 'M6L', 'M6M', 'M6N', 'M6P', 'M6R', 'M6S',
  'M7A', 'M7Y',
  'M8V', 'M8W', 'M8X', 'M8Y', 'M8Z',
  'M9A', 'M9B', 'M9C', 'M9L', 'M9M', 'M9N', 'M9P', 'M9R', 'M9V', 'M9W',
  'L0A', 'L0B', 'L0C', 'L0E', 'L0G', 'L0H', 'L0J', 'L0K', 'L0L', 'L0M', 'L0N', 'L0P', 'L0R', 'L0S', 'L0T', 'L0V', 'L0W', 'L0X', 'L0Y', 'L0Z',
  'L1A', 'L1B', 'L1C', 'L1E', 'L1G', 'L1H', 'L1J', 'L1K', 'L1L', 'L1M', 'L1N', 'L1P', 'L1R', 'L1S', 'L1T', 'L1V', 'L1W', 'L1X', 'L1Y', 'L1Z',
  'L2A', 'L2B', 'L2C', 'L2E', 'L2G', 'L2H', 'L2J', 'L2K', 'L2L', 'L2M', 'L2N', 'L2P', 'L2R', 'L2S', 'L2T', 'L2V', 'L2W', 'L2X', 'L2Y', 'L2Z',
  'L3A', 'L3B', 'L3C', 'L3E', 'L3G', 'L3H', 'L3J', 'L3K', 'L3L', 'L3M', 'L3N', 'L3P', 'L3R', 'L3S', 'L3T', 'L3V', 'L3W', 'L3X', 'L3Y', 'L3Z',
  'L4A', 'L4B', 'L4C', 'L4E', 'L4G', 'L4H', 'L4J', 'L4K', 'L4L', 'L4M', 'L4N', 'L4P', 'L4R', 'L4S', 'L4T', 'L4V', 'L4W', 'L4X', 'L4Y', 'L4Z',
  'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5J', 'L5K', 'L5L', 'L5M', 'L5N', 'L5P', 'L5R', 'L5S', 'L5T', 'L5V', 'L5W', 'L5X', 'L5Y', 'L5Z',
  'L6A', 'L6B', 'L6C', 'L6E', 'L6G', 'L6H', 'L6J', 'L6K', 'L6L', 'L6M', 'L6N', 'L6P', 'L6R', 'L6S', 'L6T', 'L6V', 'L6W', 'L6X', 'L6Y', 'L6Z',
  'L7A', 'L7B', 'L7C', 'L7E', 'L7G', 'L7H', 'L7J', 'L7K', 'L7L', 'L7M', 'L7N', 'L7P', 'L7R', 'L7S', 'L7T', 'L7V', 'L7W', 'L7X', 'L7Y', 'L7Z',
  'L8A', 'L8B', 'L8C', 'L8E', 'L8G', 'L8H', 'L8J', 'L8K', 'L8L', 'L8M', 'L8N', 'L8P', 'L8R', 'L8S', 'L8T', 'L8V', 'L8W', 'L8X', 'L8Y', 'L8Z',
  'L9A', 'L9B', 'L9C', 'L9E', 'L9G', 'L9H', 'L9J', 'L9K', 'L9L', 'L9M', 'L9N', 'L9P', 'L9R', 'L9S', 'L9T', 'L9V', 'L9W', 'L9X', 'L9Y', 'L9Z'
];

const VERIFICATION_KEY = 'gta_postal_verification';
const VERIFICATION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

export const PostalCodeVerification: React.FC<PostalCodeVerificationProps> = ({
  isOpen,
  onClose,
  onVerified
}) => {
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if user is already verified
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(VERIFICATION_KEY);
      if (stored) {
        const { timestamp } = JSON.parse(stored);
        const now = Date.now();
        if (now - timestamp < VERIFICATION_DURATION) {
          onVerified();
          return;
        } else {
          // Expired, remove from storage
          localStorage.removeItem(VERIFICATION_KEY);
        }
      }
    } else {
      // Clear input when modal closes
      setPostalCode('');
      setError('');
    }
  }, [isOpen, onVerified]);

  const validatePostalCode = (code: string): boolean => {
    // Remove spaces and convert to uppercase
    const cleanCode = code.replace(/\s/g, '').toUpperCase();
    
    // Check if it's a valid Canadian postal code format
    const postalRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
    if (!postalRegex.test(cleanCode)) {
      return false;
    }

    // Check if first 3 characters match GTA prefixes
    const prefix = cleanCode.substring(0, 3);
    return GTA_POSTAL_PREFIXES.includes(prefix);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Simulate a brief verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (validatePostalCode(postalCode)) {
      // Store verification with timestamp
      const verificationData = {
        postalCode: postalCode.replace(/\s/g, '').toUpperCase(),
        timestamp: Date.now()
      };
      localStorage.setItem(VERIFICATION_KEY, JSON.stringify(verificationData));
      onVerified();
    } else {
      setError('Please enter a valid GTA postal code (e.g., M5V 3A8)');
    }

    setIsVerifying(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Remove any existing spaces and format properly
    value = value.replace(/\s/g, '');
    
    // Allow up to 6 characters (A1A1A1)
    if (value.length <= 6) {
      if (value.length <= 3) {
        setPostalCode(value);
      } else {
        // Format as A1A 1A1 when we have more than 3 characters
        const firstPart = value.substring(0, 3);
        const secondPart = value.substring(3);
        setPostalCode(firstPart + ' ' + secondPart);
      }
    }
    
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="postal-verification-overlay">
      <div className="postal-verification-modal">
        <div className="postal-verification-header">
          <h2>
            <img src="/marker.svg" alt="Location" className="section-icon" />
            Toronto Region Verification
          </h2>
          <button 
            className="postal-verification-close" 
            onClick={onClose}
            aria-label="Close verification"
          >
            ×
          </button>
        </div>
        
        <div className="postal-verification-content">
          <p className="postal-verification-description">
            To ensure we can provide service to your area, please enter your postal code.
          </p>
          
          <form onSubmit={handleSubmit} className="postal-verification-form">
            <div className="form-group">
              <label htmlFor="postal-code">Postal Code</label>
              <input
                id="postal-code"
                type="text"
                value={postalCode}
                onChange={handleInputChange}
                placeholder="A1B 2C3"
                maxLength={7}
                className={error ? 'error' : ''}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            
            <div className="postal-verification-actions">
              <button 
                type="button" 
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isVerifying || postalCode.replace(/\s/g, '').length < 6}
                className="btn-primary"
              >
                {isVerifying ? 'Verifying...' : 'Verify Location'}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

// Utility function to check if user is verified
export const isPostalCodeVerified = (): boolean => {
  const stored = localStorage.getItem(VERIFICATION_KEY);
  if (!stored) return false;
  
  try {
    const { timestamp } = JSON.parse(stored);
    const now = Date.now();
    return (now - timestamp) < VERIFICATION_DURATION;
  } catch {
    return false;
  }
};

// Utility function to clear verification
export const clearPostalCodeVerification = (): void => {
  localStorage.removeItem(VERIFICATION_KEY);
};
