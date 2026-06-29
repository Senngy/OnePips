"use client";

import { useState, useEffect } from "react";
import { TestimonialDto } from "@/lib/services/community.service";

interface TestimonialCarouselProps {
    testimonials: TestimonialDto[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        if (!testimonials || testimonials.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials]);

    if (!testimonials || testimonials.length === 0) {
        return <div className="text-center text-outline py-8">Aucun témoignage pour le moment.</div>;
    }

    const current = testimonials[currentIndex];

    return (
        <div className="max-w-4xl mx-auto px-8 text-center relative">
            <div className="mb-12 min-h-[250px] flex flex-col justify-center items-center animate-in fade-in zoom-in duration-500" key={current.id}>
                <div className="flex justify-center gap-1 text-primary mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < current.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                    ))}
                </div>
                <blockquote className="text-2xl font-headline font-medium italic text-on-surface leading-snug">
                    "{current.content}"
                </blockquote>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                        {current.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-on-surface">{current.name}</p>
                        <p className="text-xs text-outline uppercase tracking-widest">{current.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            {testimonials.length > 1 && (
                <div className="flex justify-center gap-2">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-primary w-6" : "bg-outline/30 hover:bg-outline/50"}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
