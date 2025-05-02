'use client'

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import data from '@/app/data.json'
import { Data } from "@/lib/types";
import { Input } from "./ui/input";
import React from "react";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

type EnteredGrades = {
	code: string;
	grade: number | undefined;
}

export default function GwaCalculator() {
	const { courses, programs } = data as Data;
	const addSubjectButton = useRef<HTMLButtonElement | null>(null);
	const [selectedProgram, setSelectedProgram] = useState<keyof typeof data.programs | undefined>(undefined);
	const [enteredGrades, setEnteredGrades] = useState<EnteredGrades[]>([{ code: '', grade: undefined }]);
	const [gwa, setGwa] = useState<number | null>(null);

	useEffect(() => {
		setGwa(null);
	}, [enteredGrades, selectedProgram])

	useEffect(() => {
		console.log(enteredGrades);
	}, [enteredGrades])
		

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
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Enter your courses and grades</CardTitle>
				<CardDescription>Calculate your General Weighted Average (GWA)</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 md:gap-6">
					<ProgramSelect selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full justify-between" disabled={!selectedProgram}>
								Select preset... <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0 max-h-52" align="center" collisionPadding={25}>
							<DropdownMenuLabel className="bg-secondary text-secondary-foreground font-bold">{selectedProgram ? programs[selectedProgram].name : "No program selected"}</DropdownMenuLabel>
							{
								selectedProgram ? (
									<>
										<DropdownMenuSeparator className="my-0" />
										{
											programs[selectedProgram].year.map((year) => {
												const program = programs[selectedProgram];
												const programCourses = courses[program.code] || [];
												const hasMajorCoursesInFirstSem = [...new Set(programCourses.filter(c => c.year === year && c.semester === 1).map(course => course.major))].length > 1;
												const hasMajorCoursesInSecondSem = [...new Set(programCourses.filter(c => c.year === year && c.semester === 2).map(course => course.major))].length > 1;

												if ((hasMajorCoursesInFirstSem || hasMajorCoursesInSecondSem) && program.majors) {
													if (hasMajorCoursesInFirstSem && !hasMajorCoursesInSecondSem) {
														return (
															<React.Fragment key={year}>
																<DropdownMenuGroup key={year}>
																	<DropdownMenuLabel className="bg-secondary text-secondary-foreground">Year {year}</DropdownMenuLabel>
																	{
																		program.majors.map((major) => {
																			return (
																				<React.Fragment key={major.code + '-' + year}>
																					<DropdownMenuLabel className="bg-secondary/50 text-secondary-foreground pl-6">
																						{major.name}
																					</DropdownMenuLabel>
																					<DropdownMenuItem
																						onClick={() => {
																							const yearCourses = programCourses.filter(
																								course => (course.major === undefined || course.major === major.code) && course.year === year && course.semester === 1
																							).map(course => course.code);
																							setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																						}}
																					>
																						<span className="pl-8">{major.code}  - First Semester</span>
																					</DropdownMenuItem>
																				</React.Fragment>
																			)
																		})
																	}
																</DropdownMenuGroup>
																<DropdownMenuItem
																	onClick={() => {
																		const yearCourses = programCourses.filter(
																			course => course.year === year && course.semester === 2
																		).map(course => course.code);
																		setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																	}}
																>
																	<span className="pl-8">Year {year} - Second Semester</span>
																</DropdownMenuItem>
															</React.Fragment>
														)
													} else if (!hasMajorCoursesInFirstSem && hasMajorCoursesInSecondSem) {
														return (
															<React.Fragment key={year}>
																<DropdownMenuGroup key={year}>
																	<DropdownMenuLabel className="bg-secondary text-secondary-foreground">Year {year}</DropdownMenuLabel>
																	<DropdownMenuItem
																		onClick={() => {
																			const yearCourses = programCourses.filter(
																				course => course.year === year && course.semester === 1
																			).map(course => course.code);
																			setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																		}}
																	>
																		<span className="pl-8">Year {year} - First Semester</span>
																	</DropdownMenuItem>
																	{
																		program.majors.map((major) => {
																			return (
																				<React.Fragment key={major.code + '-' + year}>
																					<DropdownMenuLabel className="bg-secondary/50 text-secondary-foreground pl-6">
																						{major.name}
																					</DropdownMenuLabel>
																					<DropdownMenuItem
																						onClick={() => {
																							const yearCourses = programCourses.filter(
																								course => (course.major === undefined || course.major === major.code) && course.year === year && course.semester === 2
																							).map(course => course.code);
																							setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																						}}
																					>
																						<span className="pl-8">{major.code} - Second Semester</span>
																					</DropdownMenuItem>
																				</React.Fragment>
																			)
																		})
																	}
																</DropdownMenuGroup>
															</React.Fragment>
														)
													} else if (hasMajorCoursesInFirstSem && hasMajorCoursesInSecondSem) {
														return (
															<DropdownMenuGroup key={year}>
																<DropdownMenuLabel className="bg-secondary text-secondary-foreground">Year {year}</DropdownMenuLabel>
																{program.majors
																	.filter(major => major.year.includes(year))
																	.map((major) => {
																		return (
																			<React.Fragment key={`${year}-major-${major.code}`}>
																				<DropdownMenuLabel className="bg-secondary/50 text-secondary-foreground pl-6">
																					{major.name}
																				</DropdownMenuLabel>

																				{hasMajorCoursesInFirstSem && (
																					<DropdownMenuItem
																						onClick={() => {
																							const yearCourses = programCourses.filter(
																								course => (
																									(course.major === major.code || course.major === undefined) &&
																									course.semester === 1 &&
																									course.year === year
																								)
																							).map(course => course.code);
																							setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																						}}
																					>
																						<span className="pl-8">{major.name} - First Semester</span>
																					</DropdownMenuItem>
																				)}

																				{hasMajorCoursesInSecondSem && (
																					<DropdownMenuItem
																						onClick={() => {
																							const yearCourses = programCourses.filter(
																								course => (
																									(course.major === major.code || course.major === undefined) &&
																									course.semester === 2 &&
																									course.year === year
																								)
																							).map(course => course.code);
																							setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																						}}
																					>
																						<span className="pl-8">{major.name} - Second Semester</span>
																					</DropdownMenuItem>
																				)}
																			</React.Fragment>
																		);
																	}).filter(Boolean)}
															</DropdownMenuGroup>
														)
													}
												} else {
													return (
														<DropdownMenuGroup key={year}>
															<DropdownMenuLabel className="bg-secondary text-secondary-foreground">Year {year}</DropdownMenuLabel>
															<DropdownMenuItem
																key={`year-${year}-first`}
																onClick={() => {
																	const yearCourses = programCourses.filter(
																		course => course.year === year && course.semester === 1
																	).map(course => course.code);
																	setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																}}
															>
																<span className="pl-8">Year {year} - First Semester</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																key={`year-${year}-second`}
																onClick={() => {
																	const yearCourses = programCourses.filter(
																		course => course.year === year && course.semester === 2
																	).map(course => course.code);
																	setEnteredGrades(yearCourses.map((subject) => ({ code: subject, grade: undefined })));
																}}
															>
																<span className="pl-8">Year {year} - Second Semester</span>
															</DropdownMenuItem>
														</DropdownMenuGroup>
													)
												}
											})
										}
									</>
								) : null
							}
						</DropdownMenuContent>
					</DropdownMenu>
					<div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-x-2 gap-y-4 w-full">
						{selectedProgram ? (
							<>
								{
									enteredGrades.map((enteredGrade, index) => {
										return (
											<SubjectRow
												key={'eg-' + index}
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
									<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
										{gwa.toFixed(2)}
									</h1>
								</CardContent>
							</Card>
						)
					}

				</div>
			</CardContent>
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
					disabled={
						!selectedProgram ||
						enteredGrades.length === 0 ||
						enteredGrades.some(eg => !eg.code || eg.grade === undefined)
					}
				>
					Calculate GWA
				</Button>
			</CardFooter>
		</Card>
	)
}

function ProgramSelect({ selectedProgram, setSelectedProgram }: { selectedProgram: keyof typeof data.programs | undefined; setSelectedProgram: React.Dispatch<React.SetStateAction<keyof typeof data.programs | undefined>> }) {
	const [openProgram, setOpenProgram] = useState(false);
	const { programs: rawPrograms } = data as Data;
	const isMobile = useIsMobile()

	const programs = Object.entries(rawPrograms).map(([code, program]) => ({
		code,
		name: program.name
	}));

	const ProgramsList = () => (
		<Command>
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
				<DrawerContent>
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
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-52" align="center" collisionPadding={25}>
				<ProgramsList />
			</PopoverContent>
		</Popover>
	)
}

function SubjectRow({ selectedProgram, enteredGrade, index, enteredGrades, setEnteredGrades }: {
	selectedProgram: keyof typeof data.programs | undefined;
	enteredGrade: EnteredGrades;
	index: number;
	enteredGrades: EnteredGrades[];
	setEnteredGrades: React.Dispatch<React.SetStateAction<EnteredGrades[]>>;
}) {
	const { courses } = data as Data;
	const courseChoices = courses[selectedProgram as string] || [];
	const course = courseChoices.find(course => course.code === enteredGrade.code);
	const groupedChoices = courseChoices.reduce((acc, course) => {
		const yearKey = `Year ${course.year}`;
		const semesterKey = `${course.semester === 1 ? 'First' : 'Second'} Semester`;

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
		const isMobile = useIsMobile()

		const CoursesList = () => (
			<Command>
				<CommandInput placeholder="Search course..." />
				<CommandList>
					<CommandEmpty>No course found.</CommandEmpty>
					{
						Object.entries(groupedChoices).map(([yearKey, semesters]) => (
							Object.entries(semesters).map(([semesterKey, courses]) => (
								<CommandGroup key={`${yearKey}-${semesterKey}`} heading={`${yearKey} - ${semesterKey}`}>
									{courses.map((course) => (
										<CommandItem
											key={course.code}
											value={course.code + ' - ' + course.name}
											onSelect={() => {
												const newEnteredGrades = [...enteredGrades];
												newEnteredGrades[index].code = course.code;
												newEnteredGrades[index].grade = undefined; // Reset grade when course changes
												setEnteredGrades(newEnteredGrades);
												setOpenCourseChoices(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													enteredGrade.code === course.code ? "opacity-100" : "opacity-0"
												)}
											/>
											{course.code} - {course.name}
										</CommandItem>
									))}
								</CommandGroup>
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
									? courses[selectedProgram as string].find((course) => course.code === enteredGrade.code)?.code + ' - ' + courses[selectedProgram as string].find((course) => course.code === enteredGrade.code)?.name
									: "Select course..."}
							</p>
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
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
								? courses[selectedProgram as string].find((course) => course.code === enteredGrade.code)?.code + ' - ' + courses[selectedProgram as string].find((course) => course.code === enteredGrade.code)?.name
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
		<div key={index} className="bg-card p-3 border rounded-md flex flex-col md:grid md:grid-cols-subgrid md:col-span-4 md:items-center gap-4 md:gap-2 w-full overflow-hidden">
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
				className="ml-auto md:ml-0 md:mt-auto mb-1"
				onClick={() => {
					setEnteredGrades(prev => prev.filter((_, i) => i !== index));
				}}
			>
				<Trash2 />
			</Button>
		</div >
	)
}

