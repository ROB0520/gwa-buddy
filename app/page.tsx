import Logo from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { AcadsInfo } from "./acads-info";
import { GWACalculator } from "./calculator";

export default function HomePage() {
	return (
		<main className="p-4 flex flex-col items-center gap-4 min-h-dvh">
			<div className="flex flex-col items-center">
				<Logo className="size-16 drop-shadow" />
				<h1 className="text-4xl font-extrabold tracking-tight text-balance">GWA Buddy</h1>
				<p className="text-center text-muted-foreground max-w-2xl leading-7">
					Your companion for calculating and tracking your Grade Weighted Average (GWA) with ease and efficiency.
				</p>
			</div>
			<Alert className="max-w-2xl shadow">
				<AlertCircleIcon />
				<AlertTitle>Contribute</AlertTitle>
				<AlertDescription className="md:text-wrap">
					<p>
						Want to add your program to GWA Buddy or have suggestions for improvements? I&apos;d love to hear from you!
					</p>
					<p>
						Email me at{" "}
						<Link
							href="mailto:gwabuddy@aleczr.link?subject=GWA%20Buddy%20Suggestions"
							className="text-primary hover:text-primary/80!"
						>
							gwabuddy@aleczr.link
						</Link>
					</p>
				</AlertDescription>
			</Alert>

			<GWACalculator />

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>
						NEUST Portal Directory
					</CardTitle>
					<CardDescription>
						Your one-stop directory for all NEUST portal servers.
					</CardDescription>
				</CardHeader>
				<CardContent>
					Check the real-time NEUST Portal server status from one place with another site that I made called the <Link href='https://neust-portal.link' className="text-accent hover:text-accent/80 underline underline-offset-2">NEUST Portal Directory</Link>.
				</CardContent>
				<CardFooter className="justify-end">
					<Button
						asChild
					>
						<Link
							href="https://neust-portal.link"
						>
							<GlobeIcon />
							Visit NEUST Portal Directory
						</Link>
					</Button>
				</CardFooter>
			</Card>

			<AcadsInfo />
			
			<footer className="italic text-xs text-center text-muted-foreground max-w-lg md:max-w-3xl">
				Developed by <span className="font-mono">alecz.r</span>.
			</footer>
		</main>
	)
}