import React from "react";
import { Button } from "./Button";

export interface Favorite {
  id: string;
  name: string;
  command: string;
  description: string;
  category: string;
}

interface FavoritesProps {
  favorites: Favorite[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFavorite: (command: string) => void;
  onDeleteFavorite: (id: string) => void;
  onAddFavorite: (favorite: Omit<Favorite, "id">) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  isOpen,
  onClose,
  onSelectFavorite,
  onDeleteFavorite,
  onAddFavorite,
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    command: "",
    description: "",
    category: "general",
  });

  const handleAdd = () => {
    if (formData.name && formData.command) {
      onAddFavorite(formData);
      setFormData({ name: "", command: "", description: "", category: "general" });
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  const categories = Array.from(new Set(favorites.map((f) => f.category)));

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-500/50 max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Favorites</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsAdding(!isAdding)}
              >
                {isAdding ? "Cancel" : "+ Add"}
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {isAdding && (
            <div className="mb-6 p-4 bg-gray-800 rounded border border-gray-700 space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded text-sm"
              />
              <textarea
                placeholder="Command"
                value={formData.command}
                onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded text-sm"
                rows={2}
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded text-sm"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded text-sm"
              >
                <option value="general">General</option>
                <option value="wallet">Wallet</option>
                <option value="trading">Trading</option>
              </select>
              <Button onClick={handleAdd} className="w-full">
                Add Favorite
              </Button>
            </div>
          )}

          {favorites.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-8">
              No favorites yet. Add one to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-xs uppercase text-gray-500 font-bold mb-2 mt-4">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {favorites
                      .filter((f) => f.category === category)
                      .map((fav) => (
                        <div
                          key={fav.id}
                          className="p-3 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 flex items-between justify-between"
                        >
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              onSelectFavorite(fav.command);
                              onClose();
                            }}
                          >
                            <div className="text-cyan-400 text-sm font-mono">
                              {fav.name}
                            </div>
                            {fav.description && (
                              <div className="text-gray-500 text-xs">{fav.description}</div>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteFavorite(fav.id)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
