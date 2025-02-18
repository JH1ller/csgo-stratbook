import { Crosshair, Users, Map } from "lucide-react";

export function FeatureOverview() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/20 p-4 rounded-full">
              <Crosshair className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Strategy Management</h3>
            <p className="text-muted-foreground">Create, edit, and organize your CS2 strategies with ease.</p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/20 p-4 rounded-full">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Team Collaboration</h3>
            <p className="text-muted-foreground">Work together with your team in real-time on strategies and tactics.</p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/20 p-4 rounded-full">
              <Map className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Grenade Lineups</h3>
            <p className="text-muted-foreground">Store and share precise grenade lineups for every map.</p>
          </div>
        </div>
      </div>
    </section>
  );
}