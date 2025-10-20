"use client";

import { Check, X, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with equity research",
      icon: Zap,
      iconColor: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "5 DCF analyses per month",
        "Basic scenario analysis",
        "Yahoo Finance data",
        "Export to Excel",
        "Community support",
        "Basic charts & visualizations",
      ],
      notIncluded: [
        "LBO models",
        "Comparable company analysis",
        "Real-time data",
        "AI-powered insights",
        "Advanced models",
        "API access",
      ],
      cta: "Get Started Free",
      href: "/dashboard",
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "per month",
      description: "For serious investors and professional analysts",
      icon: Crown,
      iconColor: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Unlimited DCF analyses",
        "Advanced scenario modeling",
        "Full LBO calculator",
        "Comparable company analysis",
        "Real-time data feeds",
        "AI-powered insights & commentary",
        "Advanced charts & visualizations",
        "Natural language queries",
        "Export to Excel & PDF",
        "Priority email support",
        "Save unlimited analyses",
        "Custom assumptions",
      ],
      notIncluded: [
        "FactSet/Bloomberg integration",
        "White-label options",
        "API access",
        "Team collaboration",
      ],
      cta: "Start 14-Day Free Trial",
      href: "/dashboard",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For teams and institutional investors",
      icon: Building2,
      iconColor: "text-green-500",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "Everything in Pro",
        "FactSet / Bloomberg integration",
        "Morningstar data connectors",
        "Custom financial models",
        "White-label options",
        "Full API access",
        "Dedicated account manager",
        "Custom data sources",
        "Team collaboration tools",
        "Advanced security & compliance",
        "SLA guarantee",
        "Custom integrations",
        "On-premise deployment option",
        "Training & onboarding",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      href: "mailto:sales@alphaforge.com",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
          <div className="flex items-center justify-center gap-3 text-white/90">
            <Check className="h-5 w-5" />
            <span>No credit card required</span>
            <span className="text-white/50">•</span>
            <Check className="h-5 w-5" />
            <span>Cancel anytime</span>
            <span className="text-white/50">•</span>
            <Check className="h-5 w-5" />
            <span>14-day money-back guarantee</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-[#161B22] rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular
                    ? "border-purple-500 ring-4 ring-purple-500/20"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} bg-opacity-10`}
                    >
                      <Icon className={`h-8 w-8 ${plan.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period !== "contact sales" && (
                        <span className="text-gray-600 dark:text-gray-400">
                          / {plan.period.split(" ")[1] || plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {plan.period}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.href}
                    className={`block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all mb-8 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </Link>

                  {/* Features */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                      What's Included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                        >
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-3">
                            Not Included
                          </p>
                          <ul className="space-y-3">
                            {plan.notIncluded.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-3 text-gray-500 dark:text-gray-600"
                              >
                                <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Can I switch plans later?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                What data sources do you use?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Free tier uses Yahoo Finance. Pro includes real-time data from FinancialModelingPrep. Enterprise customers can integrate their own FactSet, Bloomberg, or Morningstar licenses.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment, no questions asked.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Do you offer discounts for students or nonprofits?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! We offer 50% off Pro plans for students and qualified nonprofit organizations. Contact us with your educational or nonprofit credentials.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                What's included in Enterprise support?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise customers get a dedicated account manager, priority support with guaranteed response times, custom integrations, on-premise deployment options, and personalized training for your team.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to transform your equity research?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors and analysts using AlphaForge to make better investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:sales@alphaforge.com"
              className="px-8 py-4 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition border-2 border-white/20"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}