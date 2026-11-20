import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Truck, 
  Star,
  Search,
  Filter,
  CreditCard
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface ShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  lang: 'pl' | 'en';
}

export const ShopDrawer: React.FC<ShopDrawerProps> = ({
  isOpen,
  onClose,
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  lang
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'catalog' | 'cart'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setOrderComplete(true);
    setTimeout(() => {
      onClearCart();
      setOrderComplete(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Drawer Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="p-6 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight font-sans">
                  {lang === 'pl' ? 'Sklep Medyczny Next Gen' : 'Next Gen Clinic Shop'}
                </h2>
                <p className="text-xs text-white/80 font-medium">
                  {lang === 'pl' ? 'Kompresjoterapia • Pielęgnacja pooperacyjna • Suplementacja' : 'Compression Wear • Post-Op Care • Supplements'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Catalog vs Cart Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {lang === 'pl' ? 'Katalog Produktów' : 'Product Catalog'}
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`relative px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'cart'
                  ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{lang === 'pl' ? 'Twój Koszyk' : 'Your Cart'}</span>
              {cartItemCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {lang === 'pl' ? 'Zamówienie Przyjęte!' : 'Order Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  {lang === 'pl' 
                    ? 'Dziękujemy! Otrzymasz natychmiastowe potwierdzenie na e-mail z numerem przesyłki.' 
                    : 'Thank you! You will receive immediate email confirmation with shipping tracking.'}
                </p>
              </div>
            ) : activeTab === 'catalog' ? (
              <>
                {/* Search & Category Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder={lang === 'pl' ? 'Szukaj wyrobów medycznych...' : 'Search medical items...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'all', label: lang === 'pl' ? 'Wszystkie' : 'All' },
                      { id: 'vascular', label: lang === 'pl' ? 'Kompresja' : 'Vascular' },
                      { id: 'post-op', label: lang === 'pl' ? 'Pooperacyjne' : 'Post-Op' },
                      { id: 'supplements', label: lang === 'pl' ? 'Suplementy' : 'Supplements' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredProducts.map((p) => {
                    const inCart = cart.find((i) => i.product.id === p.id);

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex gap-4"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 space-y-1">
                          {p.badge && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                              {p.badge}
                            </span>
                          )}

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {p.name}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {p.description}
                          </p>

                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">
                              {p.price} PLN
                            </span>

                            <button
                              onClick={() => onAddToCart(p)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                inCart 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>({inCart.quantity})</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{lang === 'pl' ? 'Dodaj' : 'Add'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* CART VIEW */
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">
                      {lang === 'pl' ? 'Koszyk jest pusty' : 'Your cart is empty'}
                    </p>
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs"
                    >
                      {lang === 'pl' ? 'Przeglądaj Produkty' : 'Browse Catalog'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-xs font-black text-amber-700">
                              {item.product.price} PLN
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg bg-white border border-slate-200 p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="p-1 hover:bg-slate-100 rounded-md text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-extrabold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 hover:bg-slate-100 rounded-md text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Drawer Footer Checkout Bar */}
          {activeTab === 'cart' && cart.length > 0 && !orderComplete && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>{lang === 'pl' ? 'Dostawa Medyczna' : 'Medical Shipping'}</span>
                <span className="text-emerald-600 font-extrabold">{lang === 'pl' ? 'GRATIS' : 'FREE'}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-slate-900">
                <span>{lang === 'pl' ? 'Suma Razem' : 'Total'}</span>
                <span className="text-xl text-amber-600">{cartTotal} PLN</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'pl' ? 'Szybkie Zamówienie Medyczne' : 'Instant Medical Checkout'}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
