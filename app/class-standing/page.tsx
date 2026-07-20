import { Metadata } from "next";
import Link from "next/link";
import { EncodedCourse, GradeCalculator } from "./grade-calculator";
import { decompressSync } from "fflate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Class Standing Calculator | GWA Buddy",
    description:
        "Calculate your class standing based on grading criteria, category weights, and activity scores. Track your performance in real time and instantly estimate your grade.",
    authors: [
        {
            name: "alecz.r",
            url: "https://aleczr.link",
        },
    ],
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://gwa.vps.aleczr.link",
    ),
    openGraph: {
        images: "/og-image.png",
    },
    other: {
        "apple-mobile-web-app-title": "Class Standing Calculator | GWA Buddy",
    },
};

export default async function ClassStandingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const template = (await searchParams).t as string | undefined;
    const course = template ? deserializeCourse(template) : undefined;

    return (
        <main className="space-y-4 p-4 min-h-dvh">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-accent">
                    Class Standing Calculator
                </h1>
                <p className="text-center text-muted-foreground max-w-2xl leading-7">
                    Calculate your class standing based on grading criteria and
                    activity scores. Track your performance in real time and
                    instantly estimate your subject grade.
                </p>
            </div>

            <Alert className="max-w-2xl mx-auto">
                <AlertCircleIcon />
                <AlertTitle>Contribute</AlertTitle>
                <AlertDescription className="md:text-wrap space-y-2">
                    <p>
                        Have suggestions for improvements? I&apos;d love to hear
                        from you!
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

            <Alert className="max-w-2xl mx-auto">
                <AlertCircleIcon />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription className="md:text-wrap space-y-2">
                    <p>
                        This calculator is intended for educational and
                        estimation purposes only. While every effort has been
                        made to ensure the accuracy of its calculations, the
                        results may differ from your official grade. Actual
                        grades may be affected by instructor-specific grading
                        policies, incentives, additional requirements, grade
                        adjustments, and other academic considerations not
                        accounted for by this calculator. The results should
                        only be used as a guide and should not be considered an
                        official grade or a substitute for consultation with
                        your instructor. The developer is not responsible for
                        any discrepancies or errors in the calculated results.
                        Use at your own discretion.
                    </p>
                </AlertDescription>
            </Alert>

            <GradeCalculator template={course} tFromUrl={template} />

            <footer className="italic text-xs text-center text-muted-foreground max-w-lg md:max-w-3xl mx-auto">
                Developed by <span className="font-mono">alecz.r</span>.
            </footer>
        </main>
    );
}

function deserializeCourse(encoded: string): CourseDetails {
    const compressed = Uint8Array.from(
        atob(encoded.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0),
    );

    const json = new TextDecoder().decode(decompressSync(compressed));

    const [courseName, categories, allowExtraCredit] = JSON.parse(
        json,
    ) as EncodedCourse;

    return {
        name: courseName,
        allowExtraCredit: allowExtraCredit ?? false,
        categories: categories.map(
            ([categoryName, weight, prefixes, records]) => ({
                name: categoryName,
                weight,
                records: records.map((record, index) => {
                    const type = record[0];

                    if (type === 0) {
                        return {
                            name: `${categoryName} ${index + 1}`,
                            maxScore: record[1],
                        };
                    }

                    if (type === 1) {
                        const [, prefixIndex, number, maxScore] = record;

                        return {
                            name: `${prefixes[prefixIndex]} ${number}`,
                            maxScore,
                        };
                    }

                    const [, name, maxScore] = record;

                    return {
                        name,
                        maxScore,
                    };
                }),
            }),
        ),
    };
}

type CourseDetails = {
    name: string;
    categories: CourseCategory[];
    allowExtraCredit?: boolean;
};

type CourseCategory = {
    name: string;
    weight: number;
    records: CourseCategoryRecord[];
};

type CourseCategoryRecord = {
    name: string;
    score?: number;
    maxScore: number;
};
