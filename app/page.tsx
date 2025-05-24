'use client';

import GwaCalculator from "@/components/gwa-calculator";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5 overflow-auto min-h-svh">
      <div className="flex flex-row items-center gap-3 md:gap-5">
        <Logo className="h-12 md:h-24 fill-foreground" />
        <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
          GWA Buddy
        </h1>
      </div>
      <p className="max-w-3xl leading-7 text-center">
        A web application that helps NEUST students calculate their General Weighted Average (GWA) based on their grades.
      </p>
      <Card className="w-full max-w-3xl">
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
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>NEUST Portal Directory</CardTitle>
          <CardDescription>Stay informed about your department&apos;s portal status</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Wondering if your department&apos;s portal is online or if it&apos;s just a slow connection? Check out the <a href="https://neust-portal.link" className="underline text-primary underline-offset-2 hover:text-primary/80">NEUST Portal Directory</a> page I made to view the current status of the portals.</p>
          <p></p>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button asChild>
              <Link href="https://neust-portal.link">
                Visit Website
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
