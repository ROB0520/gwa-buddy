'use client'

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Check, ChevronsUpDown, Sparkles, Trash2, TrendingDown, TrendingUp, TrendingUpDown, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import data from '@/app/data.json'
import { Data, Course, Program } from "@/lib/types";
import { Input } from "@/components/ui/input";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "./ui/badge";

interface EnteredGrades {
	code: string;
	grade: number | undefined;
	major?: string | string[] | undefined;
}

function useWindowWidth() {
	const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
	useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	return width;
}

export default function GwaCalculator() {
	const { courses } = data as Data;
	const addSubjectButton = useRef<HTMLButtonElement | null>(null);
	const [selectedProgram, setSelectedProgram] = useState<keyof typeof data.programs | undefined>(undefined);
	const [enteredGrades, setEnteredGrades] = useState<EnteredGrades[]>([{ code: '', grade: undefined }]);
	const [gwa, setGwa] = useState<number | null>(null);
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setGwa(null);
	}, [enteredGrades, selectedProgram])
	useEffect(() => {
		setEnteredGrades([{ code: '', grade: undefined }]);
	}, [selectedProgram])
	useEffect(() => { setHasMounted(true); }, []);
	const windowWidth = useWindowWidth();
	if (!hasMounted) return null;
	const isMobile = windowWidth < 768;

	const calculateGwa = () => {
		if (selectedProgram) {
			const programCourses = courses[selectedProgram] || [];
			const totalUnits = enteredGrades.reduce((acc, course) => {
				const foundCourse = programCourses.find(c => c.code === course.code);
				return acc + (foundCourse?.units || 0);
			}, 0);
			const totalPoints = enteredGrades.reduce((acc, enteredGrade) => {
				const course = programCourses.find(course => course.code === enteredGrade.code);
				if (course && enteredGrade.grade !== undefined) {
					return acc + (course.units * enteredGrade.grade);
				}
				return acc;
			}, 0);

			if (totalUnits > 0) {
				setGwa(totalPoints / totalUnits);
			} else {
				setGwa(null);
			}
		}
	}

	return (
		<Card className="w-full max-w-3xl">
			<CardHeader>
				<CardTitle>Enter your courses and grades</CardTitle>
				<CardDescription>Calculate your General Weighted Average (GWA)</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 md:gap-6">
					<ProgramSelect selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
					<PresetSelect selectedProgram={selectedProgram} setEnteredGrades={setEnteredGrades} />

					<div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-x-1 gap-y-4 w-full">
						{selectedProgram ? (
							<>
								{
									enteredGrades.map((enteredGrade, index) => {
										return (
											<SubjectRow
												key={'eg-' + index}
												isMobile={isMobile}
												selectedProgram={selectedProgram}
												enteredGrade={enteredGrade}
												index={index}
												enteredGrades={enteredGrades}
												setEnteredGrades={setEnteredGrades}
											/>
										)
									})
								}
							</>
						) : null}
					</div>
					{
						gwa !== null && selectedProgram && (
							<Card className={cn(
								"w-full gap-2 shadow-none",
								gwa >= 4 && 'bg-red-500 dark:bg-red-700 text-white',
								gwa >= 3 && gwa < 4 && 'bg-orange-500 dark:bg-orange-700 text-white',
								gwa >= 2 && gwa < 3 && 'bg-yellow-500 dark:bg-yellow-700 text-white',
								gwa > 1.5 && gwa < 2 && 'bg-lime-500 dark:bg-lime-700 text-white',
								gwa <= 1.5 && 'bg-green-500 dark:bg-green-700 text-white',
							)}>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										Your GWA{' '}
										{gwa >= 4 && <TriangleAlert />}
										{gwa >= 3 && gwa < 4 && <TrendingDown />}
										{gwa >= 2 && gwa < 3 && <TrendingUpDown />}
										{gwa > 1.5 && gwa < 2 && <TrendingUp />}
										{gwa <= 1.5 && <Sparkles />}
									</CardTitle>
									<CardDescription className="text-inherit opacity-85">
										{gwa >= 4 && 'You are failing. You must study harder!'}
										{gwa >= 3 && gwa < 4 && 'You are pretty close to failing. Please study harder.'}
										{gwa >= 2 && gwa < 3 && 'You are doing okay. Keep it up!'}
										{gwa > 1.5 && gwa < 2 && 'You are doing great! Keep it up!'}
										{gwa <= 1.5 && 'You are doing excellent! Keep it up!'}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl tabular-nums">
										{gwa.toFixed(2)}
									</h1>
								</CardContent>
								<CardFooter className="justify-end">
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline" className="w-full md:w-auto text-foreground">How GWA is Calculated</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													GWA Formula
												</DialogTitle>
												<DialogDescription>
													The General Weighted Average (GWA) is calculated using the formula:
												</DialogDescription>
											</DialogHeader>
											<div className="flex flex-col gap-2">
												<span className="opacity-80">GWA = <span className="inline-block relative align-middle text-center">
													<span className="p-0.5">
														Σ(Units × Grade)
													</span>
													<Separator className="bg-foreground" />
													<span className="p-0.5">
														Σ(Units)
													</span>
												</span>
												</span>
												<h3 className="scroll-m-20 text-lg font-medium tracking-tight">
													Solution
												</h3>
												<ol className="list-decimal pl-5 opacity-80 space-y-2">
													<li><div className="inline-block relative align-middle text-center">
														<span className="p-0.5">
															{enteredGrades.map((eg, index) => {
																const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																if (!course || !eg.grade) return null;
																return (
																	<React.Fragment key={index}>
																		<span className="relative inline-flex justify-center pt-4">
																			<span className="absolute top-1 text-xs text-muted-foreground line-clamp-1">
																				{course?.code}
																			</span>
																			<span className="tabular-nums">({course.units} × {eg.grade.toFixed(2)})</span>
																		</span>
																		{index < enteredGrades.length - 1 ? ' + ' : ''}
																	</React.Fragment>
																)
															})}
														</span>
														<Separator className="bg-foreground block" />
														<span className="flex flex-col justify-center p-0.5">
															<span>
																{enteredGrades.map((eg, index) => {
																	const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																	return (
																		<React.Fragment key={index}>
																			<span className="tabular-nums">
																				{course?.units}
																			</span>
																			{index < enteredGrades.length - 1 ? ' + ' : ''}
																		</React.Fragment>
																	)
																})}
															</span>
															{
																enteredGrades.length > 1 && (
																	<span className="text-xs text-muted-foreground">
																		(Sum of the units for all courses)
																	</span>
																)
															}
														</span>
													</div></li>

													{
														enteredGrades.length > 1 && (
															<li><div className="inline-block relative align-middle text-center">
																<span className="p-0.5">
																	{enteredGrades.map((eg, index) => {
																		const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																		if (!course || !eg.grade) return null;
																		return (
																			<React.Fragment key={index}>
																				<span className="tabular-nums">
																					{course?.units * Number(eg.grade.toFixed(2))}
																				</span>
																				{index < enteredGrades.length - 1 ? ' + ' : ''}
																			</React.Fragment>
																		)
																	})}
																</span>
																<Separator className="bg-foreground block" />
																<span className="p-0.5">
																	{enteredGrades.map((eg, index) => {
																		const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																		return (
																			<React.Fragment key={index}>
																				<span className="tabular-nums">
																					{course?.units}
																				</span>
																				{index < enteredGrades.length - 1 ? ' + ' : ''}
																			</React.Fragment>
																		)
																	})}
																</span>
															</div></li>
														)
													}

													<li><div className="inline-block relative align-middle text-center">
														<span className="p-0.5 tabular-nums">
															{enteredGrades.reduce((acc, eg) => {
																const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																if (!course || !eg.grade) return acc;
																return acc + (course?.units * Number(eg.grade.toFixed(2)));
															}, 0)}
														</span>
														<Separator className="bg-foreground block" />
														<span className="p-0.5 tabular-nums">
															{enteredGrades.reduce((acc, eg) => {
																const course = courses[selectedProgram as string].find(course => course.code === eg.code);
																if (!course) return acc;
																return acc + course.units;
															}, 0)}
														</span>
													</div></li>

													<li>
														<div className={cn(
															"px-3 py-1 rounded font-bold text-lg w-fit tabular-nums",
															gwa >= 4 && 'bg-red-500 dark:bg-red-700 text-white',
															gwa >= 3 && gwa < 4 && 'bg-orange-500 dark:bg-orange-700 text-white',
															gwa >= 2 && gwa < 3 && 'bg-yellow-500 dark:bg-yellow-700 text-white',
															gwa > 1.5 && gwa < 2 && 'bg-lime-500 dark:bg-lime-700 text-white',
															gwa <= 1.5 && 'bg-green-500 dark:bg-green-700 text-white',
														)}>
															{gwa.toFixed(2)}
														</div>
													</li>
												</ol>
											</div>
										</DialogContent>
									</Dialog>
								</CardFooter>
							</Card>
						)
					}

				</div >
			</CardContent >
			<Separator />
			<CardFooter className="flex flex-col-reverse md:flex-row justify-end items-center gap-2">
				<Button
					variant='outline'
					className="w-full md:w-auto"
					ref={addSubjectButton}
					disabled={!selectedProgram}
					onClick={() => {
						setEnteredGrades(prev => {
							const newEnteredGrades = [...prev, { code: '', grade: undefined }];
							// Use setTimeout to ensure state has updated before scrolling
							setTimeout(() => {
								// Scroll the button into view after adding a new element
								window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
							}, 100);
							return newEnteredGrades;
						});
					}}
				>
					Add Subject
				</Button>
				<Button
					variant='destructive'
					className="w-full md:w-auto"
					onClick={() => {
						setEnteredGrades([{ code: '', grade: undefined }]);
						setGwa(null);
						setSelectedProgram(undefined);
					}}
				>
					Reset
				</Button>
				<Button
					className="w-full md:w-auto"
					onClick={calculateGwa}
					data-umami-event-selected={selectedProgram}
					disabled={
						!selectedProgram ||
						enteredGrades.length === 0 ||
						enteredGrades.some(eg => !eg.code || eg.grade === undefined)
					}
				>
					Calculate GWA
				</Button>
			</CardFooter>
		</Card >
	)
}

function ProgramSelect({ selectedProgram, setSelectedProgram }: { selectedProgram: keyof typeof data.programs | undefined; setSelectedProgram: React.Dispatch<React.SetStateAction<keyof typeof data.programs | undefined>> }) {
	const [openProgram, setOpenProgram] = useState(false);
	const { programs: rawPrograms } = data as Data;
	const isMobile = useIsMobile()

	const programs = Object.entries(rawPrograms).map(([code, program]) => ({
		code,
		name: program.name,
	}));

	const ProgramsList = () => (
		<Command
			className='max-md:rounded-t-none'
		>
			<CommandInput placeholder="Search program..." />
			<CommandList>
				<CommandEmpty>No program found.</CommandEmpty>
				<CommandGroup>
					{programs.map(({ code, name }) => (
						<CommandItem
							key={code}
							value={code + ' - ' + name}
							onSelect={() => {
								setSelectedProgram(code as keyof typeof data.programs);
								setOpenProgram(false);
							}}
						>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									selectedProgram === code ? "opacity-100" : "opacity-0"
								)}
							/>
							{code + ' - ' + name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	)

	if (isMobile) {
		return (
			<Drawer open={openProgram} onOpenChange={setOpenProgram}>
				<DrawerTrigger asChild>
					<Button variant="outline" className="w-full justify-between">
						<p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
							{
								selectedProgram
									? rawPrograms[selectedProgram].code + ' - ' + rawPrograms[selectedProgram].name
									: "Select program..."
							}
						</p>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="z-[910]">
					<DrawerHeader className="flex flex-col gap-1.5 p-4">
						<DrawerTitle>Select program</DrawerTitle>
						<DrawerDescription>Select a program to view the courses and enter your grades.</DrawerDescription>
					</DrawerHeader>
					<div className="mt-4 border-t">
						<ProgramsList />
					</div>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Popover open={openProgram} onOpenChange={setOpenProgram}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={openProgram}
					className="w-full justify-between"
				>
					<p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
						{
							selectedProgram
								? rawPrograms[selectedProgram].code + ' - ' + rawPrograms[selectedProgram].name
								: "Select program..."
						}
					</p>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="center" collisionPadding={25}>
				<ProgramsList />
			</PopoverContent>
		</Popover>
	)
}

function PresetSelect({ selectedProgram, setEnteredGrades }: { selectedProgram: keyof typeof data.programs | undefined; setEnteredGrades: React.Dispatch<React.SetStateAction<EnteredGrades[]>> }) {
	const [openPreset, setOpenPreset] = useState(false);
	const selectedProgramData = selectedProgram ? data.programs[selectedProgram as keyof typeof data.programs] as Program : undefined;
	const selectedProgramCourses = data.courses[selectedProgram as keyof typeof data.courses] as Course[] || [];
	const windowWidth = useWindowWidth();
	const isMobile = windowWidth < 768;

	const presetsObj = selectedProgramCourses.reduce((acc, course) => {
		const yearKey = course.year < 0 ? `Year ${Math.abs(course.year)}` : `Year ${course.year}`;
		const semesterKey = course.semester === 1 ? `First Semester` : course.semester === 2 ? `Second Semester` : `Summer`;

		if (!acc[yearKey]) {
			acc[yearKey] = {};
		}

		if (!acc[yearKey][semesterKey]) {
			acc[yearKey][semesterKey] = [];
		}

		const courseIndex = selectedProgramCourses.indexOf(course);
		const existingArray = acc[yearKey][semesterKey];

		let insertIndex = 0;
		while (insertIndex < existingArray.length &&
			selectedProgramCourses.indexOf(existingArray[insertIndex]) < courseIndex) {
			insertIndex++;
		}

		existingArray.splice(insertIndex, 0, course);

		return acc;
	}, {} as Record<string, Record<string, Course[]>>);

	type PresetItem = {
		semesters: Record<string, Course[]>;
		hasFirstSemMajors: boolean;
		hasSecondSemMajors: boolean;
		hasSummerMajors: boolean;
	};

	const presets = Object.entries(presetsObj).map(([yearKey, semesters]: [string, Record<string, Course[]>]): [string, PresetItem] => {
		const semestersWithMajors = Object.entries(semesters).map(([semesterKey, courses]) => {
			const hasMajors = (courses as Course[]).some(course => {
				if (selectedProgramData?.coreCode) {
					return course.major && (
						(Array.isArray(course.major)
							? !course.major.includes(selectedProgramData.coreCode)
							: course.major !== selectedProgramData.coreCode)
					);
				} else {
					return !!course.major;
				}
			});
			return { semesterKey, hasMajors };
		});

		const hasFirstSemMajors = semestersWithMajors.find(s => s.semesterKey === "First Semester")?.hasMajors ?? false;
		const hasSecondSemMajors = semestersWithMajors.find(s => s.semesterKey === "Second Semester")?.hasMajors ?? false;
		const hasSummerMajors = semestersWithMajors.find(s => s.semesterKey === "Summer")?.hasMajors ?? false;

		return [yearKey, { semesters, hasFirstSemMajors, hasSecondSemMajors, hasSummerMajors }];
	});

	const coursesForCore = selectedProgramData?.coreCode && selectedProgramCourses.filter(course =>
		course.major === selectedProgramData?.coreCode ||
		course.major === undefined
	)

	const getCoreCourses = (courses: Course[]) => {
		return selectedProgramData?.coreCode
			? courses.filter(course =>
				course.major === selectedProgramData.coreCode ||
				course.major === undefined
			)
			: null;
	};

	const renderCoreCommandItem = (
		courses: Course[],
		yearKey: string,
		semesterKey: string,
		semesterLabel: string
	) => {
		const coreCoursesForPreset = getCoreCourses(courses);
		return coreCoursesForPreset && coreCoursesForPreset.length > 0 && (
			<CommandItem
				key={`${yearKey}-${semesterKey.toLowerCase()}-core`}
				onSelect={() => {
					setEnteredGrades(coreCoursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
					setOpenPreset(false);
				}}
				value={`${yearKey} - Core Program - ${semesterLabel}`}
			>
				<span className="flex-1">{semesterLabel}</span>
				<Badge className="ml-2">
					{coreCoursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
				</Badge>
			</CommandItem>
		);
	};

	const renderCoreProgramSections = (semesters: Record<string, Course[]>, yearKey: string) => {
		const semesterConfigs = [
			{ key: 'First Semester', label: 'First Semester' },
			{ key: 'Second Semester', label: 'Second Semester' },
			{ key: 'Summer', label: 'Summer' }
		];

		const coreItems = semesterConfigs
			.filter(config => semesters[config.key])
			.map(config => renderCoreCommandItem(semesters[config.key], yearKey, config.key, config.label))
			.filter(Boolean);

		return coreItems.length > 0 && (
			<CommandGroup className="pl-4 pr-0" heading="Core Program">
				{coreItems}
			</CommandGroup>
		);
	};

	const getCoursesByMajor = (courses: Course[], major: string) => {
		return courses
			.filter(course =>
				selectedProgramData?.coreCode && course.major !== selectedProgramData.coreCode ||
				!selectedProgramData?.coreCode || course.major === undefined
			)
			.filter(course =>
				(Array.isArray(course.major) ? course.major.includes(major) : course.major === major) ||
				course.major === undefined
			) as Course[];
	};

	const renderMajorCommandItem = (
		courses: Course[],
		major: string,
		yearKey: string,
		semesterLabel: string
	) => {
		const coursesForPreset = getCoursesByMajor(courses, major);

		return (
			<CommandItem
				key={`${yearKey} - ${major} - ${semesterLabel}`}
				onSelect={() => {
					setEnteredGrades(coursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
					setOpenPreset(false);
				}}
				value={`${yearKey} - ${major} - ${semesterLabel}`}
			>
				<span className="flex-1">{semesterLabel}</span>
				<Badge className="ml-2">
					{coursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
				</Badge>
			</CommandItem>
		);
	};

	const renderMajorSections = (semesters: Record<string, Course[]>, yearKey: string) => {
		const allMajors = Array.from(new Set(
			Object.values(semesters)
				.flat()
				.flatMap(course => Array.isArray(course.major) ? course.major : course.major ? [course.major] : [])
		))
			.filter(Boolean)
			.filter((major) => {
				if (selectedProgramData?.coreCode) return major !== selectedProgramData.coreCode;
				return true;
			});

		return allMajors.map((major) => {
			const semesterItems = Object.entries(semesters)
				.filter(([, courses]) => courses.length > 0)
				.map(([semesterKey, courses]) => {
					return renderMajorCommandItem(courses, major, yearKey, semesterKey);
				});

			return semesterItems.length > 0 && (
				<CommandGroup key={`${yearKey}-major-${major}`} className="pl-4 pr-0" heading={`${major} - ${selectedProgramData?.majors?.find(m => m.code === major)?.name || major}`}>
					{semesterItems}
				</CommandGroup>
			);
		}).filter(Boolean);
	};

	const renderRegularSemesterItems = (semesters: Record<string, Course[]>, yearKey: string) => {
		return Object.entries(semesters).map(([semesterKey, courses]) => {
			const coursesForPreset = courses as Course[];
			return (coursesForPreset?.length || 0) > 0 && (
				<CommandItem
					key={`${yearKey}-${semesterKey.toLowerCase().replace(' ', '-')}`}
					onSelect={() => {
						setEnteredGrades(coursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
						setOpenPreset(false);
					}}
					value={`${yearKey} - ${semesterKey}`}
				>
					<span className="flex-1">{semesterKey}</span>
					<Badge className="ml-2">
						{coursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
					</Badge>
				</CommandItem>
			);
		}).filter(Boolean);
	};

	const PresetList = () => (
		<Command
			className='max-md:rounded-t-none'
			value=""
		>
			<CommandItem
				className="px-2 py-1.5 text-sm data-[inset]:pl-8 font-semibold pointer-events-none"
			>
				{selectedProgramData ? selectedProgramData.code + ' - ' + selectedProgramData.name : "No program selected"}
			</CommandItem>
			<CommandSeparator />
			<CommandList>
				<CommandGroup>
					<CommandGroup heading="Complete Program">
						{
							(selectedProgramData?.majors?.length || 0) >= 1 ? (
								<>
									{
										coursesForCore && (
											<CommandItem
												onSelect={() => {
													setEnteredGrades(coursesForCore.map(course => ({ code: course.code, grade: undefined, major: course.major })));
													setOpenPreset(false);
												}}
												value="All"
											>
												<span className="flex-1">All Core Courses</span>
												<Badge className="ml-2">
													{coursesForCore.reduce((sum, course) => sum + course.units, 0)} Units
												</Badge>
											</CommandItem>
										)
									}
									{
										selectedProgramData?.majors?.map((major) => {
											const coursesForMajor = selectedProgramCourses.filter(course =>
												(Array.isArray(course.major) ? course.major.includes(major.code) : course.major === major.code) ||
												course.major === undefined
											); return (
												<CommandItem
													key={major.code}
													onSelect={() => {
														setEnteredGrades(coursesForMajor.map(course => ({ code: course.code, grade: undefined, major: course.major })));
														setOpenPreset(false);
													}}
													value={`All-${major.code}`}
												>
													<span className="flex-1">
														All {major.name} ({major.code}) Courses
													</span>
													<Badge className="ml-2">
														{coursesForMajor.reduce((sum, course) => sum + course.units, 0)} Units
													</Badge>
												</CommandItem>
											)
										})
									}
								</>
							) : (
								<CommandItem
									onSelect={() => {
										setEnteredGrades(selectedProgramCourses.map(course => ({ code: course.code, grade: undefined, major: course.major })));
										setOpenPreset(false);
									}}
									value="All"
								>
									<span className="flex-1">All Courses</span>
									<Badge className="ml-2">
										{selectedProgramCourses.reduce((sum, course) => sum + course.units, 0)} Units
									</Badge>
								</CommandItem>
							)
						}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Year by Year">
						{
							presets.map(([yearKey, { semesters }]) => {
								const allMajorsInYear = Array.from(new Set(
									Object.values(semesters)
										.flat()
										.flatMap(course => Array.isArray(course.major) ? course.major : course.major ? [course.major] : [])
								)).filter(Boolean).filter(major => (
									!selectedProgramData?.coreCode || major !== selectedProgramData.coreCode
								));

								const coreCourses = selectedProgramData?.coreCode && Object.values(semesters)
									.flat()
									.filter(course =>
										course.major === selectedProgramData?.coreCode ||
										course.major === undefined
									);

								return (
									<React.Fragment key={String(yearKey)}>
										{allMajorsInYear.length > 0 ? (
											<CommandGroup className="pl-4 pr-0" heading={`${yearKey}`}>
												<>
													{
														coreCourses && (
															<CommandItem
																key={`${yearKey}-core`}
																onSelect={() => {
																	setEnteredGrades(coreCourses.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																	setOpenPreset(false);
																}}
																value={`${yearKey}-All`}
															>
																<span className="flex-1">Core Courses</span>
																<Badge className="ml-2">
																	{coreCourses.reduce((sum, course) => sum + course.units, 0)} Units
																</Badge>
															</CommandItem>
														)
													}
													{
														allMajorsInYear.map(major => {
															const coursesForMajor = Object.values(semesters)
																.flat()
																.filter(course =>
																	(Array.isArray(course.major) ? course.major.includes(major) : course.major === major) ||
																	course.major === undefined
																);

															return (<CommandItem
																key={`${yearKey}-${major}`}
																onSelect={() => {
																	setEnteredGrades(coursesForMajor.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																	setOpenPreset(false);
																}}
																value={`${yearKey}-${major}`}
															>
																<span className="flex-1">{major} - {selectedProgramData?.majors?.find(m => m.code === major)?.name || major}</span>
																<Badge className="ml-2">
																	{coursesForMajor.reduce((sum, course) => sum + course.units, 0)} Units
																</Badge>
															</CommandItem>
															);
														})
													}
												</>
											</CommandGroup>
										) : (<CommandItem
											key={yearKey}
											onSelect={() => {
												const allCourses = Object.values(semesters).flat();
												setEnteredGrades(allCourses.map(course => ({ code: course.code, grade: undefined, major: course.major })));
												setOpenPreset(false);
											}}
											value={yearKey}
										>
											<span className="flex-1">{yearKey}</span>
											<Badge className="ml-2">
												{Object.values(semesters).flat().reduce((sum, course) => sum + course.units, 0)} Units
											</Badge>
										</CommandItem>
										)}
									</React.Fragment>
								);
							})
						}
					</CommandGroup>
					<CommandSeparator />					{
						presets.map(([yearKey, { semesters, hasFirstSemMajors, hasSecondSemMajors, hasSummerMajors }], index) => (
							<React.Fragment key={String(yearKey)}>
								{index > 0 && <CommandSeparator />}
								<CommandGroup heading={`${yearKey}`}>
									{
										!hasFirstSemMajors && !hasSecondSemMajors && !hasSummerMajors && (
											<>
												{renderCoreProgramSections(semesters, yearKey)}
												{renderRegularSemesterItems(semesters, yearKey)}
											</>
										)
									}{hasFirstSemMajors && !hasSecondSemMajors && !hasSummerMajors && (
										<>
											{renderCoreProgramSections(semesters, yearKey)}
											{renderMajorSections({
												'First Semester': semesters['First Semester']
											}, yearKey)}
											{renderRegularSemesterItems({
												'Second Semester': semesters['Second Semester'],
												'Summer': semesters['Summer']
											}, yearKey)}
										</>
									)
									}{
										!hasFirstSemMajors && hasSecondSemMajors && !hasSummerMajors && (
											<>
												{renderCoreProgramSections(semesters, yearKey)}
												{renderMajorSections({
													'First Semester': semesters['First Semester']
												}, yearKey)}
												{renderRegularSemesterItems({
													'Second Semester': semesters['Second Semester'],
													'Summer': semesters['Summer']
												}, yearKey)}
											</>
										)
									}{
										!hasFirstSemMajors && hasSecondSemMajors && hasSummerMajors && (
											<>
												{selectedProgramData?.coreCode && semesters['First Semester'] && (() => {
													const coreCoursesForPreset = semesters['First Semester'].filter(course =>
														course.major === selectedProgramData.coreCode ||
														course.major === undefined
													);
													return coreCoursesForPreset.length > 0 && (
														<CommandGroup className="pl-4 pr-0" heading="Core Program">
															<CommandItem
																key={`${yearKey}-first-core`}
																onSelect={() => {
																	setEnteredGrades(coreCoursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																	setOpenPreset(false);
																}}
																value={`${yearKey} - Core Program - First Semester`}
															>
																<span className="flex-1">First Semester</span>
																<Badge className="ml-2">
																	{coreCoursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
																</Badge>
															</CommandItem>
														</CommandGroup>
													);
												})()}
												{selectedProgramData?.coreCode && semesters['Second Semester'] && (() => {
													const coreCoursesForPreset = semesters['Second Semester'].filter(course =>
														course.major === selectedProgramData.coreCode ||
														course.major === undefined
													);
													return coreCoursesForPreset.length > 0 && (
														<CommandGroup className="pl-4 pr-0" heading="Core Program">
															<CommandItem
																key={`${yearKey}-second-core`}
																onSelect={() => {
																	setEnteredGrades(coreCoursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																	setOpenPreset(false);
																}}
																value={`${yearKey} - Core Program - Second Semester`}
															>
																<span className="flex-1">Second Semester</span>
																<Badge className="ml-2">
																	{coreCoursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
																</Badge>
															</CommandItem>
														</CommandGroup>
													);
												})()}
												{selectedProgramData?.coreCode && semesters['Summer'] && (() => {
													const coreCoursesForPreset = semesters['Summer'].filter(course =>
														course.major === selectedProgramData.coreCode ||
														course.major === undefined
													);
													return coreCoursesForPreset.length > 0 && (
														<CommandGroup className="pl-4 pr-0" heading="Core Program">
															<CommandItem
																key={`${yearKey}-summer-core`}
																onSelect={() => {
																	setEnteredGrades(coreCoursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																	setOpenPreset(false);
																}}
																value={`${yearKey} - Core Program - Summer`}
															>
																<span className="flex-1">Summer</span>
																<Badge className="ml-2">
																	{coreCoursesForPreset.reduce((sum, course) => sum + course.units, 0)} Units
																</Badge>
															</CommandItem>
														</CommandGroup>
													);
												})()}
												{
													Array.from(new Set(semesters['Second Semester'].flatMap(course =>
														Array.isArray(course.major) ? course.major : course.major ? [course.major] : []
													))).filter(Boolean).map((major) => {
														const coursesFor2ndPreset = semesters['Second Semester'].filter(course =>
															(Array.isArray(course.major) ? course.major.includes(major) : course.major === major) ||
															course.major === undefined
														) as Course[];
														const coursesFor3rdPreset = semesters['Summer'].filter(course =>
															(Array.isArray(course.major) ? course.major.includes(major) : course.major === major) ||
															course.major === undefined
														) as Course[];
														return (
															<CommandGroup key={`${yearKey}-major-${major}`} className="pl-4 pr-0" heading={`${major} - ${selectedProgramData?.majors?.find(m => m.code === major)?.name || major}`}>
																<CommandItem
																	onSelect={() => {
																		setEnteredGrades(coursesFor2ndPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																		setOpenPreset(false);
																	}}
																	value={`${yearKey} - ${major} - Second Semester`}
																>
																	<span className="flex-1">Second Semester</span>
																	<Badge className="ml-2">
																		{coursesFor2ndPreset.reduce((sum, course) => sum + course.units, 0)} Units
																	</Badge>
																</CommandItem>
																{
																	coursesFor3rdPreset.length > 0 && (
																		<CommandItem
																			onSelect={() => {
																				setEnteredGrades(coursesFor3rdPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
																				setOpenPreset(false);
																			}}
																			value={`${yearKey} - ${major} - Summer`}
																		>
																			<span className="flex-1">Summer</span>
																			<Badge className="ml-2">
																				{coursesFor3rdPreset.reduce((sum, course) => sum + course.units, 0)} Units
																			</Badge>
																		</CommandItem>
																	)
																}
															</CommandGroup>
														)
													})
												}
												<CommandItem
													key={`${yearKey}-first`}
													onSelect={() => {
														const coursesForPreset = semesters['First Semester'] as Course[];
														setEnteredGrades(coursesForPreset.map(course => ({ code: course.code, grade: undefined, major: course.major })));
														setOpenPreset(false);
													}}
													value={`${yearKey} - First Semester`}
												>
													<span className="flex-1">First Semester</span>
													<Badge className="ml-2">
														{semesters['First Semester'].reduce((sum, course) => sum + course.units, 0)} Units
													</Badge>
												</CommandItem>
											</>
										)
									}{hasFirstSemMajors && hasSecondSemMajors && !hasSummerMajors && (
										<>
											{renderCoreProgramSections(semesters, yearKey)}
											{renderMajorSections({
												'First Semester': semesters['First Semester'],
												'Second Semester': semesters['Second Semester'],
											}, yearKey)}
											{renderRegularSemesterItems({
												'Summer': semesters['Summer']
											}, yearKey)}
										</>
									)
									}{
										!hasFirstSemMajors && hasSecondSemMajors && hasSummerMajors && (
											<>
												{renderCoreProgramSections(semesters, yearKey)}
												{renderMajorSections({
													'Second Semester': semesters['Second Semester'],
													'Summer': semesters['Summer']
												}, yearKey)}
												{renderRegularSemesterItems({
													'First Semester': semesters['First Semester']
												}, yearKey)}
											</>
										)
									}
									{hasFirstSemMajors && hasSecondSemMajors && hasSummerMajors && (
										<>
											{renderCoreProgramSections(semesters, yearKey)}
											{renderMajorSections(semesters, yearKey)}
										</>
									)}
								</CommandGroup>
							</React.Fragment>
						))
					}
				</CommandGroup>
			</CommandList>
		</Command>
	)

	if (isMobile) {
		return (
			<Drawer open={openPreset} onOpenChange={setOpenPreset}>
				<DrawerTrigger asChild>
					<Button variant="outline" className="w-full justify-between" disabled={!selectedProgram}>
						Select preset...
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="z-[910]">
					<DrawerHeader className="flex flex-col gap-1.5 p-4">
						<DrawerTitle>Select preset</DrawerTitle>
						<DrawerDescription>Select a preset to quickly fill in courses for a specific semester.</DrawerDescription>
					</DrawerHeader>
					<div className="border-t">
						<PresetList />
					</div>
				</DrawerContent >
			</Drawer >
		)
	}

	return (
		<Popover open={openPreset} onOpenChange={setOpenPreset}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="w-full justify-between" disabled={!selectedProgram}>
					Select preset...
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="center" collisionPadding={25}>
				<PresetList />
			</PopoverContent>
		</Popover>
	)
}

function SubjectRow({ selectedProgram, enteredGrade, index, enteredGrades, setEnteredGrades, isMobile }: {
	selectedProgram: keyof typeof data.programs | undefined;
	enteredGrade: EnteredGrades;
	index: number;
	enteredGrades: EnteredGrades[];
	setEnteredGrades: React.Dispatch<React.SetStateAction<EnteredGrades[]>>;
	isMobile: boolean;
}) {
	const { courses } = data as Data;
	const courseChoices = courses[selectedProgram as string] || [];
	const course = courseChoices.find(course =>
		course.code === enteredGrade.code &&
		(course.major === enteredGrade.major || (!course.major && !enteredGrade.major))
	);
	const groupedChoices = courseChoices.reduce((acc, course) => {
		const yearKey = course.year < 0 ? `Year ${Math.abs(course.year)}` : `Year ${course.year}`;
		const semesterKey = course.semester === 1 ? `First Semester` : course.semester === 2 ? `Second Semester` : `Summer`;

		if (!acc[yearKey]) {
			acc[yearKey] = {};
		}

		if (!acc[yearKey][semesterKey]) {
			acc[yearKey][semesterKey] = [];
		}

		acc[yearKey][semesterKey].push(course);
		return acc;
	}, {} as Record<string, Record<string, typeof courseChoices>>);

	const CourseSelect = () => {
		const [openCourseChoices, setOpenCourseChoices] = useState(false);

		const CoursesList = () => (
			<Command
				value={course ? course.code + ' - ' + course.major : ''}
				className='max-md:rounded-t-none'
			>
				<CommandInput placeholder="Search course..." />
				<CommandList>
					<CommandEmpty>No course found.</CommandEmpty>
					{
						Object.entries(groupedChoices).map(([yearKey, semesters], yearIndex) => (
							Object.entries(semesters).map(([semesterKey, courses], semIndex) => (
								<React.Fragment key={`${yearKey}-${semesterKey}`}>
									{(yearIndex > 0 || semIndex > 0) && <CommandSeparator />}
									<CommandGroup heading={`${yearKey} - ${semesterKey}`}>
										{courses.map((course) => (
											<CommandItem
												key={course.code + ' - ' + course.major}
												value={course.code + ' - ' + course.name + ' - ' + course.major}
												disabled={enteredGrades.some(eg => eg.code === course.code && eg.major === course.major)}
												onSelect={() => {
													const newEnteredGrades = [...enteredGrades];
													newEnteredGrades[index].code = course.code;
													newEnteredGrades[index].grade = undefined; // Reset grade when course changes
													newEnteredGrades[index].major = course?.major
													setEnteredGrades(newEnteredGrades);
													setOpenCourseChoices(false);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														enteredGrades.some(eg => eg.code === course.code && eg.major === course.major) ?
															"opacity-100" : "opacity-0"
													)}
												/>
												<span className="flex-grow">
													{course.code} - {course.name}
												</span>
												{
													course.major &&
													<Badge className="ml-2">
														{
															Array.isArray(course.major) ?
																course.major.sort().join('/') :
																course.major
														}
													</Badge>
												}
											</CommandItem>
										))}
									</CommandGroup>
								</React.Fragment>
							))
						))
					}
				</CommandList>
			</Command>
		)

		if (isMobile) {
			return (
				<Drawer open={openCourseChoices} onOpenChange={setOpenCourseChoices}>
					<DrawerTrigger asChild>
						<Button variant="outline" className="w-full justify-between">
							<p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
								{course?.code
									? course.code + ' - ' + course.name
									: "Select course..."}
							</p>
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="z-[910]">
						<DrawerHeader className="flex flex-col gap-1.5 p-4">
							<DrawerTitle>Choose course</DrawerTitle>
							<DrawerDescription>Select a course to add to your grade calculation.</DrawerDescription>
						</DrawerHeader>
						<div className="mt-4 border-t">
							<CoursesList />
						</div>
					</DrawerContent>
				</Drawer>
			)
		}

		return (
			<Popover open={openCourseChoices} onOpenChange={setOpenCourseChoices}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={openCourseChoices}
						className="w-full justify-between overflow-hidden"
					>
						<p className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
							{course?.code
								? course.code + ' - ' + course.name
								: "Select course..."}
						</p>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="center" collisionPadding={5}>
					<CoursesList />
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<div key={index} className="bg-card p-3 border rounded-md flex flex-col md:grid md:grid-cols-subgrid md:col-span-4 md:items-center gap-0 w-full overflow-hidden">
			<div className="flex flex-col gap-1 overflow-x-hidden p-1">
				<p className="text-sm font-medium">Course {index + 1}</p>
				<CourseSelect />
			</div>
			<div className="flex flex-col gap-1 overflow-x-hidden p-1">
				<p className="text-sm font-medium">Units</p>
				<Input
					type="number"
					className="w-full md:w-16"
					value={course?.units || ''}
					disabled
					readOnly
				/>
			</div>
			<div className="flex flex-col gap-1 overflow-x-hidden p-1">
				<p className="text-sm font-medium">Grades</p>
				<Select
					value={enteredGrade.grade !== undefined ? enteredGrade.grade.toFixed(2).toString() : ""}
					onValueChange={(value) => {
						const newEnteredGrades = [...enteredGrades];
						newEnteredGrades[index].grade = parseFloat(value);
						setEnteredGrades(newEnteredGrades);
					}}
				>
					<SelectTrigger className="w-full md:w-24">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="w-[var(--radix-select-trigger-width)] h-52" align="center" collisionPadding={5}>
						<SelectItem value="1.00">1.00</SelectItem>
						<SelectItem value="1.25">1.25</SelectItem>
						<SelectItem value="1.50">1.50</SelectItem>
						<SelectItem value="1.75">1.75</SelectItem>
						<SelectItem value="2.00">2.00</SelectItem>
						<SelectItem value="2.25">2.25</SelectItem>
						<SelectItem value="2.50">2.50</SelectItem>
						<SelectItem value="2.75">2.75</SelectItem>
						<SelectItem value="3.00">3.00</SelectItem>
						<SelectItem value="5.00">5.00</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Button
				variant="destructive"
				size='icon'
				className="ml-auto md:ml-1 md:mt-auto mb-1"
				onClick={() => {
					setEnteredGrades(prev => prev.filter((_, i) => i !== index));
				}}
			>
				<Trash2 />
			</Button>
		</div >
	)
}

