import React, { useState, useEffect, useCallback } from 'react'
import { BaseUrl } from "@/lib/gateway"

interface Slide {
    title: string;
    summary: string;
    image: string;
    url: string;
    path: string;
}

const slides: Slide[] = [
    {
        title: 'API Explorer',
        summary: 'A better Swagger UI alternative built into ServiceStack that lets you explore, discover & call your APIs',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/api-explorer.webp',
        url: 'https://docs.servicestack.net/api-explorer',
        path: '/ui',
    },
    {
        title: 'Locode',
        summary: 'Instant CRUD UI to manage all your App\'s back-end AutoQuery Tables',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/locode.webp',
        url: 'https://docs.servicestack.net/locode/',
        path: '/locode',
    },
    {
        title: 'AI Chat',
        summary: 'Integrated and easy to use ChatGPT-like UI for your users',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/ai-chat.webp',
        url: 'https://docs.servicestack.net/ai-chat-api',
        path: '/chat',
    },
    {
        title: 'Admin UI Dashboard',
        summary: 'High-level overview stats on number and type of APIs and internal counters',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/dashboard.webp',
        url: 'https://docs.servicestack.net/admin-ui',
        path: '/admin-ui/',
    },
    {
        title: 'Analytics',
        summary: 'Comprehensive In Depth & Interactive API Analytics',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/analytics.webp',
        url: 'https://docs.servicestack.net/admin-ui-rdbms-analytics',
        path: '/admin-ui/analytics',
    },
    {
        title: 'IdentityAuth Users',
        summary: 'Customizable ASP.NET Core Identity Auth User Management',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/users.webp',
        url: 'https://docs.servicestack.net/admin-ui-identity-users',
        path: '/admin-ui/users',
    },
    {
        title: 'IdentityAuth Roles',
        summary: 'Manage App ASP.NET Core Identity Auth Roles and Claims',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/roles.webp',
        url: 'https://docs.servicestack.net/admin-ui-identity-roles',
        path: '/admin-ui/roles',
    },
    {
        title: 'API Keys',
        summary: 'Customizable, fine-grain and integrated API Key management',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/apikeys.webp',
        url: 'https://docs.servicestack.net/auth/apikeys',
        path: '/admin-ui/apikeys',
    },
    {
        title: 'Request Logging',
        summary: 'Rich, detailed, queryable and rolling Request Logs',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/logging.webp',
        url: 'https://docs.servicestack.net/admin-ui-profiling',
        path: '/admin-ui/logging',
    },
    {
        title: 'Profiling',
        summary: 'Observable, Diagnostic Source profiling event viewer',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/profiling.webp',
        url: 'https://docs.servicestack.net/admin-ui-profiling',
        path: '/admin-ui/profiling',
    },
    {
        title: 'Commands',
        summary: 'Use Commands as building blocks for robust and observable systems',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/commands.webp',
        url: 'https://docs.servicestack.net/commands',
        path: '/admin-ui/commands',
    },
    {
        title: 'Background Jobs',
        summary: 'Effortless management of Background Jobs and Scheduled Tasks',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/backgroundjobs.webp',
        url: 'https://docs.servicestack.net/rdbms-background-jobs',
        path: '/admin-ui/backgroundjobs',
    },
    {
        title: 'DB Validation Rules',
        summary: 'Manage dynamic Type and Property Rule Validators',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/validation.webp',
        url: 'https://docs.servicestack.net/admin-ui-validation',
        path: '/admin-ui/validation',
    },
    {
        title: 'Database Browser',
        summary: 'Browse RDBMS tables of all App\'s configured databases',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/database.webp',
        url: 'https://docs.servicestack.net/admin-ui-database',
        path: '/admin-ui/database',
    },
    {
        title: 'Redis Admin',
        summary: 'Inspect, browse and modify the App\'s configured Redis instance',
        image: 'https://docs.servicestack.net/img/pages/admin-ui/carousel/redis.webp',
        url: 'https://docs.servicestack.net/admin-ui-redis',
        path:'/admin-ui/redis',
    }
];

const ImageCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const goToNext = useCallback(() => {
        setDirection('right');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, []);

    const goToPrevious = useCallback(() => {
        setDirection('left');
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 'right' : 'left');
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, goToNext]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    return (
        <div className="w-full">
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* URL Link */}
                <a
                    href={BaseUrl + slides[currentIndex].path}
                    className="block mb-6 text-center group/link hover:opacity-80 transition-opacity"
                >
                    <div className="text-3xl font-mono">
                        <span className="text-slate-400">{BaseUrl}</span>
                        <span className="text-slate-800 font-semibold">{slides[currentIndex].path}</span>
                    </div>
                </a>

                {/* Main Carousel Container */}
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-2xl overflow-hidden group border border-slate-300">
                    {/* Image Container */}
                    <div className="relative aspect-[1704/1131] overflow-hidden bg-black/30">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                    index === currentIndex
                                        ? 'opacity-100 translate-x-0'
                                        : direction === 'right'
                                            ? index < currentIndex
                                                ? 'opacity-0 -translate-x-full'
                                                : 'opacity-0 translate-x-full'
                                            : index < currentIndex
                                                ? 'opacity-0 -translate-x-full'
                                                : 'opacity-0 translate-x-full'
                                }`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            </div>
                        ))}

                        {/* Navigation Arrows - Only show on hover */}
                        <button type="button"
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none backdrop-blur-sm opacity-0 group-hover:opacity-100 ring-1 ring-slate-300"
                            aria-label="Previous slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button type="button"
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none backdrop-blur-sm opacity-0 group-hover:opacity-100 ring-1 ring-slate-300"
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Content Section - Overlapping */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/80 backdrop-blur-sm">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    {/* Title with animation */}
                                    <div className="overflow-hidden mb-4">
                                        <h2
                                            key={currentIndex}
                                            className="text-3xl font-bold text-white animate-[slideUp_0.5s_ease-out]"
                                        >
                                            {slides[currentIndex].title}
                                        </h2>
                                    </div>

                                    {/* Summary with animation */}
                                    <div className="overflow-hidden">
                                        <p
                                            key={`summary-${currentIndex}`}
                                            className="text-lg text-gray-200 animate-[slideUp_0.5s_ease-out_0.1s_both]"
                                        >
                                            {slides[currentIndex].summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Learn More Button */}
                                <a
                                    href={slides[currentIndex].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex-shrink-0 ml-auto"
                                >
                                    <span>Learn More</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dot Indicators with Navigation */}
                <div className="flex justify-center items-center gap-6 mt-8">
                    {/* Left Navigation */}
                    <button type="button"
                        onClick={goToPrevious}
                        className="bg-white hover:bg-slate-50 text-slate-800 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110 focus:outline-none ring-1 ring-slate-300"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="flex gap-3">
                        {slides.map((_, index) => (
                            <button type="button"
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full focus:outline-none ${
                                    index === currentIndex
                                        ? 'w-12 h-3 bg-blue-600 shadow-lg'
                                        : 'w-3 h-3 bg-slate-300 hover:bg-slate-400'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === currentIndex ? 'true' : 'false'}
                            />
                        ))}
                    </div>

                    {/* Right Navigation */}
                    <button type="button"
                        onClick={goToNext}
                        className="bg-white hover:bg-slate-50 text-slate-800 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110 focus:outline-none ring-1 ring-slate-300"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Add animation keyframes */}
            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default ImageCarousel;
