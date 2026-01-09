import { useEffect } from 'react';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    grecaptcha?: {
      getResponse: () => string;
      reset?: () => void;
    };
    onRecaptchaSuccess?: (token: string) => void;
    onRecaptchaError?: () => void;
    onRecaptchaExpired?: () => void;
  }
}

/**
 * Google reCAPTCHA v2 (checkbox) component
 * Uses standard g-recaptcha div + global callbacks.
 */
export const Captcha = ({ onVerify, onError, onExpire }: CaptchaProps) => {
  // Ensure the script tag exists; let Google auto-render the widget
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://www.google.com/recaptcha/api.js"]'
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Register global callbacks for reCAPTCHA
  useEffect(() => {
    window.onRecaptchaSuccess = (token: string) => {
      onVerify(token);
    };
    window.onRecaptchaError = () => {
      onError?.();
    };
    window.onRecaptchaExpired = () => {
      onExpire?.();
    };
  }, [onVerify, onError, onExpire]);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn('VITE_RECAPTCHA_SITE_KEY is not set in apps/web/.env');
  }

  return (
    <div className="flex justify-center">
      <div
        className="g-recaptcha"
        data-sitekey={siteKey}
        data-callback="onRecaptchaSuccess"
        data-error-callback="onRecaptchaError"
        data-expired-callback="onRecaptchaExpired"
      />
    </div>
  );
};

