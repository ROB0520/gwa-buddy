import Logo from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { AcadsInfo } from "./acads-info";
import { GWACalculator } from "./gwa-calculator";
import { programs as programsData } from "@/data/programs";
import { Curriculum } from "@/data/types";

type SearchParams = Record<string, string | string[] | undefined>;

type IncludedCourse = {
	code?: string;
	name?: string;
	units?: number;
	majorCode?: string | string[];
	coreOnly?: boolean;
	grade?: number | null;
};

type SharedLinkPayload = number[];

function parseInteger(value: string | string[] | undefined) {
	const rawValue = Array.isArray(value) ? value[0] : value;
	if (typeof rawValue !== "string") return null;
	const parsed = Number.parseInt(rawValue, 10);
	return Number.isInteger(parsed) ? parsed : null;
}

function parseBoolean(value: string | string[] | undefined) {
	const rawValue = Array.isArray(value) ? value[0] : value;
	return typeof rawValue === "string" && rawValue.toLowerCase() === "true";
}

function fromBase64Url(value: string) {
	const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
	const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
	const binary = Buffer.from(padded, "base64").toString("binary");
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function xorBytes(bytes: Uint8Array, seed: number) {
	let state = seed >>> 0;
	return bytes.map((byte) => {
		state = (state * 1664525 + 1013904223) >>> 0;
		return byte ^ (state & 0xff);
	});
}

function decodeVarints(bytes: Uint8Array) {
	const values: number[] = [];
	let current = 0;
	let shift = 0;
	for (const byte of bytes) {
		current |= (byte & 0x7f) << shift;
		if ((byte & 0x80) === 0) {
			values.push(current >>> 0);
			current = 0;
			shift = 0;
			continue;
		}
		shift += 7;
	}
	if (shift !== 0) return null;
	return values;
}

function parseSharedSelectionToken(value: string | string[] | undefined): SharedLinkPayload | null {
	const rawValue = Array.isArray(value) ? value[0] : value;
	if (!rawValue) return null;
	const [seedPart, encodedPart] = rawValue.split(".");
	if (!seedPart || !encodedPart) return null;
	const seed = Number.parseInt(seedPart, 16);
	if (!Number.isInteger(seed) || seed < 0 || seed > 255) return null;
	try {
		const decoded = fromBase64Url(encodedPart);
		const payloadBytes = xorBytes(decoded, seed);
		return decodeVarints(payloadBytes);
	} catch {
		return null;
	}
}

function getFlattenedCurriculumCourses(curriculumData: Curriculum) {
	return (curriculumData.term ?? []).flatMap((term) => term.courses ?? []);
}

function courseHasMajor(c: { majorCode?: string | string[] | undefined }, major: string) {
	if (!c.majorCode) return false;
	return typeof c.majorCode === "string" ? c.majorCode === major : c.majorCode.includes(major);
}

function includeForMajor(c: { majorCode?: string | string[] | undefined; coreOnly?: boolean }, major: string) {
	if (c.coreOnly) return false;
	if (c.majorCode === undefined) return true;
	return courseHasMajor(c, major);
}

function snapshotForCourses(courses?: Array<{ code?: string }>) {
	return (courses ?? []).map((course) => course.code).filter((code): code is string => typeof code === "string").sort();
}

function hydrateSharedCourses(payload: SharedLinkPayload, curriculumData: Curriculum): IncludedCourse[] {
	const allCourses = getFlattenedCurriculumCourses(curriculumData);
	return payload.flatMap((index) => {
		const matched = allCourses[index];
		if (!matched) return [];
		return [{
			code: matched.code,
			name: matched.name,
			units: matched.units,
			majorCode: matched.majorCode,
			coreOnly: matched.coreOnly,
			grade: null,
		}];
	});
}

function deriveInitialIncludedCourses(searchParams: SearchParams, curriculumData: Curriculum | null) {
	if (!curriculumData) return [] as IncludedCourse[];

	const sharedSelection = parseSharedSelectionToken(searchParams.selection ?? searchParams.s);
	if (sharedSelection) {
		return hydrateSharedCourses(sharedSelection, curriculumData);
	}

	const selectedYear = parseInteger(searchParams.year);
	const selectedSemester = parseInteger(searchParams.semester);
	const selectedMajor = typeof searchParams.major === "string" ? searchParams.major : null;
	const filterCore = parseBoolean(searchParams.core);
	const allTerms = curriculumData.term ?? [];

	if (selectedYear && selectedSemester) {
		const term = allTerms.find((t) => t.year === selectedYear && t.semester === selectedSemester);
		if (!term) return [] as IncludedCourse[];
		return (term.courses ?? []).filter((course) => {
			if (filterCore) return course.coreOnly || course.majorCode === undefined;
			if (selectedMajor) return includeForMajor(course, selectedMajor);
			return true;
		}).map((course) => ({
			code: course.code,
			name: course.name,
			units: course.units,
			majorCode: course.majorCode,
			coreOnly: course.coreOnly,
			grade: null,
		}));
	}

	if (selectedYear) {
		const terms = allTerms.filter((term) => term.year === selectedYear);
		if (terms.length === 0) return [] as IncludedCourse[];

		const majorsInYear = new Set<string>();
		let hasCoreInYear = false;
		for (const term of terms) for (const course of (term.courses ?? [])) {
			if (course.majorCode) {
				if (typeof course.majorCode === "string") majorsInYear.add(course.majorCode);
				else for (const majorCode of course.majorCode) majorsInYear.add(majorCode);
			}
			if (course.coreOnly) hasCoreInYear = true;
		}

		if (majorsInYear.size === 0 && !hasCoreInYear) {
			return terms.flatMap((term) => (term.courses ?? []).map((course) => ({
				code: course.code,
				name: course.name,
				units: course.units,
				majorCode: course.majorCode,
				coreOnly: course.coreOnly,
				grade: null,
			})));
		}

		if (filterCore) {
			return terms.flatMap((term) => (term.courses ?? [])
				.filter((course) => course.coreOnly || course.majorCode === undefined)
				.map((course) => ({
					code: course.code,
					name: course.name,
					units: course.units,
					majorCode: course.majorCode,
					coreOnly: course.coreOnly,
					grade: null,
				})));
		}

		if (selectedMajor) {
			return terms.flatMap((term) => (term.courses ?? [])
				.filter((course) => includeForMajor(course, selectedMajor))
				.map((course) => ({
					code: course.code,
					name: course.name,
					units: course.units,
					majorCode: course.majorCode,
					coreOnly: course.coreOnly,
					grade: null,
				})));
		}

		return [] as IncludedCourse[];
	}

	if (selectedMajor || filterCore) {
		return allTerms.flatMap((term) => (term.courses ?? [])
			.filter((course) => {
				if (filterCore) {
					return course.coreOnly || course.majorCode === undefined;
				}
				if (selectedMajor) {
					return (course.majorCode === selectedMajor || course.majorCode === undefined) && !course.coreOnly;
				}
				return false;
			})
			.map((course) => ({
				code: course.code,
				name: course.name,
				units: course.units,
				majorCode: course.majorCode,
				coreOnly: course.coreOnly,
				grade: null,
			})));
	}

	return [] as IncludedCourse[];
}

async function resolveInitialCurriculum(searchParams: SearchParams): Promise<Curriculum | null> {
	const selectedProgram = typeof searchParams.program === "string" ? searchParams.program : null;
	const selectedCurriculum = typeof searchParams.curriculum === "string" ? searchParams.curriculum : null;
	if (!selectedProgram || !selectedCurriculum) return null;

	const program = programsData.find((entry) => entry.code === selectedProgram);
	if (!program) return null;

	try {
		const mod = await import(`@/data/curriculums/${program.internalName}/${selectedCurriculum}`);
		return (mod.default ?? mod) as Curriculum;
	} catch {
		return null;
	}
}


export default async function HomePage({ searchParams }: { searchParams?: SearchParams | Promise<SearchParams> }) {
	const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
	const initialCurriculumData = await resolveInitialCurriculum(resolvedSearchParams);
	const initialIncludedCourses = deriveInitialIncludedCourses(resolvedSearchParams, initialCurriculumData);
	const initialSnapshot = snapshotForCourses(initialIncludedCourses);
	return (
		<main className="p-4 flex flex-col items-center gap-4 min-h-dvh">
			<div className="flex flex-col items-center">
				<Logo className="size-16 drop-shadow" />
				<h1 className="text-4xl font-extrabold tracking-tight text-balance">GWA Buddy</h1>
				<p className="text-center text-muted-foreground max-w-2xl leading-7">
					Your companion for calculating and tracking your Grade Weighted Average (GWA) with ease and efficiency.
				</p>
			</div>
			<Alert className="max-w-2xl">
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

			<GWACalculator
				initialCurriculumData={initialCurriculumData}
				initialIncludedCourses={initialIncludedCourses}
				initialLastIncludedSnapshot={initialSnapshot}
			/>

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