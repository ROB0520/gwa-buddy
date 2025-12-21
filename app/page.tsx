"use client"

import Logo from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, BookXIcon, CalculatorIcon, ChevronsUpDownIcon, ClipboardXIcon, EraserIcon, EyeIcon, FunnelXIcon, GlobeIcon, GraduationCapIcon, MinusIcon, PartyPopperIcon, PenLineIcon, PlusIcon, ScaleIcon, ScrollTextIcon, SearchXIcon, ShieldIcon, SparkleIcon, StarsIcon, TrendingUpDownIcon, TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { parseAsBoolean, parseAsInteger, parseAsString, SetValues, SingleParserBuilder, useQueryStates } from "nuqs"
import { programs as programsData } from "@/data/programs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect, Dispatch, SetStateAction, Fragment, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Curriculum } from "@/data/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { confirm } from "@/components/confirm-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ScrollSpy, ScrollSpyLink, ScrollSpyNav, ScrollSpySection, ScrollSpyViewport } from "@/components/ui/scroll-spy"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Course = {
	code?: string;
	name?: string;
	units?: number;
	majorCode?: string;
	coreOnly?: boolean;
	grade?: number | null;
}

export default function Page() {
	const [{
		program: selectedProgram,
		curriculum: selectedCurriculum,
		major: selectedMajor,
		year: selectedYear,
		semester: selectedSemester,
		core: filterCore
	}, setFilters] = useQueryStates({
		program: parseAsString,
		curriculum: parseAsString,
		major: parseAsString,
		year: parseAsInteger,
		semester: parseAsInteger,
		core: parseAsBoolean.withDefault(false),
	});
	const [curriculumData, setCurriculumData] = useState<Curriculum | null>(null);
	const [includedCourses, setIncludedCourses] = useState<Course[]>([]);
	const [lastIncludedSnapshot, setLastIncludedSnapshot] = useState<string[] | null>(null);
	const [selectedCourseIndex, setSelectedCourseIndex] = useState<number | null>(null);
	const [finalGwa, setFinalGwa] = useState<number | null>(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		// Load curriculum if needed
		const loadCurriculum = async () => {
			if (selectedProgram && selectedCurriculum) {
				const program = programsData.find((p) => p.code === selectedProgram);
				if (!program) {
					setCurriculumData(null);
					return;
				}

				const dir = program.internalName;
				try {
					const mod = await import(`@/data/curriculums/${dir}/${selectedCurriculum}`);
					const data = (mod.default ?? mod) as Curriculum;
					setCurriculumData(data);
				} catch {
					setCurriculumData(null);
					toast.error("Failed to load curriculum data. Try again later.");
				}
				return;
			}
		};

		setFinalGwa(null); // reset GWA on filter change

		if (includedCourses.length > 0) return; // don't overwrite user edits
		if (!curriculumData) { loadCurriculum(); return; }

		const allTerms = curriculumData.term ?? [];

		const snapshotFor = (courses?: Array<{ code?: string }>) => (courses ?? []).map(c => c.code).filter((s): s is string => typeof s === 'string').sort();

		// 1) Exact semester preset (year + semester)
		if (selectedYear && selectedSemester) {
			const term = allTerms.find((t) => t.year === selectedYear && t.semester === selectedSemester);
			if (!term) return;
			const matched = (term.courses ?? []).filter((c) => {
				if (filterCore) return c.coreOnly || c.majorCode === undefined;
				if (selectedMajor) return (c.majorCode === selectedMajor || c.majorCode === undefined) && !c.coreOnly;
				return true;
			});
			if ((matched ?? []).length > 0) {
				applyPresetToPage(matched as Course[], snapshotFor(matched));
			}
			return;
		}

		// 2) Year-level preset (selectedYear provided, no semester)
		if (selectedYear) {
			const terms = allTerms.filter(t => t.year === selectedYear);
			if (terms.length === 0) return;
			// determine majors/core presence in year
			const majorsInYear = new Set<string>();
			let hasCoreInYear = false;
			for (const t of terms) for (const c of (t.courses ?? [])) {
				if (c.majorCode) majorsInYear.add(c.majorCode);
				if (c.coreOnly) hasCoreInYear = true;
			}

			if (majorsInYear.size === 0 && !hasCoreInYear) {
				// All courses in the year
				const collected: Course[] = [];
				for (const t of terms) for (const c of (t.courses ?? [])) collected.push(c as Course);
				if (collected.length > 0) applyPresetToPage(collected, snapshotFor(collected));
				return;
			}

			// year has majors and/or core-only: only apply if user selected a major or filterCore
			if (filterCore) {
				const collected: Course[] = [];
				for (const t of terms) for (const c of (t.courses ?? [])) if (c.coreOnly || c.majorCode === undefined) collected.push(c as Course);
				if (collected.length > 0) applyPresetToPage(collected, snapshotFor(collected));
				return;
			}
			if (selectedMajor) {
				const collected: Course[] = [];
				for (const t of terms) for (const c of (t.courses ?? [])) if ((c.majorCode === selectedMajor || c.majorCode === undefined) && !c.coreOnly) collected.push(c as Course);
				if (collected.length > 0) applyPresetToPage(collected, snapshotFor(collected));
				return;
			}
			return;
		}

		// 3) Program-level presets (no year/semester) — apply if selectedMajor or filterCore present
		if (selectedMajor || filterCore) {
			const collected: Course[] = [];
			for (const t of allTerms) for (const c of (t.courses ?? [])) {
				if (filterCore) {
					if (c.coreOnly || c.majorCode === undefined) collected.push(c as Course);
					continue;
				}
				if (selectedMajor) {
					if ((c.majorCode === selectedMajor || c.majorCode === undefined) && !c.coreOnly) collected.push(c as Course);
				}
			}
			if (collected.length > 0) applyPresetToPage(collected, snapshotFor(collected));
			return;
		}
	}, [curriculumData, selectedYear, selectedSemester, selectedMajor, filterCore, includedCourses.length, selectedProgram, selectedCurriculum]);

	function applyPresetToPage(courses: Course[], snapshot: string[]) {
		setIncludedCourses(courses);
		setLastIncludedSnapshot(snapshot);
	}

	// Shared course list (rendered once) — used by the single Drawer/Popover below.
	const sharedCourseList = (
		<Command className="rounded-none! md:rounded-xl!">
			<CommandInput placeholder="Filter courses..." />
			<CommandList className="max-md:max-h-[50dvh]">
				<CommandEmpty>
					<Empty className="p-0">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<SearchXIcon />
							</EmptyMedia>
							<EmptyTitle>Course not found</EmptyTitle>
							<EmptyDescription>If the course you&apos;re looking for isn&apos;t listed, please email your COR or program&apos;s Course Prospectus so that it could be added.</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button asChild>
								<Link
									href="mailto:gwabuddy@aleczr.link?subject=GWA%20Buddy%20Suggestions"
									className="text-primary hover:text-primary/80!"
								>
									Send Email
								</Link>
							</Button>
						</EmptyContent>
					</Empty>
				</CommandEmpty>
				{curriculumData?.term.map((term, i) => (
					<Fragment key={`term-${i}`}>
						<CommandGroup
							heading={`Year ${term.year}, ${semesterOrdinal(term.semester)} Semester`}
							className="[&_[cmdk-group-items]_[cmdk-group-heading]]:pt-0"
						>
							{(term.courses ?? []).map((course, j) => (
								<CommandItem
									key={`course-${j}`}
									value={(course.code ?? '') + ' - ' + (course.name ?? '')}
									data-course-code={course.code}
									data-course-name={course.name}
									onSelect={() => {
										if (selectedCourseIndex !== null) {
											const current = includedCourses[selectedCourseIndex];
											if (current && current.code === course.code && current.name === course.name) return
										}
										if (selectedCourseIndex === null) return;
										const newCourses = [...includedCourses];
										newCourses[selectedCourseIndex] = {
											code: course.code,
											name: course.name,
											units: course.units,
											majorCode: course.majorCode,
											coreOnly: course.coreOnly,
											grade: null
										};
										setIncludedCourses(newCourses);
										setSelectedCourseIndex(null);
									}}
									disabled={
										typeof course.code === 'string' && includedCourses.some((c, i) => c.code === course.code && i !== selectedCourseIndex)
									}
									data-checked={includedCourses.some(c => c.code === course.code && c.name === course.name)}
								>
									<span className="flex items-center justify-between gap-2 w-full">
										<span>
											<span className="font-semibold">{course.code}</span> – {course.name}
										</span>
										{
											course.majorCode ?
												<Badge>{course.majorCode}</Badge> :
												course.coreOnly ?
													<Badge>Core Only</Badge> :
													null
										}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
						{i < (curriculumData.term.length - 1) && <CommandSeparator />}
					</Fragment>
				))}
			</CommandList>
		</Command>
	);

	useEffect(() => {
		if (selectedCourseIndex === null) return;
		const selected = includedCourses[selectedCourseIndex];
		if (!selected) return;
		// Wait for the popover/drawer content to mount into the DOM
		requestAnimationFrame(() => {
			let el: Element | null = null;
			if (selected.code) el = document.querySelector(`[data-course-code="${selected.code}"]`);
			if (!el && selected.name) el = document.querySelector(`[data-course-name="${selected.name}"]`);
			if (el && el instanceof HTMLElement) {
				el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		});
	}, [selectedCourseIndex, curriculumData, includedCourses]);

	useEffect(() => {
		setFinalGwa(null);
	}, [includedCourses]);

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
			<div className="p-4 rounded-lg shadow border w-full max-w-2xl bg-card text-card-foreground">
				<h2 className="font-medium mb-4">
					Select Your Program & Curriculum
				</h2>
				<div className="flex flex-col md:flex-row gap-2 items-end">
					<ProgramInput
						className="w-full md:flex-2/5"
						selectedProgram={selectedProgram}
						includedCourses={includedCourses}
						setSelectedProgram={(program) => {
							setFilters({
								program,
								curriculum: 'latest',
								major: null,
								year: null,
								semester: null,
								core: false
							})
							setIncludedCourses([])
						}}
					/>
					<CurriculumInput
						className="w-full md:flex-1/5"
						selectedProgram={selectedProgram}
						selectedCurriculum={selectedCurriculum}
						includedCourses={includedCourses}
						setSelectedCurriculum={(curriculum) => {
							setFilters({
								curriculum,
								major: null,
								year: null,
								semester: null,
								core: false
							})
							setIncludedCourses([])
						}}
					/>
					<Button
						variant='destructive'
						disabled={!(selectedProgram || selectedCurriculum || includedCourses.length > 0)}
						onClick={async () => {
							if (includedCourses.length > 0) {
								const ok = await confirm({
									title: 'Reset Selection',
									message: 'Are you sure you want to reset your current selection and included courses? This action cannot be undone.',
									buttonMessage: 'Yes, Reset All',
									buttonVariant: 'destructive'
								})
								if (!ok) return;
							}
							setFilters({
								program: null,
								curriculum: null,
								major: null,
								year: null,
								semester: null,
								core: false,
							})
							setIncludedCourses([])
						}}
					>
						<FunnelXIcon />
						Reset Selection
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col items-center gap-2">
				<div className="flex flex-col md:flex-row md:items-end gap-2 w-full max-w-2xl">
					<PresetInput
						selectedProgram={selectedProgram}
						selectedCurriculum={selectedCurriculum}
						selectedMajor={selectedMajor}
						selectedYear={selectedYear}
						selectedSemester={selectedSemester}
						filterCore={filterCore}
						setFilters={setFilters}
						includedCourses={includedCourses}
						curriculumData={curriculumData}
						setCurriculumData={setCurriculumData}
						lastIncludedSnapshot={lastIncludedSnapshot}
						onApplyPreset={applyPresetToPage}
						className="md:flex-3"
					/>
					<div className="md:flex-1 flex items-stretch gap-2 w-full">
						<Button
							disabled={(() => {
								if (!curriculumData) return true;
								const allCodes = curriculumData.term.flatMap(t => t.courses ?? []).map(c => c.code).filter((s): s is string => typeof s === 'string');
								const uniqueCodes = new Set(allCodes);
								const assignedCodes = includedCourses.map(c => c.code).filter((s): s is string => typeof s === 'string');
								const uniqueAssigned = new Set(assignedCodes);
								// disable when we've already assigned all available unique course codes
								return uniqueAssigned.size >= uniqueCodes.size;
							})()}
							className="flex-1"
							onClick={() => {
								setIncludedCourses((prev) => ([
									...prev,
									{
										code: undefined,
										name: undefined,
										units: undefined,
										majorCode: undefined,
										coreOnly: undefined,
										grade: null
									}
								]))
							}}
						>
							<PlusIcon />
							Add Course Row
						</Button>
						<Button
							variant='destructive'
							className="flex-1"
							disabled={includedCourses.length === 0}
							onClick={async () => {
								const ok = await confirm({
									title: 'Clear All Courses',
									message: 'Are you sure you want to clear all included courses? This action cannot be undone.',
									buttonMessage: 'Yes, Clear All',
									buttonVariant: 'destructive'
								})

								if (ok) {
									setFilters({
										major: null,
										year: null,
										semester: null,
										core: false
									})
									setIncludedCourses([{
										code: undefined,
										name: undefined,
										units: undefined,
										majorCode: undefined,
										coreOnly: undefined,
										grade: null
									}])
									setLastIncludedSnapshot(null);
								}
							}}
						>
							<EraserIcon />
							Clear All Courses
						</Button>
					</div>
				</div>
				{includedCourses.length > 0 ? (
					<div className="space-y-2 gap-2 columns-1 lg:columns-2 max-w-7xl">
						{includedCourses.map((_, index) => (
							<CourseRow
								key={index}
								curriculumData={curriculumData}
								index={index}
								includedCourses={includedCourses}
								setIncludedCourses={setIncludedCourses}
								selectedCourseIndex={selectedCourseIndex}
								setSelectedCourseIndex={setSelectedCourseIndex}
								isMobile={isMobile}
								sharedCourseList={sharedCourseList}
							/>
						))}

					</div>
				) : (
					<Empty className="border border-dashed bg-muted/10 dark:bg-muted/20 max-w-7xl shadow">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<BookXIcon />
							</EmptyMedia>
							<EmptyTitle>
								{
									selectedProgram && selectedCurriculum ?
										" No Courses Included Yet" :
										" No Program & Curriculum Selected"
								}
							</EmptyTitle>
							<EmptyDescription>
								{
									selectedProgram && selectedCurriculum ?
										"Add courses to your list by clicking the 'Add Course Row' button below." :
										"Please select your program and curriculum above to get started."
								}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								disabled={!(selectedProgram && selectedCurriculum)}
								onClick={() => {
									setIncludedCourses([{
										code: undefined,
										name: undefined,
										units: undefined,
										majorCode: undefined,
										coreOnly: undefined,
										grade: null
									}])
								}}
							>
								{
									selectedProgram && selectedCurriculum ?
										<>
											<PlusIcon />
											Add Course Row
										</> :
										<>
											Select Program & Curriculum First
										</>
								}
							</Button>
						</EmptyContent>
					</Empty>
				)}
				<div className="flex justify-end w-full max-w-7xl">
					<Button
						disabled={includedCourses.length === 0 || includedCourses.some(c => c.grade === null || c.grade === undefined)}
						onClick={() => {
							// Calculate GWA
							let totalWeightedGrades = 0;
							let totalUnits = 0;
							includedCourses.forEach((course) => {
								if (course.grade !== null && course.grade !== undefined && course.units) {
									totalWeightedGrades += Number((course.grade * course.units).toFixed(2));
									totalUnits += course.units;
								}
							});
							if (totalUnits === 0) {
								setFinalGwa(null);
								return;
							}
							const gwa = totalWeightedGrades / totalUnits;
							setFinalGwa(gwa);
						}}
					>
						<CalculatorIcon />
						Calculate GWA
					</Button>
				</div>
			</div>

			{/* Single shared Drawer / Popover for course selection */}
			{isMobile ? (
				<Drawer open={selectedCourseIndex !== null} onOpenChange={(open) => { if (!open) setSelectedCourseIndex(null) }}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Select Course</DrawerTitle>
							<DrawerDescription>Choose a course from the list below.</DrawerDescription>
						</DrawerHeader>
						<div className="border-t">{sharedCourseList}</div>
					</DrawerContent>
				</Drawer>
			) : null}

			{
				finalGwa !== null ? (
					<div
						className={cn(
							"p-4 rounded-lg w-full max-w-md border border-current/10",
							finalGwa <= 1.25 ? "bg-green-100 dark:bg-green-500/30 border-green-300 dark:border-green-700/30 text-green-900 dark:text-green-50" :
								finalGwa <= 1.75 ? "bg-lime-100 dark:bg-lime-500/30 border-lime-300 dark:border-lime-700/30 text-lime-900 dark:text-lime-50" :
									finalGwa <= 2.50 ? "bg-yellow-100 dark:bg-yellow-500/30 border-yellow-300 dark:border-yellow-700/30 text-yellow-900 dark:text-yellow-50" :
										finalGwa <= 3.00 ? "bg-amber-100 dark:bg-amber-500/30 border-amber-300 dark:border-amber-700/30 text-amber-900 dark:text-amber-50" :
											"bg-destructive/50 dark:bg-destructive/30 border-destructive dark:border-destructive/30 text-destructive-foreground"
						)}
					>
						<p>Your GWA is...</p>
						<h2 className="text-4xl font-extrabold flex items-center gap-2">
							{
								finalGwa !== null ? (
									<>
										<span className="font-mono">{finalGwa.toFixed(2)}</span> {
											finalGwa <= 1.25 ? <PartyPopperIcon className="inline text-inherit" /> :
												finalGwa <= 1.75 ? <StarsIcon className="inline text-inherit" /> :
													finalGwa <= 2.50 ? <SparkleIcon className="inline text-inherit" /> :
														finalGwa <= 3.00 ? <TrendingUpDownIcon className="inline text-inherit" /> :
															<TriangleAlertIcon className="inline text-inherit size-[1ch]" />
										}
									</>
								) : (
									null
								)
							}
						</h2>
						<p className="text-sm">
							{
								finalGwa <= 1.25 ? "Excellent work! Keep it up!" :
									finalGwa <= 1.75 ? "Great job! You're doing well." :
										finalGwa <= 2.50 ? "Good effort! There's room for improvement." :
											finalGwa <= 3.00 ? "You're passing, but consider focusing more on your studies." :
												"Unfortunately, you're at risk of failing. Seek help and work hard to improve."
							}
						</p>
						<Collapsible>
							<CollapsibleTrigger asChild>
								<Button
									variant='default'
									size='lg'
									className="w-full mt-2"
								>
									<EyeIcon />
									See How It&apos;s Calculated
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2 space-y-2">
								<div>
									<h3 className="text-lg font-medium tracking-tight">
										Formula
									</h3>
									<p className="opacity-80 text-sm">
										Your Grade Weighted Average (GWA) is calculated using the formula:
									</p>
								</div>
								<div className="flex flex-col gap-2">
									<span className="opacity-80">GWA = <span className="inline-block relative align-middle text-center">
										<span className="p-0.5">
											Σ(Units × Grade)
										</span>
										<Separator className="bg-current" />
										<span className="p-0.5">
											Σ(Units)
										</span>
									</span>
									</span>
									<h3 className="text-lg font-medium tracking-tight">
										Solution
									</h3>
									<ol className="list-decimal pl-5 opacity-80 space-y-2">
										<li><div className="inline-block relative align-middle text-center">
											<span className="p-0.5">
												{includedCourses.map((eg, index) => {
													if (!eg.grade) return null;
													return (
														<Fragment key={index}>
															<span className="relative inline-flex justify-center pt-4">
																<span className="absolute top-1 text-xs opacity-80 line-clamp-1">
																	{eg.code}
																</span>
																<span className="tabular-nums font-mono">({eg.units}×{eg.grade.toFixed(2)})</span>
															</span>
															{index < includedCourses.length - 1 ? ' + ' : ''}
														</Fragment>
													)
												})}
											</span>
											<Separator className="bg-current block" />
											<span className="flex flex-col justify-center p-0.5">
												<span>
													{includedCourses.map((eg, index) => {
														return (
															<Fragment key={index}>
																<span className="tabular-nums font-mono">
																	{eg.units}
																</span>
																{index < includedCourses.length - 1 ? ' + ' : ''}
															</Fragment>
														)
													})}
												</span>
												{
													includedCourses.length > 1 && (
														<span className="text-xs opacity-80">
															(Sum of the units for all courses)
														</span>
													)
												}
											</span>
										</div></li>

										{
											includedCourses.length > 1 && (
												<li><div className="inline-block relative align-middle text-center">
													<span className="p-0.5">
														{includedCourses.map((eg, index) => {
															if (!eg.units || !eg.grade) return null;
															return (
																<Fragment key={index}>
																	<span className="tabular-nums font-mono">
																		{eg.units * Number(eg.grade.toFixed(2))}
																	</span>
																	{index < includedCourses.length - 1 ? ' + ' : ''}
																</Fragment>
															)
														})}
													</span>
													<Separator className="bg-current block" />
													<span className="p-0.5">
														{includedCourses.map((eg, index) => {
															return (
																<Fragment key={index}>
																	<span className="tabular-nums font-mono">
																		{eg?.units}
																	</span>
																	{index < includedCourses.length - 1 ? ' + ' : ''}
																</Fragment>
															)
														})}
													</span>
												</div></li>
											)
										}

										<li><div className="inline-block relative align-middle text-center">
											<span className="p-0.5 tabular-nums">
												{includedCourses.reduce((acc, eg) => {
													if (!eg.units || !eg.grade) return acc;
													return acc + (eg.units * Number(eg.grade.toFixed(2)));
												}, 0)}
											</span>
											<Separator className="bg-current block" />
											<span className="p-0.5 tabular-nums">
												{includedCourses.reduce((acc, eg) => {
													return acc + eg.units!;
												}, 0)}
											</span>
										</div></li>

										<li>
											{finalGwa !== null ? (
												<span>
													Final GWA = <span className="font-mono tabular-nums font-bold px-2 py-1 bg-background text-foreground rounded-lg">{finalGwa.toFixed(2)}</span>
												</span>
											) : null}
										</li>
									</ol>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				) : null
			}

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

			<h2 className="text-left text-3xl font-semibold tracking-tight w-full max-w-4xl mt-6">
				Information related to Academics in NEUST
			</h2>
			<ScrollSpy
				className="w-full max-w-4xl flex gap-6"
				offset={isMobile ? 120 : 80}
				orientation={isMobile ? 'vertical' : 'horizontal'}
			>
				<ScrollSpyNav className="sticky top-15 md:top-20 h-fit z-50 bg-card text-card-foreground p-2 rounded-lg border shadow *:data-[state=active]:text-accent-foreground overflow-x-auto *:max-md:whitespace-nowrap md:max-w-48 *:[&_svg]:size-4 *:[&_svg]:shrink-0 *:flex *:items-center *:justify-start *:gap-2">
					<ScrollSpyLink value="latin-honors"><GraduationCapIcon /> Latin Honors</ScrollSpyLink>
					<ScrollSpyLink value="academic-distinction"><ScrollTextIcon /> Academic Distinction Award</ScrollSpyLink>
					<ScrollSpyLink value="awards-comparison"><ScaleIcon /> Awards Comparison</ScrollSpyLink>
					<ScrollSpyLink value="retention"><ShieldIcon /> Retention</ScrollSpyLink>
					<ScrollSpyLink value="changing-of-grades"><PenLineIcon /> Changing of Grades</ScrollSpyLink>
				</ScrollSpyNav>

				<ScrollSpyViewport className="*:space-y-2">
					<Alert>
						<AlertCircleIcon />
						<AlertTitle>Disclaimer</AlertTitle>
						<AlertDescription className="md:text-wrap">
							The information provided in this section is based on the NEUST Student Handbook (2023 Edition) and my understanding of the grading policies at NEUST. While I strive to ensure accuracy, please note that policies may change over time. For the most current and official information, always refer to the latest version of the NEUST Student Handbook or consult with the university administration.
						</AlertDescription>
					</Alert>

					<ScrollSpySection value="latin-honors">
						<h3 className="text-2xl font-semibold tracking-tight">
							Latin Honors
						</h3>
						<p>
							According to the NEUST Student Handbook (2023 Edition), Latin Honors are awarded based on the following GWA criteria:
						</p>
						<Table>
							<TableCaption>
								Latin Honors Criteria from the NEUST Student Handbook (2023 Edition)
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>
										Honor
									</TableHead>
									<TableHead>
										GWA Range
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(() => {
									const latinHonors = [
										{ honor: 'Summa Cum Laude', gwaRange: '1.00 - 1.20' },
										{ honor: 'Magna Cum Laude', gwaRange: '1.21 - 1.45' },
										{ honor: 'Cum Laude', gwaRange: '1.46 - 1.75' },
									];

									return latinHonors.map((lh, index) => (
										<TableRow key={index}>
											<TableCell>{lh.honor}</TableCell>
											<TableCell>{lh.gwaRange}</TableCell>
										</TableRow>
									));
								})()}
							</TableBody>
						</Table>
						<p>
							Additionally, to be eligible for Latin Honors, a student must meet the following conditions:
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Must have completed at least 76% of the required academic units for their degree program in NEUST.</li>
							<li>Must have been enrolled in the university for a minimum of two (2) academic years.</li>
							<li>Must have taken not less than 15 units during each semester.</li>
							<li>Must not have any grades below 2.00 in any course.</li>
						</ul>
					</ScrollSpySection>

					<ScrollSpySection value="academic-distinction">
						<h3 className="text-2xl font-semibold tracking-tight">
							Academic Distinction Award
						</h3>
						<p>
							The Academic Distinction Award is given to students who achieve a GWA of 1.75 or better, provided they meet the following criteria as outlined in the NEUST Student Handbook (2023 Edition):
						</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Must have completed at least 75% of the required academic units for their degree program in NEUST.</li>
							<li>Must have taken not less than 15 units or the normal load prescribed in the curriculum during each semester.</li>
							<li>Must not have any grades that are failing (5.00), incomplete (INC), and dropped throughout their recidency.</li>
						</ul>
					</ScrollSpySection>

					<ScrollSpySection value="awards-comparison">
						<h3 className="text-2xl font-semibold tracking-tight">
							Awards Comparison
						</h3>
						<p>
							There are different sorts of academic awards in NEUST, each with its own criteria and significance, which are summarized below:
						</p>
						<Table>
							<TableCaption>
								Comparison of Academic Awards in NEUST
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>
										Award
									</TableHead>
									<TableHead>
										Criteria
									</TableHead>
									<TableHead>
										Significance
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr_td]:first:min-w-28 **:text-wrap">
								<TableRow>
									<TableCell>Latin Honors</TableCell>
									<TableCell>Based on GWA ranges (1.00-1.20, 1.21-1.45, 1.46-1.75) and other academic conditions.</TableCell>
									<TableCell>
										Recognizes outstanding academic achievement upon graduation, however is there must be <span className="font-semibold">no grades below 2.00 in any course</span>.
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Academic Distinction Award</TableCell>
									<TableCell>GWA of 1.75 or better with specific academic conditions met.</TableCell>
									<TableCell>
										Acknowledges high academic performance during a student&apos;s tenure, <span className="font-semibold">even if not graduating with Latin Honors</span>.
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Dean&apos;s Lister</TableCell>
									<TableCell>Typically requires a GWA of 1.75 or better for a specific semester. Depending on the Department.</TableCell>
									<TableCell>
										Recognizes students who excel academically in a particular semester, highlighting consistent performance. This is not an award given during graduation, but rather a semester-based recognition. Additionally, <span className="font-semibold">not all departments may have this award</span>.
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Link
											href="https://facebook.com/NEUSTHonorSociety"
											className="text-primary hover:text-primary/80! underline underline-offset-2"
											target="_blank"
											rel="noopener noreferrer"
										>
											NEUST Honor&apos;s Society
										</Link>
									</TableCell>
									<TableCell>
										Usually requires a GWA of 1.75 or better and also have no grades below 2.00 in any course. Other criteria may apply based on the organization&apos;s rules.
									</TableCell>
									<TableCell>
										This is a University Student Organization (USO). Students may <span className="font-semibold">apply for membership</span> at the start of each academic year if they meet the organization&apos;s criteria — you need at least one semester that meets the requirements to apply. Note that you do need to <span className="font-semibold">reapply each academic year</span> to maintain membership.
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</ScrollSpySection>

					<ScrollSpySection value="retention">
						<h3 className="text-2xl font-semibold tracking-tight">
							Retention
						</h3>
						<p>
							Retention refers to the university&apos;s policy on maintaining enrollment status based on academic performance. According to the NEUST Student Handbook (2023 Edition), a student shall be retained in the university as long as they have passed all their subjects.
						</p>
						<p>
							A student who fails in two (2) subjects in a semester shall still be retaubed, provided they <span className="font-semibold">re-enroll and pass the failed subjects</span> in the succeeding academic year.
						</p>
						<p>
							However, a student who fails in three (3) or more subjects equivalent to nine (9) or more units in a semester under a <span className="underline underline-offset-2">board program</span> shall be advised to <span className="font-semibold">transfer to a non-board program</span>. If the student fails under the same conditions in a <span className="underline underline-offset-2">non-board program</span>, they shall be advised to <span className="font-semibold">transfer to another school</span>.
						</p>
					</ScrollSpySection>

					<ScrollSpySection value="changing-of-grades">
						<h3 className="text-2xl font-semibold tracking-tight">
							Changing of Grades
						</h3>
						<p>
							According to the NEUST Student Handbook (2023 Edition), changes of grades caused by erroneous entry shall not prejudice the student but could be made in favor of the student. So basically, grades can <span className="font-semibold">only be increased but not decreased</span>.
						</p>
						<p>
							Once a faculty member has posted a final grade to the School Portal, the faculty member may request authorization from the Dean of the academic unit concerned, and approved by the Vice President of Academic Affairs (VPAA), to change the final grade of a student. However, usually, such a request must be made <span className="font-semibold">within thirty (30) days</span> from the time the grade was given.
						</p>
					</ScrollSpySection>
				</ScrollSpyViewport>
			</ScrollSpy>
			<footer className="italic text-xs text-center text-muted-foreground max-w-lg md:max-w-3xl">
				Developed by <span className="font-mono">alecz.r</span>.
			</footer>
		</main>
	)
}

function ProgramInput({
	selectedProgram,
	setSelectedProgram,
	className,
	includedCourses,
}: {
	selectedProgram: string | null;
	setSelectedProgram: (program: string | null) => void;
	className?: string | undefined;
	includedCourses?: Course[];
}) {
	const [open, setOpen] = useState(false);
	const isMobile = useIsMobile();

	return (
		<div className={cn("grid gap-1", className)}>
			<Label>Program</Label>
			{
				isMobile ? (
					<Drawer open={open} onOpenChange={setOpen}>
						<DrawerTrigger asChild>
							<Button
								variant="outline"
								className={cn("justify-between overflow-hidden", !selectedProgram && "text-muted-foreground!")}
							>
								<span className="truncate">
									{(() => {
										const program = programsData.find(p => p.code === selectedProgram);
										return program ?
											<>{program.code} – {program.name}</> :
											"Select Program";
									})()}
								</span>
								<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>
									Select Program
								</DrawerTitle>
								<DrawerDescription>
									Choose your academic program from the list below.
								</DrawerDescription>
							</DrawerHeader>
							<div className="border-t">
								<ProgramList
									setOpen={setOpen}
									selectedProgram={selectedProgram}
									setSelectedProgram={setSelectedProgram}
									includedCourses={includedCourses}
								/>
							</div>
						</DrawerContent>
					</Drawer>
				) : (
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn("justify-between overflow-hidden", !selectedProgram && "text-muted-foreground!")}
							>
								<span className="truncate">
									{(() => {
										const program = programsData.find(p => p.code === selectedProgram);
										return program ?
											<>{program.code} – {program.name}</> :
											"Select Program";
									})()}
								</span>
								<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
							<ProgramList
								setOpen={setOpen}
								selectedProgram={selectedProgram}
								setSelectedProgram={setSelectedProgram}
								includedCourses={includedCourses}
							/>
						</PopoverContent>
					</Popover>
				)
			}
		</div>
	)
}

function ProgramList({
	setOpen,
	selectedProgram,
	setSelectedProgram,
	includedCourses
}: {
	setOpen: (open: boolean) => void
	selectedProgram: string | null
	setSelectedProgram: (program: string | null) => void
	includedCourses?: Course[]
}) {
	return (
		<Command className="rounded-none! md:rounded-xl!">
			<CommandInput placeholder="Filter programs..." />
			<CommandList className="max-md:max-h-[50dvh]">
				<CommandEmpty>
					<Empty className="p-0">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<SearchXIcon />
							</EmptyMedia>
							<EmptyTitle>Program not listed</EmptyTitle>
							<EmptyDescription>If your program isn&apos;t listed, please email your COR or program&apos;s Course Prospectus so that it could be added.</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button asChild>
								<Link
									href="mailto:gwabuddy@aleczr.link?subject=GWA%20Buddy%20Suggestions"
									className="text-primary hover:text-primary/80!"
								>
									Send Email
								</Link>
							</Button>
						</EmptyContent>
					</Empty>
				</CommandEmpty>
				<CommandGroup>
					{programsData.map((program) => (
						<CommandItem
							key={program.code}
							value={program.code + ' - ' + program.name}
							onSelect={async () => {
								if (selectedProgram === program.code) return;
								if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
									const ok = await confirm({
										title: 'Change Program',
										message: 'Changing your program will reset all existing grades in your included courses. Do you want to continue?',
										buttonMessage: 'Yes, Change Program',
										buttonVariant: 'destructive'
									});
									if (!ok) return;
								}
								setSelectedProgram(program.code)
								setOpen(false)
							}}
							data-checked={selectedProgram === program.code}
						>
							<span><span className="font-semibold">{program.code}</span> – {program.name}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	)
}

function CurriculumInput({
	selectedProgram,
	selectedCurriculum,
	setSelectedCurriculum,
	className,
	includedCourses,
}: {
	selectedProgram: string | null;
	selectedCurriculum: string | null;
	setSelectedCurriculum: (curriculum: string | null) => void;
	className?: string | undefined;
	includedCourses?: Course[];
}) {
	const [open, setOpen] = useState(false);
	const isMobile = useIsMobile();

	return (
		<div className={cn("grid gap-1", className)}>
			<Label>Curriculum</Label>
			{
				isMobile ? (
					<Drawer open={open} onOpenChange={setOpen}>
						<DrawerTrigger asChild>
							<Button
								disabled={!selectedProgram}
								variant="outline"
								className={cn("justify-between overflow-hidden", !selectedCurriculum && "text-muted-foreground!")}
							>
								<span className="truncate">
									{(() => {
										if (!selectedProgram) return "Select a Program first";
										const curriculum = programsData.find(p => p.code === selectedProgram)?.curriculums.find(c => c.internalName === selectedCurriculum);
										return curriculum ?
											curriculum.name :
											"Select Curriculum";
									})()}
								</span>
								<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>
									Select Curriculum
								</DrawerTitle>
								<DrawerDescription>
									Choose your curriculum from the list below.
								</DrawerDescription>
							</DrawerHeader>
							<div className="border-t">
								<CurriculumList
									setOpen={setOpen}
									selectedProgram={selectedProgram}
									selectedCurriculum={selectedCurriculum}
									setSelectedCurriculum={setSelectedCurriculum}
									includedCourses={includedCourses}
								/>
							</div>
						</DrawerContent>
					</Drawer>
				) : (
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								disabled={!selectedProgram}
								variant="outline"
								className={cn("justify-between overflow-hidden", !selectedCurriculum && "text-muted-foreground!")}
							>
								<span className="truncate">
									{(() => {
										if (!selectedProgram) return "Select a Program first";
										const curriculum = programsData.find(p => p.code === selectedProgram)?.curriculums.find(c => c.internalName === selectedCurriculum);
										return curriculum ?
											curriculum.name :
											"Select Curriculum";
									})()}
								</span>
								<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0">
							<CurriculumList
								setOpen={setOpen}
								selectedProgram={selectedProgram}
								selectedCurriculum={selectedCurriculum}
								setSelectedCurriculum={setSelectedCurriculum}
								includedCourses={includedCourses}
							/>
						</PopoverContent>
					</Popover>
				)
			}
		</div>
	)
}

function CurriculumList({
	setOpen,
	selectedProgram,
	selectedCurriculum,
	setSelectedCurriculum,
	includedCourses
}: {
	setOpen: (open: boolean) => void
	selectedProgram: string | null
	selectedCurriculum: string | null
	setSelectedCurriculum: (curriculum: string | null) => void
	includedCourses?: Course[]
}) {
	const program = programsData.find(p => p.code === selectedProgram);
	if (!program) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ClipboardXIcon />
					</EmptyMedia>
					<EmptyTitle>Program not selected</EmptyTitle>
					<EmptyDescription>Select a program first before selecting a curriculum.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		)
	}

	return (
		<Command className="rounded-none! md:rounded-xl!">
			<CommandInput placeholder="Filter curriculums..." />
			<CommandList className="max-md:max-h-[50dvh]">
				<CommandEmpty>
					There are no curriculums matching your search.
				</CommandEmpty>
				<CommandGroup>
					{program.curriculums.map((curriculum) => (
						<CommandItem
							key={curriculum.internalName}
							value={curriculum.name}
							onSelect={async () => {
								if (selectedCurriculum === curriculum.internalName) return;
								if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
									const ok = await confirm({
										title: 'Change Curriculum',
										message: 'Changing your curriculum will reset all existing grades in your included courses. Do you want to continue?',
										buttonMessage: 'Yes, Change Curriculum',
										buttonVariant: 'destructive'
									});
									if (!ok) return;
								}
								setSelectedCurriculum(curriculum.internalName)
								setOpen(false)
							}}
							data-checked={selectedCurriculum === curriculum.internalName}
						>
							{curriculum.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	)
}

function semesterOrdinal(n: number) {
	const map: Record<number, string> = {
		1: 'First',
		2: 'Second',
		3: 'Third',
		4: 'Fourth',
		5: 'Fifth',
		6: 'Sixth',
		7: 'Seventh',
		8: 'Eighth',
		9: 'Ninth',
		10: 'Tenth'
	};
	return map[n] ?? `${n}th`;
}


function PresetInput({
	selectedProgram,
	selectedCurriculum,
	selectedMajor,
	selectedYear,
	selectedSemester,
	filterCore,
	setFilters,
	curriculumData,
	setCurriculumData,
	className,
	includedCourses,
	lastIncludedSnapshot,
	onApplyPreset,
}: {
	selectedProgram: string | null;
	selectedCurriculum: string | null;
	selectedMajor: string | null;
	selectedYear: number | null;
	selectedSemester: number | null;
	filterCore: boolean;
	setFilters: SetValues<{
		program: SingleParserBuilder<string>;
		curriculum: SingleParserBuilder<string>;
		major: SingleParserBuilder<string>;
		year: SingleParserBuilder<number>;
		semester: SingleParserBuilder<number>;
		core: Omit<SingleParserBuilder<boolean>, "parseServerSide"> & {
			readonly defaultValue: boolean;
			parseServerSide(value: string | string[] | undefined): boolean;
		};
	}>;
	curriculumData: Curriculum | null;
	setCurriculumData: Dispatch<SetStateAction<Curriculum | null>>;
	className?: string | undefined;
	includedCourses?: Course[];
	lastIncludedSnapshot: string[] | null;
	onApplyPreset: (courses: Course[], snapshot: string[]) => void;
}) {
	const [open, setOpen] = useState(false);
	const isMobile = useIsMobile();
	const [presets, setPresets] = useState<Array<{ year: number; semester: number; major?: string; core?: boolean }>>([]);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			if (!selectedProgram || !selectedCurriculum) {
				setCurriculumData(null);
				setPresets([]);
				return;
			}
			const program = programsData.find((p) => p.code === selectedProgram);
			if (!program) {
				setCurriculumData(null);
				setPresets([]);
				return;
			}
			const dir = program.internalName;
			try {
				const mod = await import(`@/data/curriculums/${dir}/${selectedCurriculum}`);
				const data = (mod.default ?? mod) as Curriculum<(typeof mod)['majors']>;
				if (cancelled) return;
				setCurriculumData(data);

				const map = new Map<string, { year: number; semester: number; major?: string; core?: boolean }>();
				data.term.forEach((t) => {
					const y = t.year ?? 1;
					const s = t.semester ?? 1;
					const majorsFound = new Set<string>();
					let hasMajorCodes = false;
					let hasCoreOnly = false;
					(t.courses ?? []).forEach((c) => {
						if (c.majorCode) {
							hasMajorCodes = true;
							majorsFound.add(c.majorCode);
						}
						if (c.coreOnly) {
							hasCoreOnly = true;
						}
					});

					if (hasMajorCodes || hasCoreOnly) {
						// only show specific majors (and core-only option if present)
						majorsFound.forEach((m) => {
							const key = `${y}|${s}|${m}`;
							map.set(key, { year: y, semester: s, major: m });
						});
						if (hasCoreOnly) {
							const key = `${y}|${s}|CORE`;
							map.set(key, { year: y, semester: s, core: true });
						}
					} else {
						// no major/core-only tagging: include an ALL option
						const key = `${y}|${s}|ALL`;
						map.set(key, { year: y, semester: s, major: undefined });
					}
				});
				setPresets(Array.from(map.values()));
			} catch {
				if (!cancelled) {
					setCurriculumData(null);
					setPresets([]);
				}
				toast.error("Failed to load curriculum data. Try again later.");
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [selectedProgram, selectedCurriculum, setCurriculumData]);

	function unitsForPreset(p: { year: number; semester: number; major?: string; core?: boolean }) {
		if (!curriculumData) return 0;
		const term = (curriculumData.term ?? []).find((t) => t.year === p.year && t.semester === p.semester);
		if (!term) return 0;
		let courses = (term.courses ?? []);
		if (p.core) courses = courses.filter((c) => c.coreOnly || c.majorCode === undefined);
		else if (p.major) courses = courses.filter((c) => (c.majorCode === p.major || c.majorCode === undefined) && !c.coreOnly);
		return courses.reduce((sum, c) => sum + (c.units || 0), 0);
	}

	function equalCodeArrays(a: string[] | null, b: string[]) {
		if (!a) return false;
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
		return true;
	}

	const renderList = (
		<Command className="rounded-none! md:rounded-xl!">
			<CommandList className="max-md:max-h-[50dvh]">
				<CommandEmpty>No presets available.</CommandEmpty>
				{(() => {
					if (!curriculumData) return null;

					const allTerms = curriculumData.term ?? [];

					// helper to create snapshot for a set of courses
					const snapshotFor = (courses?: Array<{ code?: string }>) => {
						return (courses ?? []).map(c => c.code).filter((s): s is string => typeof s === 'string').sort();
					};

					// Build program-level presets
					const programMajors = new Set<string>();
					let programHasCore = false;
					for (const t of allTerms) {
						for (const c of (t.courses ?? [])) {
							if (c.majorCode) programMajors.add(c.majorCode);
							if (c.coreOnly) programHasCore = true;
						}
					}

					const programPresets: Array<{ label: string; major?: string; core?: boolean }> = [];
					if (programMajors.size === 0 && !programHasCore) {
						programPresets.push({ label: 'Entire Program' });
					} else {
						for (const m of Array.from(programMajors).sort()) {
							const majorObj = curriculumData.majors?.find((mm) => mm.code === m);
							const label = majorObj ? `All ${majorObj.name} (${majorObj.code}) Courses` : m;
							programPresets.push({ label, major: m });
						}
						if (programHasCore) programPresets.push({ label: 'Core Only', core: true });
					}

					// Build year-level presets grouped per year
					const termsByYear = new Map<number, typeof allTerms>();
					for (const t of allTerms) {
						const arr = termsByYear.get(t.year ?? 1) ?? [];
						arr.push(t);
						termsByYear.set(t.year ?? 1, arr);
					}

					const yearEntries = Array.from(termsByYear.entries()).sort((a, b) => a[0] - b[0]);

					return (
						<>
							{/* Program-level group */}
							<CommandGroup heading="Program Presets">
								{programPresets.map((pp) => {
									// collect all courses across program matching this preset
									const collected: typeof includedCourses = [];
									for (const t of allTerms) {
										for (const c of (t.courses ?? [])) {
											if (pp.core) {
												if (c.coreOnly || c.majorCode === undefined) collected.push(c);
											} else if (pp.major) {
												if ((c.majorCode === pp.major || c.majorCode === undefined) && !c.coreOnly) collected.push(c);
											} else {
												collected.push(c);
											}
										}
									}
									const snap = snapshotFor(collected);
									return (
										<CommandItem
											key={`program-${pp.label}`}
											value={`program-${pp.label}`}
											onSelect={async () => {
												if (lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)) return;
												if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
													const ok = await confirm({
														title: 'Apply Preset',
														message: 'Applying a preset will reset all existing grades in your included courses. Do you want to continue?',
														buttonMessage: 'Yes, Apply Preset',
														buttonVariant: 'destructive'
													});
													if (!ok) return;
												}
												onApplyPreset(collected, snap);
												setOpen(false);
												setFilters({ year: null, semester: null, major: pp.major ?? null, core: pp.core ?? false });
											}}
											data-checked={lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)}
										>
											<div className="flex justify-between items-center w-full gap-2">
												<span>{pp.core ? 'Core Only' : (pp.major ? pp.label : 'Entire Program')}</span>
												<Badge>{Number(collected.reduce((s, c) => s + (c.units || 0), 0)).toLocaleString()} Units</Badge>
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>

							<CommandSeparator />

							{/* Year-level groups */}
							<CommandGroup
								heading="Year Presets"
							>
								{yearEntries.map(([year, terms]) => {
									// determine majors/core in this year
									const majorsInYear = new Set<string>();
									let hasCoreInYear = false;
									for (const t of terms) for (const c of (t.courses ?? [])) {
										if (c.majorCode) majorsInYear.add(c.majorCode);
										if (c.coreOnly) hasCoreInYear = true;
									}

									const groups: Array<{ key: string; label: string; courses: typeof includedCourses }> = [];
									if (majorsInYear.size === 0 && !hasCoreInYear) {
										// one ALL group containing every course in the year
										const collected = [];
										for (const t of terms) for (const c of (t.courses ?? [])) collected.push(c);
										groups.push({ key: 'ALL', label: 'All', courses: collected });
									} else {
										for (const m of Array.from(majorsInYear).sort()) {
											const collected = [];
											for (const t of terms) for (const c of (t.courses ?? [])) if ((c.majorCode === m || c.majorCode === undefined) && !c.coreOnly) collected.push(c);
											const majorObj = curriculumData?.majors?.find((mm) => mm.code === m);
											const label = majorObj ? `${m} – ${majorObj.name}` : m;
											groups.push({ key: m, label, courses: collected });
										}
										if (hasCoreInYear) {
											const collected = [];
											for (const t of terms) for (const c of (t.courses ?? [])) if (c.coreOnly || c.majorCode === undefined) collected.push(c);
											groups.push({ key: 'CORE', label: 'Core Only', courses: collected });
										}
									}

									// If the year's only group is the ALL group, render a single CommandItem labeled "Year N"
									if (groups.length === 1 && groups[0].key === 'ALL') {
										const g = groups[0];
										const courses = g.courses ?? [];
										const snap = snapshotFor(courses);
										const units = Number(courses.reduce((s, c) => s + (c.units || 0), 0));
										return (
											<Fragment key={`year-${year}`}>
												<CommandItem
													key={`year-${year}-ALL`}
													value={`year-${year}-ALL`}
													onSelect={async () => {
														if (lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)) return;
														if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
															const ok = await confirm({
																title: 'Apply Preset',
																message: 'Applying a preset will reset all existing grades in your included courses. Do you want to continue?',
																buttonMessage: 'Yes, Apply Preset',
																buttonVariant: 'destructive'
															});
															if (!ok) return;
														}
														onApplyPreset(courses, snap);
														setFilters({ year: year, semester: null, major: null, core: false });
														setOpen(false);
													}}
													data-checked={lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)}
												>
													<div className="flex justify-between items-center w-full">
														<span>{`Year ${year}`}</span>
														<Badge>{units.toLocaleString()} Units</Badge>
													</div>
												</CommandItem>
											</Fragment>
										);
									}

									return (
										<Fragment key={`year-${year}`}>
											<CommandGroup heading={`Year ${year}`} className="[&_[cmdk-group-items]_[cmdk-group-heading]]:pt-0 py-0">
												{groups.map((g) => {
													const courses = g.courses ?? [];
													const snap = snapshotFor(courses);
													return (
														<CommandItem
															key={`year-${year}-${g.key}`}
															value={`year-${year}-${g.key}`}
															onSelect={async () => {
																if (lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)) return;
																if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
																	const ok = await confirm({
																		title: 'Apply Preset',
																		message: 'Applying a preset will reset all existing grades in your included courses. Do you want to continue?',
																		buttonMessage: 'Yes, Apply Preset',
																		buttonVariant: 'destructive'
																	});
																	if (!ok) return;
																}

																onApplyPreset(courses, snap);
																setFilters({ year: year, semester: null, major: g.key !== 'CORE' ? g.key : null, core: g.key === 'CORE' });
																setOpen(false);
															}}
															data-checked={lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)}
														>
															<div className="flex justify-between items-center w-full">
																<span>{g.label === 'All' ? `${semesterOrdinal(1)}+` : g.label}</span>
																<Badge>{Number(courses.reduce((s, c) => s + (c.units || 0), 0)).toLocaleString()} Units</Badge>
															</div>
														</CommandItem>
													);
												})}
											</CommandGroup>
										</Fragment>
									);
								})}
							</CommandGroup>

							<CommandSeparator />

							{/* Existing semester-level presets (presets) — render unchanged but use snapshot-based checked state */}
							<CommandGroup heading="Semester Presets">
								{(() => {
									const byYear = new Map<number, typeof presets>();
									for (const p of presets) {
										const arr = byYear.get(p.year) ?? [];
										arr.push(p);
										byYear.set(p.year, arr);
									}

									return Array.from(byYear.entries()).sort((a, b) => a[0] - b[0]).map(([year, items], index) => {
										// group by major key within the year
										const byMajor = new Map<string, typeof items>();
										for (const p of items) {
											const key = p.core ? '__CORE__' : (p.major ?? 'ALL');
											const arr = byMajor.get(key) ?? [];
											arr.push(p);
											byMajor.set(key, arr);
										}

										return (
											<Fragment key={`sem-year-${year}`}>
												<CommandGroup
													heading={`Year ${year}`}
													className="[&_[cmdk-group-items]_[cmdk-group-heading]]:pt-0 py-0"
												>
													{Array.from(byMajor.entries()).map(([majorKey, groupItems]) => {
														const first = groupItems[0];

														if (majorKey === 'ALL') {
															return groupItems.map((p) => {
																const units = unitsForPreset(p);
																const newIncluded = (curriculumData?.term.find(t => t.year === p.year && t.semester === p.semester)?.courses.filter(c => {
																	if (p.core) return c.coreOnly || c.majorCode === undefined;
																	else if (p.major) return (c.majorCode === p.major || c.majorCode === undefined) && !c.coreOnly;
																	else return true;
																}) ?? []);
																const snap = snapshotFor(newIncluded);
																return (
																	<CommandItem
																		key={`${p.year}-${p.semester}-${p.major ?? 'ALL'}-${p.core ? 'CORE' : 'NOCORE'}`}
																		value={`${p.year}-${p.semester}-${p.major ?? 'ALL'}-${p.core ? 'CORE' : 'NOCORE'}`}
																		onSelect={async () => {
																			if (lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)) return;
																			if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
																				const ok = await confirm({
																					title: 'Apply Preset',
																					message: 'Applying a preset will reset all existing grades in your included courses. Do you want to continue?',
																					buttonMessage: 'Yes, Apply Preset',
																					buttonVariant: 'destructive'
																				});
																				if (!ok) return;
																			}

																			setFilters({ year: p.year, semester: p.semester, major: p.major ?? null, core: p.core ?? false });
																			onApplyPreset(newIncluded, snap);
																			setOpen(false);
																		}}
																		data-checked={lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)}
																	>
																		<div className="flex justify-between items-center w-full">
																			<span>{semesterOrdinal(p.semester)} Semester</span>
																			<Badge>{Number(units).toLocaleString()} Units</Badge>
																		</div>
																	</CommandItem>
																);
															});
														}

														// Otherwise render a subgroup with a major heading
														let majorLabel = 'Core Program';
														if (!first.core) {
															if (first.major && curriculumData?.majors) {
																const m = curriculumData.majors.find((mm) => mm.code === first.major);
																majorLabel = (m?.name && m?.code) ? `${m.code} – ${m.name}` : first.major;
															} else if (first.major) {
																majorLabel = first.major;
															} else {
																majorLabel = 'Core Program';
															}
														}

														return (
															<CommandGroup key={`${year}-${majorKey}`} heading={majorLabel} className="pr-0">
																{groupItems.map((p) => {
																	const units = unitsForPreset(p);
																	const newIncluded = (curriculumData?.term.find(t => t.year === p.year && t.semester === p.semester)?.courses.filter(c => {
																		if (p.core) return c.coreOnly || c.majorCode === undefined;
																		else if (p.major) return (c.majorCode === p.major || c.majorCode === undefined) && !c.coreOnly;
																		else return true;
																	}) ?? []);
																	const snap = snapshotFor(newIncluded);
																	return (
																		<CommandItem
																			key={`${p.year}-${p.semester}-${p.major ?? 'ALL'}`}
																			value={`${p.year}-${p.semester}-${p.major ?? 'ALL'}`}
																			onSelect={async () => {
																				if (lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)) return;
																				if (includedCourses?.some(c => c.grade !== null && c.grade !== undefined)) {
																					const ok = await confirm({
																						title: 'Apply Preset',
																						message: 'Applying a preset will reset all existing grades in your included courses. Do you want to continue?',
																						buttonMessage: 'Yes, Apply Preset',
																						buttonVariant: 'destructive'
																					});
																					if (!ok) return;
																				}

																				setFilters({ year: p.year, semester: p.semester, major: p.major ?? null, core: p.core ?? false });
																				onApplyPreset(newIncluded, snap);
																				setOpen(false);
																			}}
																			data-checked={lastIncludedSnapshot !== null && equalCodeArrays(lastIncludedSnapshot, snap)}
																		>
																			<div className="flex justify-between items-center w-full">
																				<span>{semesterOrdinal(p.semester)} Semester</span>
																				<Badge>{Number(units).toLocaleString()} Units</Badge>
																			</div>
																		</CommandItem>
																	);
																})}
															</CommandGroup>
														);
													})}
												</CommandGroup>
												{index < byYear.size - 1 ? <CommandSeparator /> : null}
											</Fragment>
										);
									});
								})()}
							</CommandGroup>
						</>
					);
				})()}
			</CommandList>
		</Command>
	);

	const buttonLabel = () => {
		if (!selectedProgram) return "Select a Program first";
		if (!selectedCurriculum) return "Select a Curriculum";
		if (selectedYear && selectedSemester) {
			const includedCodes = (includedCourses ?? []).map((c) => c.code).filter((s): s is string => typeof s === 'string').sort();
			const isCustom = lastIncludedSnapshot !== null && !equalCodeArrays(lastIncludedSnapshot, includedCodes);
			if (isCustom) return "Custom Preset";
			const majorObj = selectedMajor ? curriculumData?.majors?.find(m => m.code === selectedMajor) : null;
			const majorLabel = filterCore ? ' – Core Only' : (majorObj ? ` – ${majorObj.name} (${majorObj.code})` : (selectedMajor ? ` – ${selectedMajor}` : ""));
			return `Year ${selectedYear}, ${semesterOrdinal(selectedSemester)} Semester${majorLabel}`;
		}
		if (selectedYear) {
			const majorObj = selectedMajor ? curriculumData?.majors?.find(m => m.code === selectedMajor) : null;
			const majorLabel = filterCore ? ' – Core Only' : (majorObj ? ` – ${majorObj.name} (${majorObj.code})` : (selectedMajor ? ` – ${selectedMajor}` : ""));
			return `Year ${selectedYear}${majorLabel}`;
		}
		if (selectedMajor || filterCore) {
			if (filterCore) return 'Entire Program – Core Only';
			return `Entire Program – ${selectedMajor}`;
		}
		return "Select Preset";
	}

	return (
		<div className={cn("grid gap-1", className)}>
			<Label>Preset</Label>
			{isMobile ? (
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button
							disabled={!selectedProgram || !selectedCurriculum}
							variant="outline"
							className={cn(
								"justify-between overflow-hidden",
								(
									!selectedCurriculum ||
									(selectedYear === null && selectedSemester === null && !selectedMajor && !filterCore)
								) &&
								"text-muted-foreground!"
							)}
						>
							<span className="truncate">
								{buttonLabel()}
							</span>
							<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Select Preset</DrawerTitle>
							<DrawerDescription>Choose a preset (program / major / year / semester)</DrawerDescription>
						</DrawerHeader>
						<div className="border-t">{renderList}</div>
					</DrawerContent>
				</Drawer>
			) : (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							disabled={!selectedProgram || !selectedCurriculum}
							variant="outline"
							className={cn(
								"justify-between overflow-hidden",
								(
									!selectedCurriculum ||
									(selectedYear === null && selectedSemester === null && !selectedMajor && !filterCore)
								) &&
								"text-muted-foreground!"
							)}
						>
							<span className="truncate">
								{buttonLabel()}
							</span>
							<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="min-w-(--radix-popover-trigger-width) w-full p-0"
						collisionPadding={15}
					>
						{renderList}
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}

function CourseRow({
	curriculumData,
	includedCourses,
	setIncludedCourses,
	selectedCourseIndex,
	setSelectedCourseIndex,
	index,
	isMobile,
	sharedCourseList,
}: {
	curriculumData: Curriculum | null;
	includedCourses: Course[];
	setIncludedCourses: Dispatch<SetStateAction<Course[]>>;
	selectedCourseIndex: number | null;
	setSelectedCourseIndex: Dispatch<SetStateAction<number | null>>;
	index: number;
	isMobile?: boolean;
	sharedCourseList: ReactNode;
}) {
	return (
		<div className="rounded-md shadow border p-4 grid grid-cols-[1fr_1fr_1fr_auto] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-end w-full bg-card text-card-foreground">
			<CourseRowCourseSelector
				curriculumData={curriculumData}
				includedCourses={includedCourses}
				selectedCourseIndex={selectedCourseIndex}
				setSelectedCourseIndex={setSelectedCourseIndex}
				index={index}
				isMobile={isMobile}
				sharedCourseList={sharedCourseList}
				className="col-span-4 md:col-span-3"
			/>
			<div
				className="grid gap-1 col-span-1"
			>
				<Label>Units</Label>
				<Input
					type="text"
					readOnly
					value={includedCourses[index].units ?? ''}
					tabIndex={-1}
					disabled={!includedCourses[index].units}
					className="pointer-events-none text-sm disabled:dark:bg-input/30"
				/>
			</div>
			<CourseRowGradeSelector
				index={index}
				includedCourses={includedCourses}
				setIncludedCourses={setIncludedCourses}
				className="col-span-2 md:col-span-1"
			/>
			<Tooltip>
				<TooltipTrigger
					asChild
				>
					<Button
						size='icon'
						variant='destructive'
						className="col-span-1"
						onClick={() => {
							setIncludedCourses((prev) => {
								const newCourses = [...prev];
								newCourses.splice(index, 1);
								return newCourses;
							});
						}}
					>
						<MinusIcon />
					</Button>
				</TooltipTrigger>
				<TooltipContent
					collisionPadding={15}
				>
					Remove Course Row
				</TooltipContent>
			</Tooltip>
		</div>
	)
}

function CourseRowCourseSelector({
	curriculumData,
	includedCourses,
	selectedCourseIndex,
	setSelectedCourseIndex,
	className,
	index,
	isMobile,
	sharedCourseList,
}: {
	curriculumData: Curriculum | null;
	includedCourses: Course[];
	selectedCourseIndex: number | null;
	setSelectedCourseIndex: Dispatch<SetStateAction<number | null>>;
	className?: string | undefined;
	index: number;
	isMobile?: boolean;
	sharedCourseList?: ReactNode;
}) {
	return (
		<div className={cn("grid gap-1", className)}>
			<Label>
				Course {(index + 1).toLocaleString()}
			</Label>
			{isMobile ? (
				<Button
					disabled={!curriculumData}
					variant="outline"
					className={cn("justify-between overflow-hidden", !includedCourses[index].name && "text-muted-foreground!")}
					onClick={() => setSelectedCourseIndex(selectedCourseIndex === index ? null : index)}
				>
					<span className="truncate">
						{(() => {
							const currentCourse = includedCourses[index];
							if (currentCourse.code && currentCourse.name) return `${currentCourse.code} – ${currentCourse.name}`;
						})()}
					</span>
					<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
				</Button>
			) : (
				<Popover
					open={selectedCourseIndex === index}
					onOpenChange={() => setSelectedCourseIndex(selectedCourseIndex === index ? null : index)}
				>
					<PopoverTrigger asChild>
						<Button
							disabled={!curriculumData}
							variant="outline"
							className={cn("justify-between overflow-hidden", !includedCourses[index].name && "text-muted-foreground!")}
						>
							<span className="truncate">
								{(() => {
									const currentCourse = includedCourses[index];
									if (currentCourse.code && currentCourse.name) return `${currentCourse.code} – ${currentCourse.name}`;
								})()}
							</span>
							<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-(--radix-popover-trigger-width) p-0">
						{sharedCourseList}
					</PopoverContent>
				</Popover>
			)}
		</div>
	)
}

function CourseRowGradeSelector({
	index,
	includedCourses,
	setIncludedCourses,
	className,
}: {
	index: number;
	includedCourses: Course[];
	setIncludedCourses: Dispatch<SetStateAction<Course[]>>;
	className?: string | undefined;
}) {
	return (
		<div className={cn("grid gap-1", className)}>
			<Label>
				Grade
			</Label>
			<Select
				disabled={includedCourses[index].units === undefined}
				value={includedCourses[index].grade ? includedCourses[index].grade!.toString() : ''}
				onValueChange={(value) => {
					const grade = value ? parseFloat(value) : null;
					setIncludedCourses((prev) => {
						const newCourses = [...prev];
						newCourses[index] = {
							...newCourses[index],
							grade: grade,
						};
						return newCourses;
					});
				}}
			>
				<SelectTrigger
					className="justify-between border-input! h-8! [&_svg]:text-muted-foreground! items-center w-full rounded-lg px-2.5"
				>
					<SelectValue
						className="truncate"
					/>
				</SelectTrigger>
				<SelectContent
					position="popper"
				>
					<SelectGroup>
						{
							[1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 5].map((grade) => (
								<SelectItem key={grade} value={grade.toString()}>
									{grade.toFixed(2)}
								</SelectItem>
							))
						}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}