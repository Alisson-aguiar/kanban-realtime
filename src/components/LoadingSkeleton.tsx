'use client';

export const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            <div className="container mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-64 mx-auto mb-8"></div>
                    <div className="flex gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-96 h-96 bg-slate-800/50 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};