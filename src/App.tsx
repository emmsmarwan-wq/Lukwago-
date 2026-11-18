import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MenuFilterBar } from './components/MenuFilterBar';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { OrderDrawer, CartItem } from './components/OrderDrawer';
import { OriginalBoardsModal } from './components/OriginalBoardsModal';
import { QRCodeModal } from './components/QRCodeModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { KitchenDisplayModal } from './components/KitchenDisplayModal';
import { ReviewsSection } from './components/ReviewsSection';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { MENU_ITEMS, MenuItem, RESTAURANT_INFO } from './data/menuData';
import { 
  getStoredFavorites, toggleStoredFavorite, 
  getOrderHistory 
} from './utils/orderStorage';
import { 
  Sparkles, ShoppingBag, Utensils, Flame, QrCode, 
  Clock, CheckCircle2, Download, Heart, History,
  Coffee, CupSoda, Egg
} from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDietary, setActiveDietary] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [orderMode, setOrderMode] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [currency, setCurrency] = useState('UGX');

  // Favorites state (persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals & Drawers state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderDrawerTab, setOrderDrawerTab] = useState<'tray' | 'tracker' | 'history'>('tray');
  const [isOriginalPhotosOpen, setIsOriginalPhotosOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);

  // Scanned table number from URL query ?table=...
  const [scannedTable, setScannedTable] = useState<string>('');

  // Past orders count for badge
  const [pastOrdersCount, setPastOrdersCount] = useState<number>(0);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavs = getStoredFavorites();
    setFavorites(savedFavs);

    // Load past orders count
    const history = getOrderHistory();
    setPastOrdersCount(history.length);

    // Read URL parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('table');
      if (table) {
        setScannedTable(table);
        setOrderMode('dine-in');
      }
    }
  }, []);

  // Toggle favorite handler
  const handleToggleFavorite = (itemId: string) => {
    const { favorites: updatedFavs } = toggleStoredFavorite(itemId);
    setFavorites(updatedFavs);
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cart calculations
  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Cart handlers
  const handleAddToCart = (item: MenuItem, quantity = 1, notes = '', selectedPrice = item.price) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          selectedPrice: selectedPrice || next[existingIndex].selectedPrice,
          notes: notes ? notes : next[existingIndex].notes,
        };
        return next;
      } else {
        return [...prev, { item, quantity, selectedPrice, notes }];
      }
    });
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((c) => c.item.id !== item.id);
      }
      return prev.map((c) =>
        c.item.id === item.id ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((c) => c.item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((c) => (c.item.id === itemId ? { ...c, quantity: newQty } : c))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleReorderItems = (newCartItems: CartItem[]) => {
    setCart(newCartItems);
    setPastOrdersCount(getOrderHistory().length);
  };

  const getItemCartQuantity = (itemId: string) => {
    const found = cart.find((c) => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...MENU_ITEMS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.subcategory?.toLowerCase().includes(q) ||
          item.ingredients?.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Category filter (including favorites)
    if (activeCategory === 'favorites') {
      result = result.filter((item) => favorites.includes(item.id));
    } else if (activeCategory === 'luwombo') {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes('luwombo') ||
          item.subcategory?.toLowerCase().includes('luwombo')
      );
    } else if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Dietary filter
    if (activeDietary !== 'all') {
      result = result.filter((item) => item.dietary === activeDietary);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [searchQuery, activeCategory, activeDietary, sortBy, favorites]);

  // Category item groups for structured menu layout
  const luwomboSpecials = useMemo(() => {
    return MENU_ITEMS.filter((i) => i.name.toLowerCase().includes('luwombo'));
  }, []);

  const mainCoursesItems = useMemo(() => {
    return MENU_ITEMS.filter((i) => i.category === 'main' && !i.name.toLowerCase().includes('luwombo'));
  }, []);

  const breakfastItems = useMemo(() => {
    return MENU_ITEMS.filter((i) => i.category === 'breakfast_snacks');
  }, []);

  const beverageItems = useMemo(() => {
    return MENU_ITEMS.filter((i) => i.category === 'beverages');
  }, []);

  const sideItems = useMemo(() => {
    return MENU_ITEMS.filter((i) => i.category === 'sides');
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[#121316] text-[#F3F4F6] flex flex-col font-sans">
      {/* 1. Header */}
      <Header
        totalCartCount={totalCartCount}
        ordersCount={pastOrdersCount}
        onOpenCart={() => {
          setOrderDrawerTab('tray');
          setIsCartOpen(true);
        }}
        onOpenOrderHistory={() => {
          setOrderDrawerTab('history');
          setIsCartOpen(true);
        }}
        onOpenOriginalPhotos={() => setIsOriginalPhotosOpen(true)}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenDownloadApp={() => setIsDownloadOpen(true)}
        onOpenKitchenDisplay={() => setIsKitchenOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Active Table Notification if scanned via QR */}
      {scannedTable && (
        <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-2 text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Ordering for <strong>Table {scannedTable}</strong>. Items you add will be linked to your table!</span>
        </div>
      )}

      {/* 2. Hero Banner */}
      <HeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        orderMode={orderMode}
        onOrderModeChange={setOrderMode}
        onOpenOriginalPhotos={() => setIsOriginalPhotosOpen(true)}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenDownloadApp={() => setIsDownloadOpen(true)}
      />

      {/* 3. Filter and Category Bar */}
      <MenuFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeDietary={activeDietary}
        onDietaryChange={setActiveDietary}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredItems.length}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Quick QR Table Card Feature Strip */}
        <section className="bg-gradient-to-r from-[#18191E] via-[#1E1F27] to-[#18191E] border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-600/15 border border-orange-500/30 text-orange-400 shrink-0">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <span>Dine In · Take Away · Citywide Delivery</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  Open 24 Hours (24/7)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Scan &amp; Order or Request 24/7 Delivery
              </h3>
              <p className="text-xs text-stone-400 max-w-xl mt-1 leading-relaxed">
                Dine at our tables using QR codes, order takeaway, or request doorstep delivery anywhere in Kampala 
                with 1-touch GPS location pinning and transparent zone delivery fees.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsQRCodeOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Table QR Card</span>
            </button>
            <button
              onClick={() => {
                setOrderDrawerTab('history');
                setIsCartOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold rounded-xl border border-stone-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <History className="w-4 h-4 text-orange-400" />
              <span>Track Orders</span>
            </button>
          </div>
        </section>

        {/* Featured Showcase: Banana Leaf Luwombo (Only when 'all' or 'luwombo' is active and no active search) */}
        {/* CASE 1: FULL STRUCTURED MENU VIEW (when browsing All Dishes with no search or dietary filter) */}
        {!searchQuery && activeCategory === 'all' && activeDietary === 'all' ? (
          <div className="space-y-16">
            {/* 1. Luwombo Specials Showcase */}
            <section id="luwombo-specials" className="space-y-4 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Ugandan Royal Specialty</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5">
                    Steamed Banana Leaf Luwombo
                  </h2>
                </div>
                <div className="text-xs text-stone-400">
                  Slow-steamed for hours with natural herbs &amp; spices · 20,000 UGX
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {luwomboSpecials.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={getItemCartQuantity(item.id)}
                    onAddToCart={(i) => handleAddToCart(i)}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelect={setSelectedItem}
                    currency={currency}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* 2. Main Courses & Platters */}
            <section id="main-courses" className="space-y-4 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Hearty Ugandan Mains &amp; Platters</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5">
                    Main Courses &amp; Feasts
                  </h2>
                </div>
                <div className="text-xs text-stone-400">
                  Pilau, combo boxes, stews, Lake Victoria fish &amp; Grand Lusaniya
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mainCoursesItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={getItemCartQuantity(item.id)}
                    onAddToCart={(i) => handleAddToCart(i)}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelect={setSelectedItem}
                    currency={currency}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* 3. Breakfast & Rolex Station */}
            <section id="breakfast-section" className="space-y-4 scroll-mt-24">
              <div id="breakfast-snacks" className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <Egg className="w-3.5 h-3.5 text-amber-400" />
                    <span>Served 24 Hours Daily · Day &amp; Night</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
                    <span>Breakfast, Rolex &amp; Bakery Snacks</span>
                  </h2>
                </div>
                <div className="text-xs text-stone-400">
                  Kampala Rolex rolled fresh, hearty Katogo, meat samosas, pastries &amp; cookies
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {breakfastItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={getItemCartQuantity(item.id)}
                    onAddToCart={(i) => handleAddToCart(i)}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelect={setSelectedItem}
                    currency={currency}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* 4. Tropical Beverages & Juices Bar */}
            <section id="beverages-section" className="space-y-4 scroll-mt-24">
              <div id="beverages" className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <CupSoda className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Pure Fruit Nectars &amp; Hot Warmers</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5">
                    Fresh Juices &amp; Beverages Bar
                  </h2>
                </div>
                <div className="text-xs text-stone-400">
                  Icy cold passion, tropical cocktail, mango, melon, cold sodas &amp; hot spiced tea
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {beverageItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={getItemCartQuantity(item.id)}
                    onAddToCart={(i) => handleAddToCart(i)}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelect={setSelectedItem}
                    currency={currency}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* 5. Accompaniments & Sides */}
            {sideItems.length > 0 && (
              <section id="sides-section" className="space-y-4 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      <span>Complimentary &amp; Extras</span>
                    </div>
                    <h2 className="text-xl font-bold text-white font-display mt-0.5">
                      Sides &amp; Accompaniments
                    </h2>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Roasted G.nuts Sauce complimentary with orders
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sideItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantityInCart={getItemCartQuantity(item.id)}
                      onAddToCart={(i) => handleAddToCart(i)}
                      onRemoveFromCart={handleRemoveFromCart}
                      onSelect={setSelectedItem}
                      currency={currency}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* CASE 2: FILTERED OR SEARCH VIEW */
          <section id="filtered-section" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {activeCategory === 'favorites'
                    ? 'Your Favorite Dishes'
                    : activeCategory === 'luwombo'
                    ? 'Steamed Banana Leaf Luwombo'
                    : activeCategory === 'main'
                    ? 'Main Courses & Platters'
                    : activeCategory === 'breakfast_snacks'
                    ? 'Breakfast, Rolex & Snacks'
                    : activeCategory === 'beverages'
                    ? 'Fresh Juices & Beverages'
                    : activeCategory === 'sides'
                    ? 'Side Dishes & Extras'
                    : 'Search & Filtered Selections'}
                </h2>
                <div className="text-xs text-stone-400 mt-1">
                  {activeCategory === 'favorites'
                    ? 'Dishes you marked with a heart for fast re-ordering'
                    : searchQuery
                    ? `Showing ${filteredItems.length} results matching "${searchQuery}"`
                    : `Showing ${filteredItems.length} dishes in this category`}
                </div>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-[#18191E] border border-stone-800 rounded-2xl space-y-3">
                {activeCategory === 'favorites' ? (
                  <>
                    <Heart className="w-10 h-10 text-stone-600 mx-auto" />
                    <h3 className="text-base font-semibold text-white">No favorite dishes saved yet</h3>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Tap the heart icon on any Luwombo, Rolex, fresh juice, or pilau dish to bookmark it for quick access here!
                    </p>
                    <button
                      onClick={() => setActiveCategory('all')}
                      className="px-4 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-200 rounded-lg transition-colors mt-2"
                    >
                      Explore Full Menu
                    </button>
                  </>
                ) : (
                  <>
                    <Utensils className="w-10 h-10 text-stone-600 mx-auto" />
                    <h3 className="text-base font-semibold text-white">No dishes match your filter</h3>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Try clearing your search query or switching dietary filters to view our full menu.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                        setActiveDietary('all');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-200 rounded-lg transition-colors mt-2"
                    >
                      Reset All Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={getItemCartQuantity(item.id)}
                    onAddToCart={(i) => handleAddToCart(i)}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelect={setSelectedItem}
                    currency={currency}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        )}
        {/* Customer Reviews Section backed by Cloud Firestore */}
        <ReviewsSection />
      </main>

      {/* Floating Bottom Tray Bar on Mobile */}
      {totalCartCount > 0 && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => {
              setOrderDrawerTab('tray');
              setIsCartOpen(true);
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-xl shadow-orange-950/50 flex items-center justify-between border border-orange-400/30"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>View Order Tray</span>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-xs font-mono">
                {totalCartCount} items
              </span>
            </div>
            <span className="font-mono text-xs font-semibold">
              Checkout &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
        currency={currency}
        isFavorite={selectedItem ? favorites.includes(selectedItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Order Tray Drawer / Bill Calculator / History / Tracker */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onReorderItems={handleReorderItems}
        orderMode={orderMode}
        onOrderModeChange={setOrderMode}
        currency={currency}
        tableNumber={scannedTable}
        initialTab={orderDrawerTab}
      />

      {/* Original Photo Boards Modal */}
      <OriginalBoardsModal
        isOpen={isOriginalPhotosOpen}
        onClose={() => setIsOriginalPhotosOpen(false)}
      />

      {/* Scan & Order QR Code Modal */}
      <QRCodeModal
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      />

      {/* Download App & Source Code Modal */}
      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Live Kitchen Display & Orders Database Modal */}
      <KitchenDisplayModal
        isOpen={isKitchenOpen}
        onClose={() => setIsKitchenOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenOriginalPhotos={() => setIsOriginalPhotosOpen(true)}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenDownloadApp={() => setIsDownloadOpen(true)}
        onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
        onOpenKitchenDisplay={() => setIsKitchenOpen(true)}
      />

      {/* Cookie & Local Storage Banner & Preferences */}
      <CookieBanner
        isOpenModalRequested={isCookieSettingsOpen}
        onCloseModalRequested={() => setIsCookieSettingsOpen(false)}
      />
    </div>
  );
}
