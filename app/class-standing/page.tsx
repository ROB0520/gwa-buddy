import Logo from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
import { EncodedCourse, GradeCalculator } from "./grade-calculator";
import { decompressSync } from "fflate";

export const metadata: Metadata = {
	title: "Class Standing Calculator | GWA Buddy",
	description: "Calculate your class standing based on grading criteria, category weights, and activity scores. Track your performance in real time and instantly estimate your grade.",
	authors: [
		{
			name: 'alecz.r',
			url: 'https://aleczr.link',
		}
	],
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gwa.vps.aleczr.link'),
	openGraph: {
		images: '/og-image.png',
	},
	other: {
		"apple-mobile-web-app-title": "Class Standing Calculator | GWA Buddy",
	},
};

export default async function ClassStandingPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const template = (await searchParams).t as string | undefined
	const course = template ? deserializeCourse(template) : undefined

	return (
		<div className="space-y-4 p-4 min-h-dvh">
			<div className="flex flex-col items-center">
				<Link href="/"><Logo className="size-16 drop-shadow" /></Link>
				<Link href="/"><h1 className="text-4xl font-extrabold tracking-tight text-balance">GWA Buddy</h1></Link>
				<h2 className="text-2xl font-semibold text-accent">Class Standing Calculator</h2>
				<p className="text-center text-muted-foreground max-w-2xl leading-7">
					Calculate your class standing based on grading criteria and activity scores. Track your performance in real time and instantly estimate your subject grade.
				</p>
			</div>

			<GradeCalculator template={course} />
		</div>
	);
}

function deserializeCourse(
	encoded: string
): CourseDetails {

	const compressed = Uint8Array.from(
		atob(
			encoded
				.replace(/-/g, "+")
				.replace(/_/g, "/")
		),
		c => c.charCodeAt(0)
	);

	const json =
		new TextDecoder().decode(
			decompressSync(compressed)
		);

	const [
		courseName,
		categories,
	] = JSON.parse(json) as EncodedCourse;

	return {
		name: courseName,
		categories:
			categories.map(
				([
					categoryName,
					weight,
					prefixes,
					records,
				]) => ({
					name: categoryName,
					weight,
					records:
						records.map(
							(
								record,
								index
							) => {

								const type =
									record[0];

								if (type === 0) {
									return {
										name:
											`${categoryName} ${index + 1}`,
										score: 0,
										maxScore:
											record[1],
									};
								}

								if (type === 1) {

									const [
										,
										prefixIndex,
										number,
										maxScore,
									] = record;

									return {
										name:
											`${prefixes[prefixIndex]} ${number}`,
										score: 0,
										maxScore,
									};
								}

								const [
									,
									name,
									maxScore,
								] = record;

								return {
									name,
									score: 0,
									maxScore,
								};
							}
						),
				})
			),
	};
}



type CourseDetails = {
	name: string;
	categories: CourseCategory[];
}

type CourseCategory = {
	name: string;
	weight: number;
	records: CourseCategoryRecord[];
}

type CourseCategoryRecord = {
	name: string;
	score: number;
	maxScore: number;
}