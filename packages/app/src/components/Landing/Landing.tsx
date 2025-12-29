import { FC } from 'react';
import { PitchDeck } from '@pitch/types/pitch.types';
import Link from 'next/link';
import { Navbar } from '../Navbar';
import { formatCurrency } from '@pitch/utils/number';

export const Landing: FC<{ data: PitchDeck }> = ({ data }) => {
	const { title, problems, solutions, product, pricing } = data;

	return (
		<div className="bg-base-100 text-base-content min-h-screen">
			{/* ================= NAVBAR ================= */}
			<Navbar />

			{/* ================= HERO ================= */}
			<section className="hero bg-base-200 py-24">
				<div className="hero-content max-w-4xl text-center">
					<div>
						<h1 className="mb-6 text-5xl font-bold">{title.product}</h1>
						<p className="mb-4 text-xl opacity-80">{title.tagline}</p>
						<p className="mb-8 opacity-70">Built for {title.audience}</p>
						<div className="flex justify-center gap-4">
							<Link href="/app">
								<button className="btn btn-primary btn-lg">
									Generate your pitch
								</button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ================= PROBLEMS ================= */}
			<section className="py-20">
				<div className="mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold">
						{problems.title}
					</h2>
					{problems.subtitle && (
						<p className="mb-12 text-center text-lg opacity-70">
							{problems.subtitle}
						</p>
					)}

					<div className="grid gap-8 md:grid-cols-3">
						{problems.items.map((p, i) => (
							<div
								key={i}
								className="card bg-base-200 border-base-300 border shadow-2xl">
								<div className="card-body">
									<div className="mb-2 text-3xl">{p.emoji}</div>
									<h3 className="card-title">{p.title}</h3>
									<p className="opacity-80">{p.description}</p>

									<div className="mt-4 text-sm opacity-60">
										<p>
											<strong>Impact:</strong> {p.impact}
										</p>
										<p>
											<strong>For:</strong> {p.userType}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ================= SOLUTIONS ================= */}
			<section className="bg-base-200 py-20">
				<div className="mx-auto max-w-5xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold">
						{solutions.title}
					</h2>
					{solutions.subtitle && (
						<p className="mb-12 text-center text-lg opacity-70">
							{solutions.subtitle}
						</p>
					)}

					<div className="grid gap-8 md:grid-cols-3">
						{solutions.items.map((s, i) => (
							<div
								key={`solution-${i}`}
								className="card bg-base-100 border-base-300 border text-center shadow-2xl">
								<div className="card-body">
									<div className="mb-4 text-4xl">{s.emoji}</div>
									<span className="badge badge-primary mx-auto mb-2">
										Step {s.step}
									</span>
									<h3 className="text-xl font-semibold">{s.title}</h3>
									<p className="opacity-80">{s.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ================= PRODUCT FEATURES ================= */}
			<section className="py-20">
				<div className="mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold">
						{product.title}
					</h2>
					{product.subtitle && (
						<p className="mb-12 text-center text-lg opacity-70">
							{product.subtitle}
						</p>
					)}

					<div className="grid gap-8 md:grid-cols-3">
						{product.features.map((f, i) => (
							<div
								key={`feature-${i}`}
								className="card bg-base-200 border-base-300 border shadow-2xl">
								<div className="card-body">
									<div className="mb-2 text-3xl">{f.emoji}</div>
									<h3 className="card-title">{f.title}</h3>
									<p className="opacity-80">{f.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ================= PRICING ================= */}
			<section className="bg-base-200 py-20">
				<div className="mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold">
						{pricing.title}
					</h2>
					{pricing.subtitle && (
						<p className="mb-12 text-center text-lg opacity-70">
							{pricing.subtitle}
						</p>
					)}

					<div className="grid gap-8 md:grid-cols-3">
						{pricing.plans.map((plan, i) => (
							<div key={i} className="card bg-base-100 shadow-lg">
								<div className="card-body text-center">
									<h3 className="text-xl font-semibold">{plan.name}</h3>

									<p className="my-4 text-4xl font-bold">
										{formatCurrency(plan.amount, pricing.currency)}
									</p>

									<p className="mb-6 opacity-60">{plan.frequency}</p>
									<p className="mb-8 opacity-80">{plan.description}</p>

									<button className="btn btn-primary w-full">
										Get started
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ================= CTA ================= */}
			<section className="py-24">
				<div className="mx-auto max-w-4xl px-4 text-center">
					<h2 className="mb-12 text-center text-4xl font-bold">
						Ready to impress investors?
					</h2>
					<p className="mb-12 text-center text-lg opacity-70">
						Create your pitch deck in minutes — not days.
					</p>
					<Link href="/app">
						<button className="btn btn-primary btn-lg">
							Generate my pitch deck
						</button>
					</Link>
				</div>
			</section>

			{/* ================= FOOTER ================= */}
			<footer className="footer footer-center bg-base-300 text-base-content p-6">
				<aside>
					<p className="font-semibold">{title.product}</p>
					<p className="text-sm opacity-60">
						© {new Date().getFullYear()} — All rights reserved
					</p>
				</aside>
			</footer>
		</div>
	);
};
