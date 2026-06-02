import Logo from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
import { GradeCalculator } from "./grade-calculator";
import LZString from "lz-string";

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
    "darkreader-lock": "true",
    "theme-color": "#15ba81",
    "apple-mobile-web-app-title": "Class Standing Calculator | GWA Buddy",
  },
};

export default async function ClassStandingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const template = (await searchParams).template as string | undefined
  const course = template ? deserializeCourse(template) : undefined

  return (
    <div className="space-y-4 p-4 min-h-dvh">
      <div className="flex flex-col items-center">
        <Link href="/"><Logo className="size-16 drop-shadow" /></Link>
        <Link href="/"><h1 className="text-4xl font-extrabold tracking-tight text-balance">GWA Buddy</h1></Link>
        <h2 className="text-2xl font-semibold text-accent">Class Standing Calculator</h2>
        <p className="text-center text-muted-foreground max-w-2xl leading-7">
          Calculate your class standing based on grading criteria, category weights, and activity scores. Track your performance in real time and instantly estimate your subject grade.
        </p>
      </div>

      <GradeCalculator template={course} />
    </div>
  );
}

function deserializeCourse(
  compressed: string
): CourseDetails {
  const decompressed =
    LZString.decompressFromEncodedURIComponent(compressed)

  if (!decompressed) {
    throw new Error("Invalid template")
  }

  const data = JSON.parse(decompressed) as {
    n: string
    c: {
      n: string
      w: number
      r: (number | [string, number])[]
    }[]
  }


  return {
    name: data.n,
    categories: data.c.map(category => ({
      name: category.n,
      weight: category.w,
      records: category.r.map((record, index) => {
        if (typeof record === "number") {
          return {
            name: `${category.n} ${index + 1}`,
            score: 0,
            maxScore: record,
          }
        }

        return {
          name: record[0],
          score: 0,
          maxScore: record[1],
        }
      }),
    })),
  }
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