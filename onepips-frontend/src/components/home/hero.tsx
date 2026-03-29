"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <span className="text-primary font-label text-sm tracking-[0.2em] uppercase mb-6 block">
            Elite Trading Academy
          </span>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none mb-8">
            Devenir trader rentable demande une{" "}
            <span className="text-primary">méthode</span>. Pas de la chance.
          </h1>
          <p className="text-outline text-xl max-w-xl mb-10 leading-relaxed">
            Accédez aux stratégies institutionnelles utilisées par les 1%
            pour dominer les marchés financiers. Pas de bruit, juste des
            résultats.
          </p>
          <div className="flex flex-col sm:sm:flex-row gap-4">
            <Link 
              href="/candidature" 
              className="bg-primary-container text-on-primary-container px-8 py-4 text-center text-lg font-headline font-bold rounded-md hover:brightness-110 transition-all shadow-lg shadow-primary-container/20"
            >
              Candidater maintenant
            </Link>
            <button className="border border-outline-variant text-on-surface px-8 py-4 text-lg font-headline font-bold rounded-md hover:bg-surface-container transition-all">
              Voir le programme
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="glass-card p-4 rounded-xl relative overflow-hidden group">
            <img
              alt="Trading Dashboard"
              className="rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwNREVCyOzsQqKwlrK_w29bqkiwtcW7sjaq1ZbbsIqOc5Ff8bmrwVA7pX8ANHnrUZ5DgHL8H9VYor4QhBWrnnQBzurPrERCSiUNJkfhg0e16vnbGdBjTV_oYIQfOXpipeyWe4I1glzRBnPWzfvwVmCUg0EEF9ENQHANhUg9AJj6Dw-w0QOD1v40NdxQAHlKgix5DDtn1GyE7msvNy14yfeOtRJriw1NyxhJHwP9DfNnvnFdn0a7maxk8O88u3bmTlEedWllo2vYxM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4 bg-surface-container-highest/80 backdrop-blur-md p-4 rounded-lg border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-xs font-label text-outline uppercase tracking-wider">
                    Live Performance
                  </p>
                  <p className="text-xl font-headline font-bold text-primary">
                    +12.4% This Week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
