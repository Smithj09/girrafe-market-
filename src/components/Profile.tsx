import { useState } from 'react';
import { X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../lib/db';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Profile({ isOpen, onClose }: ProfileProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      await updateProfile(user.id, fullName);
      setIsEditing(false);
      alert('Profil mis à jour');
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mon Profil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-pink-600" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom Complet</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(user.fullName || '');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
