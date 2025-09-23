import React from 'react';

const Help = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
      <p>If you need assistance, contact our support team:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Email: <a href="mailto:laxmisareehouse11@gmail.com" className="text-blue-700">laxmisareehouse11@gmail.com</a></li>
        <li>Phone: <a href="tel:+916300370683" className="text-blue-700">+91 6300370683</a></li>
        <li>WhatsApp: <a href="https://wa.me/6300370683" target="_blank" className="text-blue-700">Chat on WhatsApp</a></li>
      </ul>
      <p className="mt-4">We respond within 24 hours on business days.</p>
    </div>
  );
};

export default Help;
