 import { ModeToggle } from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Globe, LayoutGrid, Palette, Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className='min-h-dvh'>
      {/* Header */}
      <header className='border-b sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto max-w-7xl px-6 py-4 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='inline-flex size-8 items-center justify-center rounded-md border'>
              <Rocket className='size-4' />
            </span>
            <span className='text-sm font-medium tracking-tight'>Instant Store</span>
          </Link>

          <nav className='flex items-center gap-3 md:gap-4'>
            <Link
              href='/store/demo'
              className='hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md'>
              Explore demo
            </Link>
            <Link href='/auth/login'>
              <Button variant='ghost' className='hidden sm:inline'>
                Sign in
              </Button>
            </Link>
            <ModeToggle />
            <Link href='/auth/login'>
              <Button size='sm' className='hidden sm:inline-flex'>
                Get started
                <ArrowRight className='size-4' />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className='relative'>
        <div className='mx-auto max-w-7xl px-6 pb-12 sm:pb-16 pt-16 sm:pt-20 lg:pt-28'>
          <div className='mx-auto max-w-3xl text-center'>
            <div className='inline-flex items-center gap-2 rounded-full border bg-card text-card-foreground px-3.5 py-1.5 text-[11px] md:text-xs'>
              Launch your store in seconds
            </div>
            <h1 className='mt-8 text-pretty text-4xl font-semibold tracking-tight leading-tight sm:text-5xl lg:text-6xl'>
              Build & Launch your store with in <span className='hue-gradient-text'>seconds</span>
            </h1>
            <p className='mt-5 sm:mt-6 text-balance text-base text-muted-foreground leading-relaxed sm:text-lg'>
              A streamlined onboarding that gets you from idea to a polished storefront—no code, no bloat. Connect products, customize
              your look, and go live.
            </p>
            <div className='mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4'>
              <Link href='/auth/login'>
                <Button size='lg' className='w-full sm:w-auto'>
                  Start free
                  <ArrowRight className='size-4' />
                </Button>
              </Link>
              <Link href='/store/demo' className='w-full sm:w-auto'>
                <Button variant='outline' size='lg' className='w-full sm:w-auto'>
                  See a live demo
                </Button>
              </Link>
            </div>
            {/* <p className='mt-4 text-xs text-muted-foreground'>No credit card required • Publish when you’re ready</p> */}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='border-t'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-2xl font-semibold tracking-tight leading-snug sm:text-3xl'>Onboard in three simple steps</h2>
            <p className='mt-4 text-muted-foreground leading-relaxed'>No friction, just momentum.</p>
          </div>
          <ol className='mt-10 grid gap-6 sm:gap-7 lg:gap-8 sm:grid-cols-3'>
            <StepCard
              index={1}
              title='Create your account'
              desc='Sign in to start a workspace—your store comes provisioned instantly.'
            />
            <StepCard
              index={2}
              title='Add products & branding'
              desc='Import your catalog, upload images, and pick a look that fits.'
            />
            <StepCard index={3} title='Publish when ready' desc='Preview on a demo URL, then connect your domain and go live.' />
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className=''>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-2xl font-semibold tracking-tight leading-snug sm:text-3xl'>Everything you need to start selling</h2>
            <p className='mt-4 sm:mt-5 text-muted-foreground leading-relaxed'>
              Our opinionated defaults make setup effortless, while shadcn-based components keep things clean and accessible.
            </p>
          </div>
          <div className='mt-10 grid gap-5 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <FeatureCard
              icon={<LayoutGrid className='size-5' />}
              title='Beautiful product pages'
              desc='Elegant, responsive layouts with sensible defaults—images, variants, and details just work.'
            />
            <FeatureCard
              icon={<CreditCard className='size-5' />}
              title='Payments & orders'
              desc='Ready for integrations and order flow. Go from zero to checkout with minimal config.'
            />
            <FeatureCard
              icon={<Palette className='size-5' />}
              title='Neutral, modern theme'
              desc='Thoughtful spacing, typography, and theming that adapts to light and dark.'
            />
            <FeatureCard
              icon={<Globe className='size-5' />}
              title='Custom domain ready'
              desc='Publish when you’re ready and connect your own domain in a few clicks.'
            />
            <FeatureCard
              icon={<Rocket className='size-5' />}
              title='Fast onboarding'
              desc='Guided steps help you import products, add branding, and launch fast.'
            />
            <FeatureCard
              icon={<ArrowRight className='size-5' />}
              title='From draft to live'
              desc='Preview your store as you go, then publish confidently when it feels right.'
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24'>
          <div className='mx-auto max-w-3xl rounded-xl border bg-card p-8 sm:p-10 md:p-12 text-center'>
            <h3 className='text-pretty text-2xl font-semibold tracking-tight leading-snug sm:text-3xl'>
              Ready to launch your store today?
            </h3>
            <p className='mt-4 sm:mt-5 text-muted-foreground leading-relaxed'>
              Join makers who get online fast with an experience that values clarity, speed, and great defaults.
            </p>
            <div className='mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4'>
              <Link href='/auth/login'>
                <Button size='lg'>
                  Create your store
                  <ArrowRight className='size-4' />
                </Button>
              </Link>
              <Link href='/dashboard'>
                <Button size='lg' variant='outline'>
                  Go to dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t'>
        <div className='mx-auto max-w-7xl px-6 py-10 flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row flex-wrap'>
          <p className='text-xs text-muted-foreground'>© {new Date().getFullYear()} Instant Store. Launch thoughtfully.</p>
          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <Link href='/auth/login' className='hover:text-foreground'>
              Sign in
            </Link>
            <Link href='/store/demo' className='hover:text-foreground'>
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 sm:p-7 space-y-3.5">
      <div className="inline-flex size-12 items-center justify-center rounded-lg border">
        {icon}
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <li className="rounded-xl border bg-card p-6 sm:p-7">
      <div className="flex items-start gap-5">
        <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full border text-sm font-medium">
          {index}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </li>
  );
}
