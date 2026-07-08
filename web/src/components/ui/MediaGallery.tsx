'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
}

interface MediaGalleryProps {
    photos: Photo[];
    children?: React.ReactNode;
}

export function MediaGallery({ photos, children }: MediaGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return (
            <div style={{ borderRadius: 20, overflow: 'hidden', height: 400, background: 'linear-gradient(135deg,#D8F3DC,#95D5B2,#52B788)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 32 }}>
                <span style={{ fontSize: 80, opacity: 0.5 }}>🏡</span>
                {children}
            </div>
        );
    }

    const currentMedia = photos[currentIndex];
    const isVideo = currentMedia.url.toLowerCase().match(/\.(mp4|webm|mov|mkv)$/);

    return (
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] bg-black mb-6 md:mb-8">
            {isVideo ? (
                <video src={currentMedia.url} controls className="w-full h-full object-contain" />
            ) : (
                <img src={currentMedia.url} alt="Property" className="w-full h-full object-cover" />
            )}

            {children}

            {/* Navigation Arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                        style={{ position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                        style={{ position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Thumbnails */}
            <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10 }}>
                {photos.map((p, idx) => {
                    const thumbIsVideo = p.url.toLowerCase().match(/\.(mp4|webm|mov|mkv)$/);
                    return (
                        <div
                            key={p.id}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: 50, height: 35, borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                                border: currentIndex === idx ? '2px solid white' : '2px solid transparent',
                                opacity: currentIndex === idx ? 1 : 0.6,
                                background: '#333',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            {thumbIsVideo ? (
                                <Film size={16} color="white" />
                            ) : (
                                <img src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
