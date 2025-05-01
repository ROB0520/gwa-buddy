'use client';

import GwaCalculator from "@/components/gwa-calculator";
import Logo from "@/components/logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-svh flex flex-col gap-5 items-center justify-center p-5 overflow-auto">
      <div className="flex flex-row gap-3 md:gap-5 items-center">
        <Logo className="h-12 md:h-24 fill-foreground" />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          GWA Buddy
        </h1>
      </div>
      <p className="leading-7 text-center max-w-2xl">
        A web application that helps NEUST students calculate their General Weighted Average (GWA) based on their grades.
      </p>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Contribute</CardTitle>
          <CardDescription>Help me improve GWA Buddy</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Want to add your course to GWA Buddy or have suggestions for improvements? I&apos;d love to hear from you!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Email me at <a href="mailto:contact.aleczr+gwabuddy@gmail.com" className="underline text-primary hover:text-primary/80">contact.aleczr+gwabuddy@gmail.com</a></p>
        </CardFooter>
      </Card>
      <GwaCalculator />
    </div>
  );
}
