import { Shield } from "lucide-react";
import { Button } from "./ui/button";

export function PricingSection() {

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Simple Pricing</h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col p-6 bg-background shadow-lg rounded-lg justify-between border">
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">Team Plan</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Up to 10 team members</li>
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Unlimited strategies</li>
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Advanced collaboration tools</li>
              </ul>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold">$19.99</span>/month
              <Button className="w-full mt-4" size="lg">Get Started</Button>
            </div>
          </div>
          <div className="flex flex-col p-6 bg-background shadow-lg rounded-lg justify-between border">
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">Pro Plan</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Unlimited team members</li>
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Advanced analytics</li>
                <li className="flex items-center"><Shield className="mr-2 h-4 w-4" /> Priority support</li>
              </ul>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold">$39.99</span>/month
              <Button className="w-full mt-4" size="lg">Get Started</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}