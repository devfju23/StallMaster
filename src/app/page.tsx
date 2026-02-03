'use client'; // must be at the top
import NewOrderForm from '@/components/new-order-form';
import DailySales from '@/components/daily-sales';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary">
            StallMaster
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Your simple and efficient drink stall order and sales tracker.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3">
            <NewOrderForm />
          </div>
          <div className="lg:col-span-2">
            <DailySales />
          </div>
        </div>
      </div>
    </main>
  );
}
