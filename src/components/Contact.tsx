import { useState } from 'react';
import { X, Mail, Phone, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Contact({ isOpen, onClose }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:contact@dormark.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name}%0AEmail: ${email}`;
    window.location.href = mailtoLink;
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-pink-900">Contactez-nous</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Envoyez-nous un message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
              >
                Envoyer
              </button>
            </form>
          </div>

          {/* Contact Info & Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos coordonnées</h3>
            <div className="space-y-4">
              <a
                href="mailto:contact@dormark.com"
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">contact@dormark.com</p>
                </div>
              </a>

              <a
                href="tel:+8618801581033"
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-sm text-gray-600">+86 188 0158 1033</p>
                </div>
              </a>

              <a
                href="https://wa.me/8618801581033"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">+86 188 0158 1033</p>
                </div>
              </a>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-4">Suivez-nous</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://facebook.com/dormark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Facebook</span>
              </a>

              <a
                href="https://instagram.com/dormark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium">Instagram</span>
              </a>

              <a
                href="https://twitter.com/dormark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
              >
                <Twitter className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-medium">Twitter</span>
              </a>

              <a
                href="weixin://dl/chat"
                className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">WeChat</span>
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
