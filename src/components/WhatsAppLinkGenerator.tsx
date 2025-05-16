import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, ExternalLink, Flame, Loader2 } from 'lucide-react';
import { CountryCodeSelector } from './CountryCodeSelector';
import { PhoneNumberInput } from './PhoneNumberInput';
import { 
  formatPhoneNumber, 
  sanitizePhoneNumber, 
  validatePhoneNumber 
} from '../utils/phoneUtils';

// Anime expressions based on number
const getAnimeExpression = (digit: string): string => {
  const expressions: Record<string, string> = {
    '0': '(｡◕‿◕｡)', // Happy
    '1': '(￣ω￣)', // Relaxed
    '2': '(◕‿◕✿)', // Cute
    '3': '(｀・ω・´)', // Determined
    '4': '(＾▽＾)', // Joyful
    '5': '(・∀・)', // Excited
    '6': '(◠‿◠)', // Gentle smile
    '7': '(｀･ω･´)ゞ', // Salute
    '8': '(★‿★)', // Star eyes
    '9': '(^_−)−☆', // Wink
  };
  return expressions[digit] || '(・・?)'; // Default confused face
};

export const WhatsAppLinkGenerator: React.FC = () => {
  const [countryCode, setCountryCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [formattedNumber, setFormattedNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate WhatsApp link
  const generateLink = (): string => {
    if (!phoneNumber) return '';
    const sanitizedNumber = sanitizePhoneNumber(phoneNumber);
    const baseUrl = `https://wa.me/${countryCode}${sanitizedNumber}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  };

  const whatsappLink = generateLink();

  // Format the phone number as the user types
  useEffect(() => {
    if (phoneNumber) {
      const formatted = formatPhoneNumber(phoneNumber);
      setFormattedNumber(formatted);
      
      // Validate phone number
      const validation = validatePhoneNumber(phoneNumber);
      setIsValid(validation.isValid);
      setError(validation.error || '');
    } else {
      setFormattedNumber('');
      setIsValid(false);
      setError('');
    }
  }, [phoneNumber]);

  // Get avatar expression based on first digit
  const avatarExpression = useMemo(() => {
    if (!formattedNumber) return '(・・?)';
    const firstDigit = sanitizePhoneNumber(formattedNumber)[0] || '0';
    return getAnimeExpression(firstDigit);
  }, [formattedNumber]);

  // Copy to clipboard with error handling
  const copyToClipboard = async () => {
    if (!whatsappLink) return;
    
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(whatsappLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setError('Failed to copy to clipboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open WhatsApp with loading state
  const openWhatsApp = () => {
    if (!whatsappLink) return;
    setIsLoading(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      window.open(whatsappLink, '_blank');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="whatsapp-card" role="main" aria-label="WhatsApp Link Generator">
      <div className="whatsapp-card-header">
        <div className="flex items-center justify-center mb-6">
          <div className="whatsapp-icon" role="img" aria-label="Generator Icon">
            <Flame className="w-6 h-6 text-white animate-flicker" />
          </div>
          <h1 className="ml-3">WhatsApp Link Generator</h1>
        </div>
        
        <div className="input-container">
          <div>
            <label htmlFor="country-code" className="sr-only">
              Country Code
            </label>
            <CountryCodeSelector 
              value={countryCode} 
              onChange={setCountryCode} 
              aria-label="Select country code"
            />
          </div>
          
          <div>
            <label htmlFor="phone-number" className="sr-only">
              Phone Number
            </label>
            <PhoneNumberInput 
              value={phoneNumber} 
              onChange={setPhoneNumber} 
              placeholder="(555) 123-4567"
              error={error}
              aria-invalid={!!error}
              aria-describedby={error ? "phone-error" : undefined}
            />
            {error && <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message (optional)
            </label>
            <div className="relative">
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello! 👋"
                className="textarea"
                maxLength={2000}
                aria-label="Pre-filled message (optional)"
              />
            </div>
          </div>
          
          {phoneNumber && (
            <div className="preview-box" role="region" aria-label="Preview">
              <p className="text-sm text-gray-500 mb-1">Preview</p>
              <div className="preview-header">
                <div className="preview-avatar font-mono text-base" role="img" aria-label="Contact Avatar">
                  {avatarExpression}
                </div>
                <p className="preview-contact">
                  +{countryCode} {formattedNumber}
                </p>
              </div>
              <div className="preview-message" role="textbox" aria-readonly="true">
                {message ? (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No message
                  </p>
                )}
              </div>
              {whatsappLink && isValid && (
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-link"
                  aria-label="Generated WhatsApp link"
                >
                  {whatsappLink}
                </a>
              )}
            </div>
          )}
          
          <div className="button-group" role="group" aria-label="Actions">
            <button
              onClick={copyToClipboard}
              disabled={!isValid || isLoading}
              className={`btn ${isValid ? 'btn--primary' : ''} ${isLoading ? 'loading' : ''}`}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <Loader2 className="loading-spinner" aria-hidden="true" />
              ) : copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            
            <button
              onClick={openWhatsApp}
              disabled={!isValid || isLoading}
              className={`btn btn--secondary ${isLoading ? 'loading' : ''}`}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <Loader2 className="loading-spinner" aria-hidden="true" />
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span>Open Chat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p className="footer-text">
          Enter a phone number and optional message, copy the link, and share it.
          <br />
          When someone clicks the link, a chat will open with that number and pre-filled message.
          <br />
          <span className="signature">
            made with 🖤 by <a href="https://instagram.com/menjelangpadam" target="_blank" rel="noopener noreferrer" className="signature-link">menjelangpadam</a>
          </span>
        </p>
      </div>
    </div>
  );
};