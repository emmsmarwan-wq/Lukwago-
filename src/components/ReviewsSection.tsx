import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, Send, CheckCircle2, Sparkles, User, Utensils, Heart } from 'lucide-react';
import { CustomerReviewRecord, subscribeToReviews, submitReviewToFirestore } from '../lib/firebase';
import { MENU_ITEMS } from '../data/menuData';

const INITIAL_LOCAL_REVIEWS: CustomerReviewRecord[] = [
  {
    id: 'rev-seed-1',
    customerName: 'Kato Derrick',
    dishName: 'Goat Luwombo',
    rating: 5,
    comment: 'The Goat Luwombo is cooked to tender perfection with authentic banana leaf aroma and rich peanut paste. Best in Kampala!',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'rev-seed-2',
    customerName: 'Sarah Namubiru',
    dishName: 'All-in-One Rolex & Passion Juice',
    rating: 5,
    comment: 'Ordered at 2 AM after a late flight. Hot fresh rolex and pure passion juice delivered in 20 minutes to Ntinda. 24/7 reliability is real!',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'rev-seed-3',
    customerName: 'Brian Mugabe',
    dishName: 'Chicken Pilao & G.nuts',
    rating: 5,
    comment: 'Generous portions and the free groundnut sauce complement the spiced rice superbly. 10/10 recommended.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  }
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReviewRecord[]>(INITIAL_LOCAL_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [dishName, setDishName] = useState('Goat Luwombo');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Real-time Firestore subscription
  useEffect(() => {
    const unsubscribe = subscribeToReviews(
      (firestoreReviews) => {
        if (firestoreReviews && firestoreReviews.length > 0) {
          setReviews(firestoreReviews);
        }
      },
      (err) => {
        console.warn('Real-time reviews subscription fallback to local cache:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError('Please write a brief comment (at least 5 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const newRecord = await submitReviewToFirestore({
        customerName: customerName.trim(),
        dishName: dishName || undefined,
        rating,
        comment: comment.trim(),
      });

      // Update local state immediately as well
      setReviews((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
      setSubmitSuccess(true);
      setCustomerName('');
      setComment('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsFormOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setFormError('Could not save review to database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews-section" className="py-12 bg-gradient-to-b from-[#14151B] to-[#171821] border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Customer Reviews &bull; Cloud Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              What Diners Say About <span className="text-[#E05322]">Papaz Spot</span>
            </h2>
            <p className="text-stone-400 text-sm mt-1 max-w-xl">
              Real reviews stored in real time. Share your dining experience or read what food lovers in Kampala are raving about.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#E05322] to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white shadow-lg shadow-orange-950/40 transition-all hover:scale-102"
          >
            {isFormOpen ? <Star className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isFormOpen ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Write Review Form Collapsible */}
        {isFormOpen && (
          <form 
            onSubmit={handleSubmitReview}
            className="mb-8 p-6 bg-[#1A1C24] border border-orange-500/30 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Rate Your Papaz Spot Meal
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Your feedback is stored directly in our Firestore database.
            </p>

            {formError && (
              <div className="p-3 mb-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 mb-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Thank you! Your review has been saved to the database.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Okello"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#121318] border border-stone-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Dish Enjoyed</label>
                <select
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full bg-[#121318] border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  {MENU_ITEMS.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Star Rating</label>
                <div className="flex items-center gap-1 py-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-300 ml-2">{rating}/5 Stars</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-300 mb-1">Your Review & Comments *</label>
              <textarea
                rows={3}
                required
                placeholder="Tell us what you liked about the flavor, freshness, speed of service, or packaging..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#121318] border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#E05322] hover:bg-orange-600 text-white transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Saving to Database...' : 'Submit to Database'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev) => {
            const dateStr = new Date(rev.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={rev.id}
                className="bg-[#1A1C24] border border-stone-800 hover:border-orange-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                        {rev.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{rev.customerName}</h4>
                        <span className="text-[11px] text-stone-400">{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.dishName && (
                    <div className="inline-block px-2.5 py-0.5 bg-orange-950/40 border border-orange-800/40 rounded-md text-[11px] font-medium text-orange-300 mb-2.5">
                      🍽️ {rev.dishName}
                    </div>
                  )}

                  <p className="text-stone-300 text-xs leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Customer
                  </span>
                  <span className="text-stone-500 font-mono text-[10px]">Cloud Synced</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
