"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollSpy, ScrollSpyLink, ScrollSpyNav, ScrollSpySection, ScrollSpyViewport } from "@/components/ui/scroll-spy"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils";
import { AlertCircleIcon, CalculatorIcon, GraduationCapIcon, PenLineIcon, ScaleIcon, ScrollTextIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";

export function AcadsInfo() {
	const isMobile = useIsMobile();
	
	return (
		<>
		<h2 className="text-left text-3xl font-semibold tracking-tight w-full max-w-4xl mt-6">
				Information related to Academics in NEUST
			</h2>
			<ScrollSpy
				className="w-full max-w-4xl flex gap-6"
				offset={isMobile ? 120 : 80}
				orientation={isMobile ? 'vertical' : 'horizontal'}
			>
				<ScrollSpyNav className="sticky top-15 md:top-20 h-fit z-50 bg-card text-card-foreground p-2 rounded-lg border shadow *:data-[state=active]:text-accent-foreground overflow-x-auto *:max-md:whitespace-nowrap md:max-w-48 *:[&_svg]:size-4 *:[&_svg]:shrink-0 *:flex *:items-center *:justify-start *:gap-2">
					<ScrollSpyLink value="system-of-grading"><CalculatorIcon /> System of Grading</ScrollSpyLink>
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

					<ScrollSpySection value="system-of-grading" className="scroll-mt-15 md:scroll-mt-20">
						<h3 className="text-2xl font-semibold tracking-tight">
							System of Grading
						</h3>
						<p>
							NEUST employs a <span className="font-semibold">5-point grading system</span> to evaluate student performance in their courses. However, their precentage equivalents and descriptions <span className="font-semibold">vary depending on the professor</span> but it appears that they commonly follow the table below starting at 70% and above for passing grades.
						</p>
						<Alert>
							<AlertCircleIcon />
							<AlertTitle>Note</AlertTitle>
							<AlertDescription className="md:text-wrap">
								The table below represents common equivalents but is not definitive for all courses or instructors.
							</AlertDescription>
						</Alert>
						<Table>
							<TableCaption>
								Common Precentage Equivalents for NEUST&apos;s 5-Point Grading System
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>
										5-Point Scale
									</TableHead>
									<TableHead>
										Percentage Scale (with Passing Grades starting at 70%)
									</TableHead>
									<TableHead>
										Description
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="**:text-wrap">
								{(() => {
									const gradingSystem = [
										{ point: '1.00', percentage: '96.64% - 100.00%', description: 'Excellent' },
										{ point: '1.25', percentage: '93.31% - 96.63%', description: 'Excellent' },
										{ point: '1.50', percentage: '89.98% - 93.30%', description: 'Very Good' },
										{ point: '1.75', percentage: '86.65% - 89.97%', description: 'Very Good' },
										{ point: '2.00', percentage: '83.32% - 86.64%', description: 'Good' },
										{ point: '2.25', percentage: '79.99% - 83.31%', description: 'Good' },
										{ point: '2.50', percentage: '76.66% - 79.98%', description: 'Satisfactory' },
										{ point: '2.75', percentage: '73.33% - 76.65%', description: 'Satisfactory' },
										{ point: '3.00', percentage: '70.00% - 73.32%', description: 'Passing' },
										{ point: '4.00', percentage: '69.00% - 69.00%', description: 'Conditional', state: 1 },
										{ point: '5.00', percentage: 'Below 69.00%', description: 'Failure', state: 2 },
										{ point: 'INC', percentage: 'N/A', description: 'Incomplete', state: 1 },
										{ point: 'UD', percentage: 'N/A', description: 'Unofficially Dropped', state: 2 },
										{ point: 'OD', percentage: 'N/A', description: 'Officially Dropped', state: 2 },
									];

									return gradingSystem.map((grade, index) => (
										<TableRow
											key={index}
											className={cn(
												grade.state === 1 && "bg-amber-600/10 hover:bg-amber-600/20 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 text-amber-600 border-amber-600/30",
												grade.state === 2 && "bg-destructive/10 hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 text-destructive border-destructive/30",
											)}
										>
											<TableCell>{grade.point}</TableCell>
											<TableCell>{grade.percentage}</TableCell>
											<TableCell>{grade.description}</TableCell>
										</TableRow>
									));
								})()}
							</TableBody>
						</Table>
						<p className="-indent-10 pl-10 md:-indent-15 md:pl-15">
							<span className="font-bold">4.00 / Conditional</span> — This grade indicates that a student has not yet completed all the requirements for a course. The student is given a &quot;removal&quot; exam, where passing it will convert the grade into a <span className="font-semibold">passing grade (3.00)</span> and nothing higher. If the student <span className="underline">does not pass the exam</span>, the grade automatically converts to <span className="font-semibold">5.00 / Failure</span>.
						</p>
						<p className="-indent-10 pl-10 md:-indent-15 md:pl-15">
							<span className="font-bold">INC / Incomplete</span> — This grade is given when a student has not completed all course requirements due to valid reasons, such as illness, but does have a passing grade at the time. The student must complete the requirements within a year to convert this grade into the earned grade. Failure to do so will result in the grade <span className="font-semibold">converting to the original earned grade</span>. For example, if a student has an INC with an earned grade of 2.00, failing to complete the requirements will convert the INC to 2.00. But if they completed the requirements and earned a 1.75, the INC would convert to 1.75.
						</p>
						<p className="-indent-10 pl-10 md:-indent-15 md:pl-15">
							<span className="font-bold">UD / Unofficially Dropped</span> — This grade is assigned to students by the professors who stop attending classes without formally dropping the course. It indicates that the student has withdrawn from the course without following the official procedures. The student will need to retake the course in the next academic year if they wish to complete it.
						</p>
						<p className="-indent-10 pl-10 md:-indent-15 md:pl-15">
							<span className="font-bold">OD / Officially Dropped</span> — This grade is given to students who officially drop a course <span className="font-semibold">before the mid-term examination</span> by the Office of Admission and Registration. It indicates that the student has formally withdrawn from the course without any academic penalty.
						</p>
					</ScrollSpySection>

					<ScrollSpySection value="latin-honors" className="scroll-mt-15 md:scroll-mt-20">
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
							<li>Must not have any grades below 2.00 (2.25 - 5.00) in any course.</li>
						</ul>
					</ScrollSpySection>

					<ScrollSpySection value="academic-distinction" className="scroll-mt-15 md:scroll-mt-20">
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

					<ScrollSpySection value="awards-comparison" className="scroll-mt-15 md:scroll-mt-20">
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
										Recognizes students who excel academically in a particular semester, highlighting consistent performance. This is not an award given during graduation, but rather a semester-based recognition. Additionally, <span className="font-semibold">not all departments may have this award and requirements may vary</span>.
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

					<ScrollSpySection value="retention" className="scroll-mt-15 md:scroll-mt-20">
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

					<ScrollSpySection value="changing-of-grades" className="scroll-mt-15 md:scroll-mt-20">
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
			</>
	)
}