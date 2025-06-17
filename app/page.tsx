'use client';

import GwaCalculator from "@/components/gwa-calculator";
import Logo from '@/public/logo.svg'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-5 overflow-auto min-h-svh">
      <div className="flex flex-row items-center gap-3 md:gap-5 drop-shadow-md">
        <Image
          src={Logo}
          alt="AleczR Logo"
          className="h-12 md:h-24 w-auto"
        />
        <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
          <span className="text-primary">GWA</span> Buddy
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
          <p>Email me at <Link href="mailto:gwabuddy@aleczr.link" className="underline text-primary hover:text-primary/80">gwabuddy@aleczr.link</Link></p>
        </CardFooter>
      </Card>
      <GwaCalculator />
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>NEUST Portal Directory</CardTitle>
            <CardDescription>Find your department&apos;s portal and check its current status</CardDescription>
        </CardHeader>
        <CardContent>
            <p>
              Check the real-time NEUST Portal server status from one place with another site that I made called the <Link href="https://neust-portal.link" className="underline text-primary underline-offset-2 hover:text-primary/80">NEUST Portal Directory</Link>.
            </p>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button asChild>
              <Link href="https://neust-portal.link">
                Visit Website
              </Link>
            </Button>
        </CardFooter>
      </Card>
      <p className="text-sm text-muted-foreground italic px-10 md:px-0 max-w-3xl text-center">
        GWA Buddy is a student-developed tool that helps NEUST students calculate their General Weighted Average. This project is not officially affiliated with the university.
      </p>
    </div>
  );
}
