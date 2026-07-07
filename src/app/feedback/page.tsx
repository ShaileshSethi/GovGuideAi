"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFeedback('');
    toast.success("Thank you! Your feedback has been submitted.");
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
          <span className="text-2xl">📝</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
          Send Feedback
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Help us improve GovGuide AI by sharing your experience.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="feedback" className="block text-sm font-bold text-foreground mb-2">
              What can we do better?
            </label>
            <textarea
              id="feedback"
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about a missing feature, a bug, or an incorrect action plan..."
              className="w-full bg-background border border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !feedback.trim()}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-sm flex justify-center items-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
