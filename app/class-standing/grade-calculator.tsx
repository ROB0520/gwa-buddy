"use client"

import { useState, Fragment, useEffect, Dispatch, SetStateAction, useRef, RefObject } from "react";
import { z } from "zod";
import { Controller, useFieldArray, useForm, useFormState, UseFormStateReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CalculatorIcon, ChevronsUpDownIcon, EyeIcon, MinusIcon, PartyPopperIcon, PercentIcon, PlusIcon, SaveIcon, Share2Icon, SparkleIcon, StarsIcon, TrendingUpDownIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import LZString from "lz-string";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

type SharedCourse = {
	n: string;
	c: SharedCategory[];
};

type SharedCategory = {
	n: string;
	w: number;
	p?: string; // detected prefix
	r: SharedRecord[];
};

type SharedRecord =
	| number
	| [number, number]
	| [string, number];

function serializeCourse(course: CourseDetails): string {
	const data: SharedCourse = {
		n: course.name,
		c: course.categories.map(category => {
			const parsedRecords = category.records.map(record =>
				parseSequentialName(record.name)
			);

			const prefixCounts = new Map<string, number>();

			for (const parsed of parsedRecords) {
				if (!parsed) continue;

				prefixCounts.set(
					parsed.prefix,
					(prefixCounts.get(parsed.prefix) ?? 0) + 1
				);
			}

			const detectedPrefix =
				[...prefixCounts.entries()]
					.sort((a, b) => b[1] - a[1])[0]?.[0];

			return {
				n: category.name,
				w: category.weight,
				p: detectedPrefix,
				r: category.records.map((record, index) => {
					const parsed = parseSequentialName(record.name);

					// Original expected name
					const defaultName =
						`${category.name} ${index + 1}`;

					if (record.name === defaultName) {
						return record.maxScore;
					}

					// Same prefix but custom numbering
					if (
						detectedPrefix &&
						parsed &&
						parsed.prefix === detectedPrefix
					) {
						return [
							parsed.number,
							record.maxScore,
						] as [number, number];
					}

					// Fully custom
					return [
						record.name,
						record.maxScore,
					] as [string, number];
				}),
			};
		}),
	};

	return LZString.compressToEncodedURIComponent(
		JSON.stringify(data)
	);
}

export function GradeCalculator({
	template,
}: {
	template?: CourseDetails;
}) {
	const [course, setCourse] = useState<CourseDetails | null>(template ?? null);

	return (
		<div className="space-y-4">
			<CourseDetailsForm
				className="max-w-3xl mx-auto"
				setCourse={setCourse}
				course={course}
			/>
			{
				course && (
					<ScoreInput
						className="space-y-4 max-w-6xl mx-auto"
						course={course}
						setCourse={setCourse}
						key={course?.name + "-" + course.categories.map(cc => cc.name + "_" + cc.weight)} // Reset form when course changes
					/>
				)
			}
		</div>
	)
}

/**
 * Course Setup Form
 * - Course Name
 * - Grading Categories
 */

const courseSetupSchema = z.object({
	name: z.string().min(1, "Course name is required"),
	categories: z.array(z.object({
		name: z.string().min(1, "Category name is required"),
		weight: z.number({
			error: "Weight must be a number",
		}).min(1, "Weight must at least 1").max(100, "Weight cannot exceed 100"),
	}))
		.min(1, "At least one category is required")
		.superRefine((categories, context) => {
			const firstIndexByName = new Map<string, number>();
			for (let index = 0; index < categories.length; index++) {
				const normalizedName = categories[index].name.trim().toLowerCase();
				if (!normalizedName) continue;
				const firstIndex = firstIndexByName.get(normalizedName);
				if (firstIndex === undefined) {
					firstIndexByName.set(normalizedName, index);
					continue;
				}
				context.addIssue({
					code: "custom",
					message: "Category names must be unique",
					path: [index, "name"],
				});
				context.addIssue({
					code: "custom",
					message: "Category names must be unique",
					path: [firstIndex, "name"],
				});
			}
		}),
}).refine(course => {
	// Ensure total weight of categories equals 100
	const totalWeight = course.categories.reduce((sum, category) => sum + category.weight, 0);
	return totalWeight === 100;
}, { error: "Total weight of all categories must equal 100%", path: ["categories"] });


function CourseDetailsForm({
	className,
	course,
	setCourse,
}: {
	className?: string;
	course: CourseDetails | null;
	setCourse: Dispatch<SetStateAction<CourseDetails | null>>;
}) {
	const [openWarning, setOpenWarning] = useState<boolean>(false);

	const courseSetupForm = useForm({
		resolver: zodResolver(courseSetupSchema),
		reValidateMode: "onSubmit",
		defaultValues: {
			name: "",
			categories: [{
				name: "",
				weight: 0,
			}],
		},
	});

	useEffect(() => {
		if (!course) return

		courseSetupForm.reset({
			name: course.name,
			categories: course.categories.map(category => ({
				name: category.name,
				weight: category.weight,
			})),
		})
	}, [course, courseSetupForm])

	const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
		control: courseSetupForm.control,
		name: "categories",
	});
	const { errors } = useFormState({
		control: courseSetupForm.control,
		exact: false,
	});
	const categories = useWatch({
		control: courseSetupForm.control,
		name: "categories",
	}) ?? [];

	const handleCourseDetailsChange = () => {
		const data = courseSetupForm.getValues();

		setCourse({
			name: data.name,
			categories: data.categories.map(category => ({
				name: category.name,
				weight: category.weight,
				records: [{
					name: category.name + " 1",
					score: 0,
					maxScore: 100,
				}],
			})),
		});
	}

	const onSubmit = () => {
		if (course) {
			setOpenWarning(true);
		} else {
			handleCourseDetailsChange();
		}
	}

	return (
		<>
			<form onSubmit={courseSetupForm.handleSubmit(onSubmit)}>
				<Card className={className}>
					<CardHeader>
						<CardTitle>Course Setup</CardTitle>
						<CardDescription>
							Define your grading criteria and category weights
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Controller
							control={courseSetupForm.control}
							name="name"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Course Name</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
								</Field>
							)}
						/>
						<Controller
							control={courseSetupForm.control}
							name="categories"
							render={({ fieldState }) => (
								<div
									className={cn(
										"bg-muted border border-dashed p-4 rounded-lg",
										fieldState.invalid ? "border-destructive" : ""
									)}
								>
									<FieldLabel className={cn(fieldState.invalid && "text-destructive")}>Grading Categories</FieldLabel>
									<div className="mt-2 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-2">
										{categoryFields.map((category, index) => (
											(() => {
												const categoryNameError = errors.categories?.[index]?.name;
												const categoryWeightError = errors.categories?.[index]?.weight;
												const isCategoryInvalid = Boolean(categoryNameError || categoryWeightError);
												const isNameOnlyInvalid = Boolean(categoryNameError && !categoryWeightError);

												return (
													<div
														key={category.id}
														className={cn(
															"grid grid-cols-subgrid col-span-2 sm:col-span-3 gap-x-2 gap-y-1",
															isCategoryInvalid
																? "row-span-3"
																: "row-span-2",
														)}
													>
														<Controller
															control={courseSetupForm.control}
															name={`categories.${index}.name`}
															render={({ field, fieldState }) => (
																<Field data-invalid={fieldState.invalid} className={cn("grid grid-rows-subgrid max-sm:col-span-2", fieldState.error ? "row-span-3" : "row-span-2")}>
																	<FieldLabel htmlFor={field.name}>Category #{index + 1} Name</FieldLabel>
																	<Input
																		{...field}
																		id={field.name}
																		aria-invalid={fieldState.invalid}
																	/>
																	{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
																</Field>
															)}
														/>
														<Controller
															control={courseSetupForm.control}
															name={`categories.${index}.weight`}
															render={({ field, fieldState }) => (
																<Field data-invalid={fieldState.invalid} className={cn("w-full sm:w-44 grid grid-rows-subgrid", fieldState.error ? "row-span-3" : "row-span-2")}>
																	<FieldLabel htmlFor={field.name}>Weight (%)</FieldLabel>
																	<InputGroup aria-invalid={fieldState.invalid}>
																		<InputGroupInput
																			value={(field.value || 0).toString()}
																			onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
																			id={field.name}
																			aria-invalid={fieldState.invalid}
																			ref={field.ref}
																		/>
																		<InputGroupAddon align="inline-end">
																			<PercentIcon />
																		</InputGroupAddon>
																	</InputGroup>
																	{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
																</Field>
															)}
														/>
														<div className={cn(
															"grid grid-rows-subgrid gap-2",
															isCategoryInvalid
																? "row-span-3"
																: "row-span-2",
															isNameOnlyInvalid
															&& "max-sm:row-span-2",
														)}>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		className="mt-auto row-2"
																		variant="destructive"
																		onClick={() => removeCategory(index)}
																		size="icon"
																		type="button"
																		disabled={categoryFields.length === 1}
																		suppressHydrationWarning
																	>
																		<MinusIcon />
																	</Button>
																</TooltipTrigger>
																<TooltipContent collisionPadding={15}>
																	Remove Category
																</TooltipContent>
															</Tooltip>
														</div>
													</div>
												);
											})()
										))}
									</div>
									<Button
										className="w-full mt-4"
										onClick={() => appendCategory({ name: "", weight: 0 })}
										type="button"
										variant="outline"
									>
										<PlusIcon />
										Add Category
									</Button>
									<p className="text-sm text-muted-foreground mt-2">
										Total Weight: <span
											className={cn(
												"font-semibold",
												categories.reduce((sum, category) => sum + (category.weight || 0), 0) === 100
													? "text-accent"
													: "text-destructive",
											)}
										>
											{categories.reduce((sum, category) => sum + (category.weight || 0), 0)}%
										</span>
									</p>
									{fieldState.error && (<FieldError errors={[fieldState.error.root]} />)}
								</div>
							)}
						/>
					</CardContent>
					<CardFooter className="flex-col gap-2 items-start">
						<Button type="submit" className="w-full">
							<SaveIcon />
							Save Course Setup
						</Button>
						<div className="text-sm text-muted-foreground">
							Note: The total weight of all categories must equal 100% to calculate your class standing.
						</div>
					</CardFooter>
				</Card>
			</form>
			<AlertDialog open={openWarning} onOpenChange={setOpenWarning}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Warning</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to change the course setup? This will reset all your entered scores and calculated class standing. Make sure to save your current scores if you want to keep a record of them.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setOpenWarning(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setOpenWarning(false);
								handleCourseDetailsChange();
							}}
						>
							Proceed
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

const scoreInputSchema = z.object({
	categories: z.array(z.object({
		name: z.string().min(1, "Category name is required"),
		weight: z.number({
			error: "Weight must be a number",
		}).min(1, "Weight must at least 1").max(100, "Weight cannot exceed 100"),
		records: z.array(z.object({
			name: z.string().min(1, "Record name is required"),
			score: z.number({
				error: "Score must be a number",
			}).min(0, "Score cannot be negative"),
			maxScore: z.number({
				error: "Max score must be a number",
			}).min(1, "Max score must be at least 1"),
		})).superRefine((records, context) => {
			// Ensure that record names within the same category are unique
			const firstIndexByName = new Map<string, number>();
			for (let index = 0; index < records.length; index++) {
				const normalizedName = records[index].name.trim().toLowerCase();
				if (!normalizedName) continue;
				const firstIndex = firstIndexByName.get(normalizedName);
				if (firstIndex === undefined) {
					firstIndexByName.set(normalizedName, index);
					continue;
				}
				context.addIssue({
					code: "custom",
					message: "Record names within the same category must be unique",
					path: [index, "name"],
				});
				context.addIssue({
					code: "custom",
					message: "Record names within the same category must be unique",
					path: [firstIndex, "name"],
				});
			}
		}).superRefine((records, context) => {
			// Ensure that scores do not exceed max scores
			records.forEach((record, index) => {
				if (record.score > record.maxScore) {
					context.addIssue({
						code: "custom",
						message: "Score cannot exceed max score",
						path: [index, "score"],
					});
				}
			});
		}),
	})),
});

function useIsVisible(ref: RefObject<HTMLDivElement | null>) {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting)
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			observer.disconnect(); // Clean up on unmount
		};
	}, [ref]);

	return isIntersecting;
}

function ScoreInput({
	className,
	course,
	setCourse,
}: {
	className?: string;
	course: CourseDetails;
	setCourse: Dispatch<SetStateAction<CourseDetails | null>>;
}) {
	const [showResults, setShowResults] = useState<boolean>(false);
	const [calculatedGrade, setCalculatedGrade] = useState<number | null>(null);
	const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(false);
	const calcuDetailsRef = useRef<HTMLDivElement>(null);
	const isCalcuDetailsVisible = useIsVisible(calcuDetailsRef);

	const scoreInputForm = useForm<z.infer<typeof scoreInputSchema>>({
		resolver: zodResolver(scoreInputSchema),
		reValidateMode: "onSubmit",
		defaultValues: {
			categories: course.categories.map(category => ({
				name: category.name,
				weight: category.weight,
				records: category.records.map(record => ({
					name: record.name,
					score: record.score,
					maxScore: record.maxScore,
				})),
			})),
		},
	});

	const { fields: categoryFields } = useFieldArray({
		control: scoreInputForm.control,
		name: "categories",
	});

	const { errors } = useFormState({
		control: scoreInputForm.control,
		exact: false,
	});

	const handleFieldChange = () => {
		setShowResults(false);
		setCalculatedGrade(null);
		setShowCalculationDetails(false);
	};

	const onSubmit = (data: z.infer<typeof scoreInputSchema>) => {
		const updatedCourse: CourseDetails = {
			...course,
			categories: course.categories.map((category, categoryIndex) => ({
				...category,
				records: data.categories[categoryIndex].records.map(record => ({
					name: record.name,
					score: record.score,
					maxScore: record.maxScore,
				})),
			})),
		};
		setCourse(updatedCourse);
		setShowResults(true);
		setCalculatedGrade(updatedCourse.categories.reduce((overallGrade, category) => {
			const totalScore = category.records.reduce((sum, record) => sum + record.score, 0);
			const totalMaxScore = category.records.reduce((sum, record) => sum + record.maxScore, 0);
			const weightedScores = totalMaxScore > 0 ? (totalScore / totalMaxScore) * category.weight : 0;
			return overallGrade + weightedScores;
		}, 0));
	}

	const handleShare = async () => {
		const data = scoreInputForm.getValues()

		const encoded = serializeCourse({
			name: course.name,
			categories: data.categories
		})

		const url = new URL(window.location.href)

		url.searchParams.set("template", encoded)

		await navigator.clipboard.writeText(
			url.toString()
		)

		toast.success("Share link copied to clipboard.", {
			icon: <Share2Icon className="size-4" />
		});
	}

	return (
		<div className={className}>
			<div className="space-y-1">
				<h1 className="text-2xl font-bold">{course.name}</h1>
				<p className="text-sm text-muted-foreground">
					Input your scores for each category to calculate your current class standing.
				</p>
			</div>
			<Separator />
			<form className="gap-4 flex flex-col md:flex-row items-start" onSubmit={scoreInputForm.handleSubmit(onSubmit)}>
				<section className="space-y-4 w-full">
					{categoryFields.map((category, index) => (
						<RecordInput
							key={category.id}
							category={category}
							index={index}
							scoreInputForm={scoreInputForm}
							errors={errors}
							handleFieldChange={handleFieldChange}
						/>
					))}
				</section>
				<Separator className="sm:hidden" />
				<section className="sticky top-16 xl:top-4 w-full md:w-4xl space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>
								Category Breakdown
							</CardTitle>
							<CardDescription>
								Summary of category totals, weights, and each category&apos;s impact on your overall grade.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Category</TableHead>
										<TableHead className="text-right">Total <span className="text-muted-foreground text-sm">/</span> Max Total</TableHead>
										<TableHead className="text-right">Weight</TableHead>
										<TableHead className="text-right max-sm:w-28 max-sm:whitespace-normal">Weighted Impact (%)</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{
										course.categories.map((category, index) => {
											const totalScore = category.records.reduce((sum, record) => sum + record.score, 0);
											const totalMaxScore = category.records.reduce((sum, record) => sum + record.maxScore, 0);
											const weightedScores = totalMaxScore > 0 ? (totalScore / totalMaxScore) * category.weight : 0;

											return (
												<TableRow key={index}>
													<TableCell className="whitespace-normal">{category.name}</TableCell>
													<TableCell className="text-right">
														<span className="font-mono">{(totalScore).toLocaleString()}</span>
														<span className="text-muted-foreground text-sm">/</span>
														<span className="font-mono">{(totalMaxScore).toLocaleString()}</span>
													</TableCell>
													<TableCell className="text-right font-mono">{category.weight}%</TableCell>
													<TableCell className="text-right font-mono max-sm:w-24">{weightedScores.toFixed(2)}%</TableCell>
												</TableRow>
											)
										})
									}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex-col gap-2 items-center justify-center md:flex-row md:justify-start">
							<Button
								type="submit"
								className="max-md:w-full md:flex-1"
							>
								<CalculatorIcon />
								Calculate Class Standing
							</Button>
							<Button
								type="button"
								variant="outline"
								className="max-md:w-full md:flex-1"
								onClick={handleShare}
								suppressHydrationWarning
							>
								<Share2Icon />
								Share Template
							</Button>
						</CardFooter>
					</Card>
					{
						(calculatedGrade !== null && showResults) ? (
							<>
								<div
									className={cn(
										"border border-current rounded-lg p-4 w-full",
										Number(getTransmutatedGrade(calculatedGrade)) <= 1.25 ? "bg-green-100 dark:bg-green-500/30 border-green-300 dark:border-green-700/30 text-green-900 dark:text-green-50" :
											Number(getTransmutatedGrade(calculatedGrade)) <= 1.75 ? "bg-lime-100 dark:bg-lime-500/30 border-lime-300 dark:border-lime-700/30 text-lime-900 dark:text-lime-50" :
												Number(getTransmutatedGrade(calculatedGrade)) <= 2.50 ? "bg-yellow-100 dark:bg-yellow-500/30 border-yellow-300 dark:border-yellow-700/30 text-yellow-900 dark:text-yellow-50" :
													Number(getTransmutatedGrade(calculatedGrade)) <= 3.00 ? "bg-amber-100 dark:bg-amber-500/30 border-amber-300 dark:border-amber-700/30 text-amber-900 dark:text-amber-50" :
														"bg-destructive/50 dark:bg-destructive/30 border-destructive dark:border-destructive/30 text-destructive-foreground"
									)}
								>
									<h2 className="text-lg font-semibold">Current Class Standing</h2>
									<p className="text-sm text-current/65 mb-4">
										Your grade for the course is...
									</p>
									<div className="flex max-sm:flex-col sm:items-baseline sm:gap-2">
										<span className="text-4xl font-bold font-mono">
											{calculatedGrade !== null ? `${calculatedGrade.toFixed(2)}%` : "N/A"}
										</span>
										<span className="text-sm text-current/65">
											or
										</span>
										<span className="flex items-center gap-2">
											<span className="text-4xl font-bold font-mono">
												{calculatedGrade !== null
													? getTransmutatedGrade(calculatedGrade)
													: "N/A"
												}
											</span>
											{
												calculatedGrade !== null && (
													Number(getTransmutatedGrade(calculatedGrade)) <= 1.25 ? <PartyPopperIcon className="inline text-inherit size-6" /> :
														Number(getTransmutatedGrade(calculatedGrade)) <= 1.75 ? <StarsIcon className="inline text-inherit size-6" /> :
															Number(getTransmutatedGrade(calculatedGrade)) <= 2.50 ? <SparkleIcon className="inline text-inherit size-6" /> :
																Number(getTransmutatedGrade(calculatedGrade)) <= 3.00 ? <TrendingUpDownIcon className="inline text-inherit size-6" /> :
																	<TriangleAlertIcon className="inline text-inherit size-6" />
												)
											}
										</span>
									</div>

									<p className="text-sm">
										{
											Number(getTransmutatedGrade(calculatedGrade)) <= 1.25 ? "Excellent work! Keep it up!" :
												Number(getTransmutatedGrade(calculatedGrade)) <= 1.75 ? "Great job! You're doing well." :
													Number(getTransmutatedGrade(calculatedGrade)) <= 2.50 ? "Good effort! There's room for improvement." :
														Number(getTransmutatedGrade(calculatedGrade)) <= 3.00 ? "You're passing, but consider focusing more on your studies." :
															"Unfortunately, you're at risk of failing. Seek help and work hard to improve."
										}
									</p>
									<Button
										variant="ghost"
										className="w-full mt-4"
										onClick={() => {
											setShowCalculationDetails(prev => !prev)

											if (!showCalculationDetails) {
												setTimeout(() => {
													if (isCalcuDetailsVisible || !calcuDetailsRef.current) return;

													calcuDetailsRef.current?.scrollIntoView({
														behavior: "smooth",
														block: 'start',
													})
												}, 500)
											}
										}}
									>
										<EyeIcon />
										How is this calculated?
									</Button>
								</div>
								<Alert variant="destructive" className="mt-4">
									<TriangleAlertIcon />
									<AlertTitle>Important Note</AlertTitle>
									<AlertDescription>
										Estimated class standing based on your entered scores. Actual grades may vary depending on your instructor&apos;s grading policies.
									</AlertDescription>
								</Alert>
							</>
						) : null
					}
				</section>
			</form>
			{
				(showResults && calculatedGrade !== null && showCalculationDetails) && (
					<Card ref={calcuDetailsRef}>
						<CardHeader>
							<CardTitle>Calculation Details</CardTitle>
							<CardDescription>
								Your final grade is calculated by applying each category&apos;s weight to your score and adding the weighted scores together.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div>
								<span className="max-sm:text-sm">GWA</span> ={" "}
								<span>
									Σ((<span className="inline-block relative align-middle text-center">
										<span className="p-0.5 max-sm:w-24 max-sm:block max-sm:text-xs max-sm:mx-auto">Total Score in Category</span>
										<Separator className="bg-current" />
										<span className="p-0.5 max-sm:w-32 max-sm:block max-sm:text-xs max-sm:mx-auto">Total Max Score in Category</span>
									</span>) × <span className="inline-block relative align-middle text-center"><span className="max-sm:text-xs max-sm:inline-block max-sm:w-14 max-sm:text-center">Category Weight</span></span>)
								</span>
							</div>
							<h2 className="text-lg font-semibold">Solution</h2>
							<ol className="list-decimal list-inside space-y-2">
								<li>
									Calculate how much of the available points you earned in each category.
									<ol className="list-decimal list-inside ml-4 sm:ml-6 space-y-1">
										{course.categories.map((category, index) => {
											const totalScore = category.records.reduce((sum, record) => sum + record.score, 0);
											const totalMaxScore = category.records.reduce((sum, record) => sum + record.maxScore, 0);

											return (
												<li key={index}>
													{category.name}: <span className="max-sm:block">(<span className="inline-block relative align-middle text-center">
														<span className="relative inline-flex justify-center pt-9 sm:pt-4 sm:w-full sm:min-w-64 p-0.5">
															<span className="absolute top-1 text-xs text-muted-foreground max-sm:w-34">
																Total Scores for all records in this category
															</span>
															<span className="tabular-nums font-mono">{totalScore}</span>
														</span>
														<Separator className="bg-current" />
														<span className="flex flex-col justify-center p-0.5">
															<span className="font-mono tabular-nums">
																{totalMaxScore}
															</span>
															<span className="text-xs text-muted-foreground max-sm:w-44">
																Total Max Scores for all records in this category
															</span>
														</span>
													</span>) × <span className="tabular-nums font-mono">{category.weight.toFixed(2)}</span>%</span>
												</li>
											)
										})}
									</ol>
								</li>
								<li>
									Multiply each category score by its corresponding weight in the course&apos;s grading system.
									<ol className="list-decimal list-inside ml-6 space-y-1">
										{course.categories.map((category, index) => {
											const percentageScore = category.records.reduce((sum, record) => sum + record.score, 0) / category.records.reduce((sum, record) => sum + record.maxScore, 0);
											const weightedScores = percentageScore * category.weight;

											return (
												<li key={index} className="pl-5 -indent-5">
													{category.name}: <span className="tabular-nums font-mono">{percentageScore.toFixed(3)}</span>% × <span className="tabular-nums font-mono">{category.weight.toFixed(2)}</span>% = <span className="tabular-nums font-mono">{weightedScores.toFixed(2)}</span>%
												</li>
											)
										})}
									</ol>
								</li>
								<li>
									Add the weighted scores and convert the result using the NEUST grading scale.<br />
									<span className="inline-flex items-baseline gap-1 sm:w-fit flex-wrap">
										{(() => {
											return (
												<span className="inline-block relative align-middle text-center">
													<span className="p-0.5">
														{course.categories.map((category, index) => {
															const percentageScore = category.records.reduce((sum, record) => sum + record.score, 0) / category.records.reduce((sum, record) => sum + record.maxScore, 0);
															const weightedScores = percentageScore * category.weight;

															return (
																<Fragment key={index}>
																	<span className="tabular-nums font-mono">{weightedScores.toFixed(2)}</span>%
																	{index < course.categories.length - 1 ? ' + ' : ''}
																</Fragment>
															)
														})}
													</span>
												</span>
											)
										})()} = <span className={cn(
											"inline border-current rounded-lg px-2 py-0.5",
											Number(getTransmutatedGrade(calculatedGrade)) <= 1.25 ? "bg-green-100 dark:bg-green-500/30 border-green-300 dark:border-green-700/30 text-green-900 dark:text-green-50" :
												Number(getTransmutatedGrade(calculatedGrade)) <= 1.75 ? "bg-lime-100 dark:bg-lime-500/30 border-lime-300 dark:border-lime-700/30 text-lime-900 dark:text-lime-50" :
													Number(getTransmutatedGrade(calculatedGrade)) <= 2.50 ? "bg-yellow-100 dark:bg-yellow-500/30 border-yellow-300 dark:border-yellow-700/30 text-yellow-900 dark:text-yellow-50" :
														Number(getTransmutatedGrade(calculatedGrade)) <= 3.00 ? "bg-amber-100 dark:bg-amber-500/30 border-amber-300 dark:border-amber-700/30 text-amber-900 dark:text-amber-50" :
															"bg-destructive/50 dark:bg-destructive/30 border-destructive dark:border-destructive/30 text-destructive-foreground"
										)}>
											<span className="tabular-nums font-mono font-bold">{calculatedGrade.toFixed(2)}</span>% or <span className="tabular-nums font-mono font-bold">{getTransmutatedGrade(calculatedGrade)}</span>
										</span>  = Final Grade
									</span>
								</li>
								<span className="block">You can see how the NEUST grading scale in our <Link href="/#system-of-grading" className="underline underline-offset-4">System of Grading</Link> section in the home page.</span>
							</ol>
						</CardContent>
					</Card>
				)
			}
		</div>
	)
}

function getTransmutatedGrade(percentage: number): string {
	if (percentage >= 96.64) return "1.00";
	if (percentage >= 93.31) return "1.25";
	if (percentage >= 89.98) return "1.50";
	if (percentage >= 86.65) return "1.75";
	if (percentage >= 83.32) return "2.00";
	if (percentage >= 79.99) return "2.25";
	if (percentage >= 76.66) return "2.50";
	if (percentage >= 73.33) return "2.75";
	if (percentage >= 70) return "3.00";
	return "5.00";
}

function parseSequentialName(name: string) {
	const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?)$/);

	if (!match) {
		return null;
	}

	return {
		prefix: match[1],
		number: Number(match[2]),
	};
}

function getNextSequentialRecordName(
	categoryName: string,
	records: { name: string }[]
) {
	const prefixCounts = new Map<string, number>();

	for (const record of records) {
		const parsed = parseSequentialName(record.name);

		if (!parsed) continue;

		prefixCounts.set(
			parsed.prefix,
			(prefixCounts.get(parsed.prefix) ?? 0) + 1
		);
	}

	const detectedPrefix =
		[...prefixCounts.entries()]
			.sort((a, b) => b[1] - a[1])[0]?.[0]
		?? categoryName;

	let highestNumber = 0;
	let step = 1;

	for (const record of records) {
		const parsed = parseSequentialName(record.name);

		if (
			parsed &&
			parsed.prefix === detectedPrefix
		) {
			highestNumber = Math.max(
				highestNumber,
				parsed.number
			);

			const decimalPart =
				parsed.number.toString().split(".")[1];

			if (decimalPart) {
				step = Math.max(
					step,
					1 / Math.pow(10, decimalPart.length)
				);
			}
		}
	}

	return `${detectedPrefix} ${highestNumber + step}`;
}

function RecordInput({
	category,
	index,
	scoreInputForm,
	errors,
	handleFieldChange,
}: {
	category: z.infer<typeof scoreInputSchema>["categories"][number];
	index: number;
	scoreInputForm: ReturnType<typeof useForm<z.infer<typeof scoreInputSchema>>>;
	errors: UseFormStateReturn<z.infer<typeof scoreInputSchema>>["errors"];
	handleFieldChange: () => void;
}) {
	const { fields: recordFields, append: appendRecord, remove: removeRecord } = useFieldArray({
		control: scoreInputForm.control,
		name: `categories.${index}.records`,
	});

	const handleAppendRecord = () => {
		handleFieldChange();
		const nextName = getNextSequentialRecordName(
			category.name,
			recordFields
		);
		appendRecord({ name: nextName, score: 0, maxScore: 100 }, { shouldFocus: false })
	}

	return (
		<Collapsible className="bg-card text-card-foreground border rounded-lg p-4 @container" defaultOpen>
			<CollapsibleTrigger className="flex items-center gap-2 w-full">
				<div className="flex items-center justify-between gap-2 flex-1">
					<div className="flex items-baseline gap-1 overflow-hidden">
						<h2 className="text-lg font-semibold line-clamp-1 truncate block">
							{category.name}
						</h2>
						{" "}
						<span className="text-sm text-muted-foreground">({category.weight}%)</span>
						{" "}
					</div>
					<Badge variant={recordFields.length > 0 ? "default" : "destructive"}>
						{
							recordFields.length > 0
								? `${recordFields.reduce((sum, record) => sum + record.score, 0).toLocaleString()} / ${recordFields.reduce((sum, record) => sum + record.maxScore, 0).toLocaleString()}`
								: "No scores yet"
						}
					</Badge>
				</div>
				<ChevronsUpDownIcon className="size-4 text-muted-foreground" />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<p className="text-sm text-muted-foreground">
					Input your scores for each record in the {category.name} category.
				</p>
				<div className="flex justify-end">
					<Button
						onClick={handleAppendRecord}
						type="button"
						variant="outline"
					>
						<PlusIcon />
						Add Record
					</Button>
				</div>
				<div className="grid grid-cols-[1fr_1fr_auto] @sm:grid-cols-[1fr_auto_auto_auto] gap-4 @md:gap-2 my-4">
					<div className="grid grid-cols-subgrid col-span-4 gap-2 @max-sm:hidden">
						<span className="text-sm text-muted-foreground">Record Name</span>
						<span className="text-sm text-muted-foreground text-right">Score</span>
						<span className="text-sm text-muted-foreground text-right">Max Score</span>
					</div>
					{
						recordFields.map((field, recordIndex) => {
							const recordNameError = errors.categories?.[index]?.records?.[recordIndex]?.name;
							const recordScoreError = errors.categories?.[index]?.records?.[recordIndex]?.score || errors.categories?.[index]?.records?.[recordIndex]?.maxScore;
							const isRecordInvalid = Boolean(recordNameError || recordScoreError);
							const isNameOnlyInvalid = Boolean(recordNameError && !recordScoreError);

							return (
								<div key={field.id} className="grid grid-cols-subgrid col-span-4 gap-2">
									<Controller
										control={scoreInputForm.control}
										name={`categories.${index}.records.${recordIndex}.name`}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid} className={cn("grid grid-rows-subgrid @max-sm:col-span-3", fieldState.invalid && "row-span-2")}>
												<Input
													{...field}
													id={field.name}
													aria-invalid={fieldState.invalid}
													placeholder={`Record #${recordIndex + 1} Name`}
													onChange={e => {
														handleFieldChange();
														field.onChange(e.target.value);
													}}
												/>
												{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
											</Field>
										)}
									/>
									<div className={cn(
										"grid grid-cols-2 col-span-2 grid-rows-subgrid gap-2 @sm:max-w-56",
										recordScoreError && "row-span-2",
									)}>
										<Controller
											control={scoreInputForm.control}
											name={`categories.${index}.records.${recordIndex}.score`}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid} className={cn("grid grid-rows-subgrid", fieldState.error && "row-span-2")}>
													<Input
														{...field}
														id={field.name}
														aria-invalid={fieldState.invalid}
														placeholder="Score"
														className="text-right"
														onChange={e => {
															handleFieldChange();
															field.onChange(e.target.value === "" ? "" : Number(e.target.value))
														}}
													/>
													{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
												</Field>
											)}
										/>
										<Controller
											control={scoreInputForm.control}
											name={`categories.${index}.records.${recordIndex}.maxScore`}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid} className={cn("grid grid-rows-subgrid", fieldState.invalid && "row-span-2")}>
													<Input
														{...field}
														id={field.name}
														aria-invalid={fieldState.invalid}
														placeholder="Max Score"
														className="text-right"
														onChange={e => {
															handleFieldChange();
															field.onChange(e.target.value === "" ? "" : Number(e.target.value))
														}}
													/>
													{fieldState.error && (<FieldError errors={[fieldState.error]} />)}
												</Field>
											)}
										/>
									</div>
									<div className={cn(
										"grid grid-rows-subgrid gap-2",
										isRecordInvalid && "row-span-2",
										isNameOnlyInvalid && "@max-sm:row-span-1",
									)}>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="destructive"
													onClick={() => {
														handleFieldChange();
														removeRecord(recordIndex)
													}}
													size="icon"
													type="button"
													disabled={recordFields.length === 1}
													suppressHydrationWarning
												>
													<MinusIcon />
												</Button>
											</TooltipTrigger>
											<TooltipContent collisionPadding={15}>
												Remove Record
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							)
						})
					}
				</div>
				<div className="flex justify-end">
					<Button
						onClick={handleAppendRecord}
						type="button"
						variant="outline"
					>
						<PlusIcon />
						Add Record
					</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}