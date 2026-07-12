"use client";

import {
    useState,
    Fragment,
    useEffect,
    Dispatch,
    SetStateAction,
    useRef,
    RefObject,
    useMemo,
} from "react";
import { z } from "zod";
import {
    PDFDocument,
    PDFFont,
    PDFName,
    PDFObject,
    PDFPage,
    PDFString,
    rgb,
} from "pdf-lib";
import { CustomStyledText, drawTable } from "pdf-lib-draw-table-beta";
import fontkit from "@pdf-lib/fontkit";
import {
    Controller,
    useFieldArray,
    useForm,
    useFormState,
    UseFormStateReturn,
    useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    CalculatorIcon,
    ChevronDownIcon,
    ChevronsUpDownIcon,
    EyeIcon,
    InfoIcon,
    MinusIcon,
    PartyPopperIcon,
    PercentIcon,
    PlusIcon,
    SaveIcon,
    Share2Icon,
    SparkleIcon,
    StarsIcon,
    Trash2Icon,
    TrendingUpDownIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog-shadcn";
import Link from "next/link";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import {
    DrawTableOptions,
    TableDimensions,
} from "pdf-lib-draw-table-beta/build/types";
import { Checkbox } from "@/components/ui/checkbox";
import { confirm } from "@/components/confirm-dialog";
import { useDebounce } from "use-debounce";
import { compressSync } from "fflate";
import { Scroller } from "@/components/ui/scroller";
import {
    Tour,
    TourContent,
    TourHeader,
    TourTitle,
    TourDescription,
    TourProgressText,
    TourActions,
    TourStepType,
} from "@/components/ui/tour";

type CourseDetails = {
    name: string;
    categories: CourseCategory[];
    goalGrade?: string;
    isDemo?: boolean;
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

type CategorySummary = {
    name: string;
    totalScore: number;
    totalMaxScore: number;
    weight: number;
    percentageScore: number;
    weightedImpact: number;
    records: CourseCategoryRecord[];
};

type CalculationSnapshot = {
    courseName: string;
    generatedAt: string;
    overallPercentage: number;
    transmutatedGrade: string;
    templateEncoded: string;
    categorySummaries: CategorySummary[];
};

export type EncodedCourse = [string, EncodedCategory[], boolean?];

type EncodedCategory = [string, number, string[], EncodedRecord[]];

type EncodedRecord =
    | [0, number]
    | [1, number, number, number]
    | [2, string, number];

function extractSequentialName(name: string) {
    const match = name.trim().match(/^(.+?)\s+(\d+)$/);

    if (!match) {
        return null;
    }

    return {
        prefix: match[1].trim(),
        number: Number(match[2]),
    };
}

function serializeCourse(course: CourseDetails): string {
    const data: EncodedCourse = [
        course.name,

        course.categories.map((category) => {
            const prefixMap = new Map<string, number>();

            for (const record of category.records) {
                const parsed = extractSequentialName(record.name);

                if (!parsed) continue;

                const normalized = parsed.prefix.trim();

                if (!prefixMap.has(normalized)) {
                    prefixMap.set(normalized, prefixMap.size);
                }
            }

            const prefixes = [...prefixMap.keys()];

            const records: EncodedRecord[] = category.records.map(
                (record, index) => {
                    const defaultName = `${category.name} ${index + 1}`;

                    if (record.name === defaultName) {
                        return [0, record.maxScore];
                    }

                    const parsed = extractSequentialName(record.name);

                    if (parsed) {
                        const prefixIndex = prefixMap.get(parsed.prefix);

                        if (prefixIndex !== undefined) {
                            return [
                                1,
                                prefixIndex,
                                parsed.number,
                                record.maxScore,
                            ];
                        }
                    }

                    return [2, record.name, record.maxScore];
                },
            );

            return [category.name, category.weight, prefixes, records];
        }),
        course.allowExtraCredit ?? false,
    ];

    const json = JSON.stringify(data);

    const compressed = compressSync(new TextEncoder().encode(json), {
        level: 9,
    });

    return btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function simpleHash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(36).toUpperCase().padStart(4, "0");
}

function calculateCategorySummary(category: CourseCategory): CategorySummary {
    const totalScore = category.records
        .filter((record) => record.score !== undefined)
        .reduce((sum, record) => sum + record.score!, 0);
    const totalMaxScore = category.records.reduce(
        (sum, record) => sum + record.maxScore,
        0,
    );
    const percentageScore = totalMaxScore > 0 ? totalScore / totalMaxScore : 0;
    const weightedImpact = percentageScore * category.weight;

    return {
        name: category.name,
        totalScore,
        totalMaxScore,
        weight: category.weight,
        percentageScore,
        weightedImpact,
        records: category.records,
    };
}

function calculateCourseSnapshot(course: CourseDetails): CalculationSnapshot {
    const categorySummaries = course.categories.map(calculateCategorySummary);
    const overallPercentage = categorySummaries.reduce(
        (total, category) => total + category.weightedImpact,
        0,
    );

    return {
        courseName: course.name,
        generatedAt: new Date().toISOString(),
        overallPercentage,
        transmutatedGrade: getTransmutatedGrade(overallPercentage),
        templateEncoded: serializeCourse({
            name: course.name,
            allowExtraCredit: course.allowExtraCredit,
            categories: course.categories,
        }),
        categorySummaries,
    };
}

function sanitizeFilenameSegment(value: string) {
    return (
        value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "course"
    );
}

function formatScoreValue(value: number) {
    return Number.isInteger(value)
        ? value.toLocaleString()
        : value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
          });
}

function buildCourseInfoText(snapshot: CalculationSnapshot) {
    const generatedAt = new Date(snapshot.generatedAt).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return [
        `Course: ${snapshot.courseName}`,
        `Generated: ${generatedAt}`,
        `Class Standing: ${snapshot.overallPercentage.toFixed(2)}%`,
        `Equivalent Grade: ${snapshot.transmutatedGrade}`,
    ].join("\n");
}

function buildFormulaText(snapshot: CalculationSnapshot) {
    const lines = [
        "Overall Percentage = Sum of ((Total Score in Category / Total Max Score in Category) x Category Weight)",
        "",
    ];

    for (const category of snapshot.categorySummaries) {
        lines.push(
            `${category.name}: (${formatScoreValue(category.totalScore)} / ${formatScoreValue(category.totalMaxScore)}) x ${category.weight.toFixed(2)}% = ${category.weightedImpact.toFixed(2)}%`,
        );
    }

    lines.push(
        "",
        `Final Grade: ${snapshot.categorySummaries.map((category) => category.weightedImpact.toFixed(2)).join(" + ")} = ${snapshot.overallPercentage.toFixed(2)}% or ${snapshot.transmutatedGrade}`,
    );

    return lines.join("\n");
}

function splitLongToken(
    token: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
) {
    const parts: string[] = [];
    let current = "";

    for (const char of token) {
        const test = current + char;

        if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
            current = test;
        } else {
            if (current) parts.push(current);
            current = char;
        }
    }

    if (current) parts.push(current);

    return parts;
}

function wrapTextToLines(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
) {
    const lines: string[] = [];

    for (const paragraph of text.split(/\r?\n/)) {
        if (!paragraph.trim()) {
            lines.push("");
            continue;
        }

        const isUrl =
            /^https?:\/\//i.test(paragraph) || paragraph.includes("www.");
        if (isUrl) {
            const urlParts = paragraph
                .split(/(?=[/?&#=_-])|(?<=[/?&#=_-])/g)
                .filter(Boolean);

            let currentLine = "";

            for (const part of urlParts) {
                const candidate = currentLine + part;

                if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
                    currentLine = candidate;
                    continue;
                }

                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = "";
                }

                if (font.widthOfTextAtSize(part, fontSize) <= maxWidth) {
                    currentLine = part;
                } else {
                    lines.push(
                        ...splitLongToken(part, font, fontSize, maxWidth),
                    );
                }
            }

            if (currentLine) lines.push(currentLine);
            continue;
        }

        const words = paragraph.split(/\s+/);
        let currentLine = "";

        for (const word of words) {
            const candidate = currentLine ? `${currentLine} ${word}` : word;

            if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
                currentLine = candidate;
                continue;
            }

            if (currentLine) {
                lines.push(currentLine);
            }

            if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
                currentLine = word;
            } else {
                lines.push(...splitLongToken(word, font, fontSize, maxWidth));
                currentLine = "";
            }
        }

        if (currentLine) lines.push(currentLine);
    }

    return lines;
}

function drawWrappedParagraph(
    page: PDFPage,
    text: string,
    font: PDFFont,
    fontSize: number,
    x: number,
    y: number,
    maxWidth: number,
    lineGap = 4,
    color = rgb(0.08, 0.09, 0.11),
) {
    const lines = wrapTextToLines(text, font, fontSize, maxWidth);
    let currentY = y;

    for (const line of lines) {
        page.drawText(line, {
            x,
            y: currentY,
            size: fontSize,
            font,
            color,
        });

        currentY -= fontSize + lineGap;
    }

    return currentY;
}

function wrapUrlToLines(
    url: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number,
) {
    const parts = url.split(/(?=[/?&#=_-])|(?<=[/?&#=_-])/g).filter(Boolean);
    const lines: string[] = [];
    let currentLine = "";

    for (const part of parts) {
        const candidate = currentLine + part;

        if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
            currentLine = candidate;
            continue;
        }

        if (currentLine) {
            lines.push(currentLine);
            currentLine = "";
        }

        if (font.widthOfTextAtSize(part, fontSize) <= maxWidth) {
            currentLine = part;
        } else {
            let chunk = "";
            for (const char of part) {
                const next = chunk + char;
                if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
                    chunk = next;
                } else {
                    if (chunk) lines.push(chunk);
                    chunk = char;
                }
            }
            currentLine = chunk;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

function addLinkAnnotation(
    page: PDFPage,
    uri: string,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    const annotation = page.doc.context.register(
        page.doc.context.obj({
            Type: "Annot",
            Subtype: "Link",
            Rect: [x, y, x + width, y + height],
            Border: [0, 0, 0],
            A: {
                Type: "Action",
                S: "URI",
                URI: PDFString.of(uri),
            },
        }),
    );

    const annotsKey = PDFName.of("Annots");
    const existingAnnots = page.node.get(annotsKey) as PDFObject & {
        asArray?: () => PDFObject[];
    };

    if (existingAnnots) {
        page.node.set(
            annotsKey,
            page.doc.context.obj([
                ...(existingAnnots.asArray?.() ?? []),
                annotation,
            ]),
        );
    } else {
        page.node.set(annotsKey, page.doc.context.obj([annotation]));
    }
}

function drawWrappedUrlParagraph(
    page: PDFPage,
    url: string,
    font: PDFFont,
    fontSize: number,
    x: number,
    y: number,
    maxWidth: number,
    lineGap = 4,
    color = rgb(0.11, 0.3, 0.8),
) {
    const lines = wrapUrlToLines(url, font, fontSize, maxWidth);
    let currentY = y;

    for (const line of lines) {
        page.drawText(line, {
            x,
            y: currentY,
            size: fontSize,
            font,
            color,
        });

        addLinkAnnotation(
            page,
            url,
            x,
            currentY - 1,
            font.widthOfTextAtSize(line, fontSize),
            fontSize + 2,
        );

        currentY -= fontSize + lineGap;
    }

    return currentY;
}

const SECTION_GAP = 18;
const TITLE_GAP = -8;
const RECORD_NAME_COL_WIDTH = 340;
const SCORE_COL_WIDTH = 80;
const MAX_SCORE_COL_WIDTH = 80;

function chunkRecordsAccurately(
    records: CourseCategoryRecord[],
    font: PDFFont,
    fontSize: number,
    overrideWidths: number[],
    availableFirstPageHeight: number,
    fullPageHeight: number,
) {
    if (records.length === 0) return [[]];

    const chunks: CourseCategoryRecord[][] = [];
    let currentChunk: CourseCategoryRecord[] = [];
    let isFirstPage = true;

    const headerHeight = 20;
    const rowPadding = 3;
    const lineHeight = fontSize * 1.2;

    let currentHeight = headerHeight;
    const SAFETY_BUFFER = 40; // <-- Absorbs fraction-of-a-pixel math discrepancies

    for (const record of records) {
        const col1Lines = wrapTextToLines(
            record.name,
            font,
            fontSize,
            overrideWidths[0] - 8,
        ).length;
        const col2Lines = wrapTextToLines(
            formatScoreValue(record.score!),
            font,
            fontSize,
            overrideWidths[1] - 8,
        ).length;
        const col3Lines = wrapTextToLines(
            formatScoreValue(record.maxScore),
            font,
            fontSize,
            overrideWidths[2] - 8,
        ).length;

        const maxLines = Math.max(1, col1Lines, col2Lines, col3Lines);
        const rowHeight = maxLines * lineHeight + rowPadding;

        // Apply the safety buffer to the maximum allowed height
        const maxAllowedHeight =
            (isFirstPage ? availableFirstPageHeight : fullPageHeight) -
            SAFETY_BUFFER;

        if (
            currentHeight + rowHeight > maxAllowedHeight &&
            currentChunk.length > 0
        ) {
            chunks.push(currentChunk);
            currentChunk = [record];
            currentHeight = headerHeight + rowHeight;
            isFirstPage = false;
        } else {
            currentChunk.push(record);
            currentHeight += rowHeight;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function exportClassStandingPdf(
    snapshot: CalculationSnapshot,
    includeFormulaBreakdown: boolean,
) {
    const pdfDoc = await PDFDocument.create();

    const [logoBytes, regularFontBytes, boldFontBytes] = await Promise.all([
        fetch("/web-app-manifest-192x192.png").then((res) => res.arrayBuffer()),
        fetch("/fonts/Figtree-Regular.ttf").then((res) => res.arrayBuffer()),
        fetch("/fonts/Figtree-Bold.ttf").then((res) => res.arrayBuffer()),
    ]);

    if (
        !(
            logoBytes instanceof ArrayBuffer &&
            regularFontBytes instanceof ArrayBuffer &&
            boldFontBytes instanceof ArrayBuffer
        )
    ) {
        console.error("Failed to load font or logo bytes for PDF generation.");
        toast.error("Failed to load necessary resources for PDF generation.");
        return;
    }

    pdfDoc.registerFontkit(fontkit);
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);

    const logoImage = await pdfDoc.embedPng(logoBytes);

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const LEFT = 40;
    const RIGHT = 40;
    const CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT;
    const BOTTOM_SAFE = 50;

    const generatedAt = new Date(snapshot.generatedAt).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const shareUrl = new URL(window.location.href);

    shareUrl.searchParams.set("t", snapshot.templateEncoded);

    const drawChrome = (page: PDFPage, pageNumber: number) => {
        page.drawImage(logoImage, {
            x: LEFT,
            y: PAGE_HEIGHT - 70,
            width: 30,
            height: 30,
        });

        page.drawText("GWA Buddy", {
            x: 78,
            y: PAGE_HEIGHT - 55,
            size: 18,
            font: boldFont,
            color: rgb(0.08, 0.09, 0.11),
        });

        page.drawText("Class Standing Report", {
            x: 78,
            y: PAGE_HEIGHT - 68,
            size: 9,
            font: regularFont,
            color: rgb(0.09, 0.58, 0.38),
        });

        page.drawLine({
            start: { x: LEFT, y: PAGE_HEIGHT - 78 },
            end: { x: PAGE_WIDTH - RIGHT, y: PAGE_HEIGHT - 78 },
            thickness: 1,
            color: rgb(0.89, 0.906, 0.91),
        });

        page.drawText(`Generated ${generatedAt}`, {
            x: LEFT,
            y: 22,
            size: 8,
            font: regularFont,
            color: rgb(0.42, 0.45, 0.49),
        });

        page.drawText(`Page ${pageNumber}`, {
            x: PAGE_WIDTH - RIGHT - 40,
            y: 22,
            size: 8,
            font: regularFont,
            color: rgb(0.42, 0.45, 0.49),
        });
    };

    const createPage = (pageNumber: number) => {
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        drawChrome(page, pageNumber);
        return page;
    };

    // Page 1, summary
    let pageNumber = 1;
    const summaryPage = createPage(pageNumber);

    let y = PAGE_HEIGHT - 108;

    summaryPage.drawText("Course Information", {
        x: LEFT,
        y,
        size: 13,
        font: boldFont,
        color: rgb(0.08, 0.09, 0.11),
    });

    y -= 18;
    y = drawWrappedParagraph(
        summaryPage,
        buildCourseInfoText(snapshot),
        regularFont,
        10,
        LEFT,
        y,
        CONTENT_WIDTH,
        4,
    );

    y -= 10;

    if (includeFormulaBreakdown) {
        summaryPage.drawText("Formula Breakdown", {
            x: LEFT,
            y,
            size: 13,
            font: boldFont,
            color: rgb(0.08, 0.09, 0.11),
        });

        y -= 18;
        y = drawWrappedParagraph(
            summaryPage,
            buildFormulaText(snapshot),
            regularFont,
            10,
            LEFT,
            y,
            CONTENT_WIDTH,
            3,
        );

        y -= 10;
    }

    summaryPage.drawText("Encoded Course Setup", {
        x: LEFT,
        y,
        size: 13,
        font: boldFont,
        color: rgb(0.08, 0.09, 0.11),
    });

    y -= 18;
    y = drawWrappedUrlParagraph(
        summaryPage,
        shareUrl.toString(),
        regularFont,
        8,
        LEFT,
        y,
        CONTENT_WIDTH,
        3,
        rgb(0.11, 0.3, 0.8),
    );

    y -= 10;
    summaryPage.drawText("Category Summary", {
        x: LEFT,
        y,
        size: 13,
        font: boldFont,
        color: rgb(0.08, 0.09, 0.11),
    });

    y -= 8;

    const summaryTable = [
        ["Category", "Total / Max", "Weight", "Impact"],
        ...snapshot.categorySummaries.map((category) => [
            category.name,
            `${formatScoreValue(category.totalScore)} / ${formatScoreValue(category.totalMaxScore)}`,
            `${category.weight.toFixed(2)}%`,
            `${category.weightedImpact.toFixed(2)}%`,
        ]),
    ];

    await drawTable(pdfDoc, summaryPage, summaryTable, LEFT, y, {
        header: {
            hasHeaderRow: true,
            backgroundColor: rgb(0.082, 0.729, 0.506),
            textColor: rgb(0.078, 0.09, 0.11),
            textSize: 12,
        },
        textSize: 10,
        border: {
            color: rgb(0.078, 0.09, 0.11),
        },
    });

    // Pages 2 and onwards, pack as many category tables per page as possible
    pageNumber += 1;
    let recordsPage = createPage(pageNumber);
    let currentY = PAGE_HEIGHT - 108;

    const startNewRecordsPage = () => {
        pageNumber += 1;
        recordsPage = createPage(pageNumber);
        currentY = PAGE_HEIGHT - 108;
    };

    recordsPage.drawText("Encoded Records", {
        x: LEFT,
        y: currentY,
        size: 15,
        font: boldFont,
        color: rgb(0.08, 0.09, 0.11),
    });

    currentY -= 28;

    for (const category of snapshot.categorySummaries) {
        const title = `${category.name} (${category.weight.toFixed(2)}%)`;
        const titleLines = wrapTextToLines(title, boldFont, 12, CONTENT_WIDTH);
        const titleHeight = titleLines.length * 15;

        const tableOptions = {
            border: { color: rgb(0.078, 0.09, 0.11) },
            header: {
                hasHeaderRow: true,
                backgroundColor: rgb(0.082, 0.729, 0.506),
                textColor: rgb(0.078, 0.09, 0.11),
                textSize: 12,
                font: boldFont,
            },
            column: {
                overrideWidths: [
                    RECORD_NAME_COL_WIDTH,
                    SCORE_COL_WIDTH,
                    MAX_SCORE_COL_WIDTH,
                ],
            },
            textSize: 10,
            lineHeight: 1.2,
            font: regularFont,
        } as DrawTableOptions;

        const headerHeight = 20;
        // <-- Add 25px here to ensure there's enough room for at least ONE record row
        const minimumNeededSpace =
            titleHeight + TITLE_GAP + headerHeight + 25 + SECTION_GAP;

        // Force new page if we can't fit the category title, the table header, and 1 row
        if (currentY - minimumNeededSpace < BOTTOM_SAFE) {
            startNewRecordsPage();
            recordsPage.drawText("Encoded Records", {
                x: LEFT,
                y: currentY,
                size: 15,
                font: boldFont,
                color: rgb(0.08, 0.09, 0.11),
            });
            currentY -= 28;
        }

        const availableFirstPageSpace =
            currentY - BOTTOM_SAFE - titleHeight - TITLE_GAP;
        const availableFullPageSpace =
            PAGE_HEIGHT - 108 - 28 - BOTTOM_SAFE - titleHeight - TITLE_GAP;

        const chunks = chunkRecordsAccurately(
            category.records,
            regularFont,
            10,
            tableOptions.column!.overrideWidths as number[],
            availableFirstPageSpace,
            availableFullPageSpace,
        );

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            if (i > 0) {
                startNewRecordsPage();
                recordsPage.drawText("Encoded Records", {
                    x: LEFT,
                    y: currentY,
                    size: 15,
                    font: boldFont,
                    color: rgb(0.08, 0.09, 0.11),
                });
                currentY -= 28;
            }

            const chunkTitle = i === 0 ? title : `${title} (Continued)`;

            currentY = drawWrappedParagraph(
                recordsPage,
                chunkTitle,
                boldFont,
                12,
                LEFT,
                currentY,
                CONTENT_WIDTH,
                3,
            );
            currentY -= TITLE_GAP;

            const categoryTable = [
                ["Record Name", "Score", "Max Score"],
                ...chunk.map((record) => [
                    record.name,
                    {
                        text: formatScoreValue(record.score!),
                        align: "right",
                        type: "text",
                    } as CustomStyledText,
                    {
                        text: formatScoreValue(record.maxScore),
                        align: "right",
                        type: "text",
                    } as CustomStyledText,
                ]),
            ];

            const tableDimensions = (await drawTable(
                pdfDoc,
                recordsPage,
                categoryTable,
                LEFT,
                currentY,
                tableOptions,
            )) as TableDimensions;

            const actualDrawnHeight = tableDimensions?.height;
            currentY -= actualDrawnHeight + SECTION_GAP;
        }
    }

    const pdfBytes = await pdfDoc.save().then((bytes) => new Uint8Array(bytes));

    const blob = new Blob([pdfBytes], {
        type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `class-standing-report-${sanitizeFilenameSegment(snapshot.courseName)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}

const DEMO_COURSE: CourseDetails = {
    name: "Intro to Programming",
    goalGrade: "1.25",
    isDemo: true,
    allowExtraCredit: false,
    categories: [
        {
            name: "Quizzes",
            weight: 40,
            records: [
                { name: "Quiz 1", score: 18, maxScore: 20 },
                { name: "Quiz 2", score: 15, maxScore: 20 },
                { name: "Quiz 3", score: 20, maxScore: 20 },
            ],
        },
        {
            name: "Exams",
            weight: 60,
            records: [
                { name: "Midterm Exam", score: 85, maxScore: 100 },
                { name: "Final Exam", score: 90, maxScore: 100 },
            ],
        },
    ],
};

const tourSteps: TourStepType[] = [
    {
        id: "welcome",
        type: "dialog",
        title: "Welcome to Class Standing Calculator!",
        description:
            "This interactive tour will guide you through the key features of the calculator using demo values. Learn how to track your grades in real time!",
        actions: [{ label: "Start Tour", action: "next" }],
    },
    {
        id: "course-setup",
        target: () => document.getElementById("tour-course-setup"),
        title: "Course Setup",
        description:
            "Define your course name and grading criteria here. Each category must have a percentage weight, and all category weights must sum up to exactly 100%.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "extra-credit-step",
        target: () => document.getElementById("tour-extra-credit"),
        title: "Extra Credit / Bonus Points Option",
        description:
            "Toggle this option to allow score inputs to exceed their maximum points (e.g. keying in 105 out of 100 for bonus points or extra credit).",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "records",
        target: () => document.getElementById("tour-records"),
        title: "Grading Records & Score Inputs",
        description:
            "Here, you enter your scores for individual activities in each category. The calculator supports custom category weights and automatically tallies your points.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "collapse-category",
        target: () => document.getElementById("tour-collapse-category"),
        title: "Collapsible Category Sections",
        description:
            "Each category section can be collapsed or expanded by clicking its header. This helps keep the interface clean and lets you focus on one category at a time, especially when you have many grading criteria.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "breakdown",
        target: () => document.getElementById("tour-breakdown"),
        title: "Category Breakdown Summary",
        description:
            "This table displays the summary of your category totals, weights, and their weighted impact on your overall grade.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "btn-calculate",
        target: () => document.getElementById("tour-btn-calculate"),
        title: "Calculate Class Standing",
        description:
            "Click this button to process your entered scores and generate your final standing and grade analysis insights.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "results",
        target: () => document.getElementById("tour-results"),
        title: "Calculated Class Standing",
        description:
            "Here is your calculated grade, shown as both a percentage and its equivalent grade (e.g. 1.25, 2.00) based on your university's grading scale.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "goal-grade",
        target: () => document.getElementById("tour-field-goal-grade"),
        title: "How to Show Goal Grade Analysis",
        description:
            "Optionally select a target grade in this dropdown (e.g., 1.25) to enable the Goal Grade Analysis feature and evaluate what scores you need to achieve it.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "goal-insights",
        target: () => document.getElementById("tour-goal-insights"),
        title: "Goal Grade Analysis & Insights",
        description:
            "Once a goal grade is set, this analysis appears, showing the gap to your target, your biggest grade-boosting opportunities, and specific activities where you lost the most points.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "btn-share",
        target: () => document.getElementById("tour-btn-share"),
        title: "Share Course Template",
        description:
            "Click this button to instantly copy a shareable link containing your course configuration and scores to your clipboard. Share it with your blockmates so they can use it immediately!",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "actions",
        target: () => document.getElementById("tour-actions"),
        title: "Export & Share Options",
        description:
            "You can export your grade report as a clean PDF document, or generate a link to share this course template with blockmates.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "toggle-details",
        target: () => document.getElementById("tour-toggle-details"),
        title: "How to Show Calculation Details",
        description:
            "Click the 'How is this calculated?' button in the results section to show or hide the detailed step-by-step mathematical breakdown of your grade.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "solution",
        target: () => document.getElementById("tour-solution"),
        title: "Calculation Details",
        description:
            "This section reveals the exact formula, category weights, and weighted score computations used to compute your final standing.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Finish", action: "dismiss" },
        ],
    },
];

type GoalGradeType =
    | "1.00"
    | "1.25"
    | "1.50"
    | "1.75"
    | "2.00"
    | "2.25"
    | "2.50"
    | "2.75"
    | "3.00"
    | "5.00";

type CourseSetupValues = {
    name: string;
    allowExtraCredit?: boolean;
    categories: {
        name: string;
        weight: number;
    }[];
    goalGrade?: GoalGradeType;
};

type ScoreInputValues = {
    categories: {
        name: string;
        weight: number;
        records: {
            name: string;
            score?: number;
            maxScore: number;
        }[];
    }[];
    goalGrade?: GoalGradeType;
};

export function GradeCalculator({ template, tFromUrl, tidFromUrl }: {
    template?: CourseDetails;
    tFromUrl?: string;
    tidFromUrl?: string;
}) {
    const [course, setCourse] = useState<CourseDetails | null>(
        template ?? null,
    );
    const [isTourOpen, setIsTourOpen] = useState(false);
    type SavedTourState =
        | {
              course: null;
              setupFormValues: CourseSetupValues;
          }
        | {
              course: CourseDetails;
              setupFormValues: {
                  scoreFormValues: ScoreInputValues;
                  course: CourseDetails;
              };
          };

    const [savedState, setSavedState] = useState<SavedTourState | null>(null);

    const getSetupFormValuesRef = useRef<(() => CourseSetupValues) | null>(
        null,
    );
    const restoreSetupFormRef = useRef<
        ((values: CourseSetupValues) => void) | null
    >(null);
    const getScoreFormValuesRef = useRef<(() => ScoreInputValues) | null>(null);
    const restoreScoreFormRef = useRef<
        ((values: ScoreInputValues) => void) | null
    >(null);

    const wasTemplateLoaded = !!template;

    const [templateId, setTemplateId] = useState(() => {
        if (tidFromUrl) return tidFromUrl;
        if (tFromUrl) return simpleHash(tFromUrl);
        if (course) return simpleHash(serializeCourse(course));
        return "";
    });

    const [originalSerialized, setOriginalSerialized] = useState(() => {
        if (course) return serializeCourse(course);
        return "";
    });

    const isModified = useMemo(() => {
        if (!course || !originalSerialized) return false;
        return originalSerialized !== serializeCourse(course);
    }, [course, originalSerialized]);

    const handleStartTour = () => {
        const currentCourse = course;

        if (!currentCourse) {
            const setupValues = getSetupFormValuesRef.current?.();
            if (setupValues) {
                setSavedState({
                    course: null,
                    setupFormValues: setupValues,
                });
            }
        } else {
            const scoreValues = getScoreFormValuesRef.current?.();
            const courseToSave: CourseDetails = {
                ...currentCourse,
                categories: currentCourse.categories.map((cat, catIdx) => ({
                    ...cat,
                    records: cat.records.map((rec, recIdx) => {
                        const formRec =
                            scoreValues?.categories?.[catIdx]?.records?.[
                                recIdx
                            ];
                        return {
                            ...rec,
                            name: formRec?.name ?? rec.name,
                            score: formRec?.score,
                            maxScore: formRec?.maxScore ?? rec.maxScore,
                        };
                    }),
                })),
                goalGrade: scoreValues?.goalGrade ?? currentCourse.goalGrade,
            };
            if (scoreValues) {
                setSavedState({
                    course: currentCourse,
                    setupFormValues: {
                        scoreFormValues: scoreValues,
                        course: courseToSave,
                    },
                });
            }
        }

        setCourse(DEMO_COURSE);
        const demoSerialized = serializeCourse(DEMO_COURSE);
        setTemplateId(simpleHash(demoSerialized));
        setOriginalSerialized(demoSerialized);
        setIsTourOpen(true);
    };

    const handleCloseTour = () => {
        setIsTourOpen(false);
        if (savedState) {
            if (savedState.course === null) {
                setCourse(null);
                setTemplateId("");
                setOriginalSerialized("");
                setTimeout(() => {
                    restoreSetupFormRef.current?.(savedState.setupFormValues);
                }, 50);
            } else {
                const restoredCourse = savedState.setupFormValues.course;
                setCourse(restoredCourse);
                if (restoredCourse) {
                    const serialized = serializeCourse(restoredCourse);
                    setTemplateId(tidFromUrl || simpleHash(serialized));
                    setOriginalSerialized(serialized);
                } else {
                    setTemplateId("");
                    setOriginalSerialized("");
                }
            }
        }
        setSavedState(null);
    };

    const handleTourStatusChange = (details: { status: string }) => {
        if (
            details.status === "completed" ||
            details.status === "dismissed" ||
            details.status === "skipped"
        ) {
            handleCloseTour();
        }
    };

    return (
        <div className="space-y-4">
            {isTourOpen && (
                <Tour
                    steps={tourSteps}
                    autoStart
                    preventInteraction
                    onStatusChange={handleTourStatusChange}
                >
                    <TourContent>
                        <TourHeader>
                            <TourProgressText />
                            <TourTitle />
                            <TourDescription />
                        </TourHeader>
                        <TourActions />
                    </TourContent>
                </Tour>
            )}

            <div className="flex justify-center" id="tour-welcome">
                <Button onClick={handleStartTour} type="button" size="lg">
                    <StarsIcon />
                    Learn How to Use
                </Button>
            </div>

            <CourseDetailsForm
                key={
                    course
                        ? "setup-" +
                          course.name +
                          "-" +
                          course.categories
                              .map((cc) => cc.name + "_" + cc.weight)
                              .join(",")
                        : "setup-empty"
                }
                className="max-w-3xl mx-auto"
                setCourse={setCourse}
                course={course}
                getFormValuesRef={getSetupFormValuesRef}
                restoreFormRef={restoreSetupFormRef}
                setTemplateId={setTemplateId}
                setOriginalSerialized={setOriginalSerialized}
            />
            {course && (
                <ScoreInput
                    className="space-y-4 max-w-6xl mx-auto"
                    course={course}
                    setCourse={setCourse}
                    getFormValuesRef={getScoreFormValuesRef}
                    restoreFormRef={restoreScoreFormRef}
                    isTourOpen={isTourOpen}
                    templateId={wasTemplateLoaded ? templateId : undefined}
                    setTemplateId={setTemplateId}
                    isModified={wasTemplateLoaded ? isModified : undefined}
                    key={
                        course?.name +
                        "-" +
                        course.categories
                            .map((cc) => cc.name + "_" + cc.weight)
                            .join(",") +
                        "-" +
                        (course.allowExtraCredit ? "extra" : "normal")
                    } // Reset form when course or extra credit settings change
                />
            )}
        </div>
    );
}

/**
 * Course Setup Form
 * - Course Name
 * - Grading Categories/Criteria
 */

const courseSetupSchema = z
    .object({
        name: z.string().min(1, "Course name is required"),
        allowExtraCredit: z.boolean().default(false),
        categories: z
            .array(
                z.object({
                    name: z.string().min(1, "Category name is required"),
                    weight: z
                        .number({
                            error: "Weight must be a number",
                        })
                        .min(1, "Weight must at least 1")
                        .max(100, "Weight cannot exceed 100"),
                }),
            )
            .min(1, "At least one category is required")
            .superRefine((categories, context) => {
                const firstIndexByName = new Map<string, number>();
                for (let index = 0; index < categories.length; index++) {
                    const normalizedName = categories[index].name
                        .trim()
                        .toLowerCase();
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
        goalGrade: z
            .enum(
                [
                    "1.00",
                    "1.25",
                    "1.50",
                    "1.75",
                    "2.00",
                    "2.25",
                    "2.50",
                    "2.75",
                    "3.00",
                    "5.00",
                ],
                { error: "Invalid goal grade" },
            )
            .optional(),
    })
    .refine(
        (course) => {
            // Ensure total weight of categories equals 100
            const totalWeight = course.categories.reduce(
                (sum, category) => sum + category.weight,
                0,
            );
            return totalWeight === 100;
        },
        {
            error: "Total weight of all categories must equal 100%",
            path: ["categories"],
        },
    );

function CourseDetailsForm({
    className,
    course,
    setCourse,
    getFormValuesRef,
    restoreFormRef,
    setTemplateId,
    setOriginalSerialized,
}: {
    className?: string;
    course: CourseDetails | null;
    setCourse: Dispatch<SetStateAction<CourseDetails | null>>;
    getFormValuesRef?: React.RefObject<(() => CourseSetupValues) | null>;
    restoreFormRef?: React.RefObject<
        ((values: CourseSetupValues) => void) | null
    >;
    setTemplateId: (id: string) => void;
    setOriginalSerialized: (serialized: string) => void;
}) {
    const [openWarning, setOpenWarning] = useState<boolean>(false);

    const courseSetupForm = useForm<CourseSetupValues>({
        resolver: zodResolver(courseSetupSchema),
        reValidateMode: "onSubmit",
        defaultValues: course
            ? {
                  name: course.name,
                  allowExtraCredit: course.allowExtraCredit ?? false,
                  categories: course.categories.map((category) => ({
                      name: category.name,
                      weight: category.weight,
                  })),
              }
            : {
                  name: "",
                  allowExtraCredit: false,
                  categories: [
                      {
                          name: "",
                          weight: 0,
                      },
                  ],
              },
    });

    useEffect(() => {
        if (getFormValuesRef) {
            getFormValuesRef.current = () => courseSetupForm.getValues();
        }
        return () => {
            if (getFormValuesRef) {
                getFormValuesRef.current = null;
            }
        };
    }, [courseSetupForm, getFormValuesRef]);

    useEffect(() => {
        if (restoreFormRef) {
            restoreFormRef.current = (values) => courseSetupForm.reset(values);
        }
        return () => {
            if (restoreFormRef) {
                restoreFormRef.current = null;
            }
        };
    }, [courseSetupForm, restoreFormRef]);

    const {
        fields: categoryFields,
        append: appendCategory,
        remove: removeCategory,
    } = useFieldArray({
        control: courseSetupForm.control,
        name: "categories",
    });
    const { errors } = useFormState({
        control: courseSetupForm.control,
        exact: false,
    });
    const categories =
        useWatch({
            control: courseSetupForm.control,
            name: "categories",
        }) ?? [];

    const handleCourseDetailsChange = () => {
        const data = courseSetupForm.getValues();

        const newCourse: CourseDetails = {
            name: data.name,
            allowExtraCredit: data.allowExtraCredit,
            categories: data.categories.map((category) => ({
                name: category.name,
                weight: category.weight,
                records: [
                    {
                        name: category.name + " 1",
                        score: undefined,
                        maxScore: 100,
                    },
                ],
            })),
        };
        const serialized = serializeCourse(newCourse);
        setCourse(newCourse);
        setTemplateId(simpleHash(serialized));
        setOriginalSerialized(serialized);
    };

    const onSubmit = () => {
        if (course) {
            setOpenWarning(true);
        } else {
            handleCourseDetailsChange();
        }
    };

    return (
        <>
            <form onSubmit={courseSetupForm.handleSubmit(onSubmit)}>
                <Card id="tour-course-setup" className={className}>
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
                                    <FieldLabel htmlFor={field.name}>
                                        Course Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={courseSetupForm.control}
                            name="allowExtraCredit"
                            render={({ field }) => (
                                <Field
                                    orientation="horizontal"
                                    id="tour-extra-credit"
                                    className="py-1"
                                >
                                    <Checkbox
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(Boolean(checked))
                                        }
                                    />
                                    <FieldContent>
                                        <FieldTitle>
                                            Allow scores to exceed max score
                                            (Extra Credit)
                                        </FieldTitle>
                                        <FieldDescription>
                                            Check this to allow entering scores
                                            greater than their maximum values
                                            (e.g. for bonus points or extra
                                            credit).
                                        </FieldDescription>
                                    </FieldContent>
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
                                        fieldState.invalid
                                            ? "border-destructive"
                                            : "",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <FieldLabel
                                            className={cn(
                                                fieldState.invalid &&
                                                    "text-destructive",
                                            )}
                                        >
                                            Grading Categories/Criteria
                                        </FieldLabel>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                appendCategory({
                                                    name: "",
                                                    weight: 0,
                                                })
                                            }
                                            type="button"
                                            variant="outline"
                                        >
                                            <PlusIcon />
                                            Add Category
                                        </Button>
                                    </div>
                                    <div className="mt-2 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-2">
                                        {categoryFields.map((category, index) =>
                                            (() => {
                                                const categoryNameError =
                                                    errors.categories?.[index]
                                                        ?.name;
                                                const categoryWeightError =
                                                    errors.categories?.[index]
                                                        ?.weight;
                                                const isCategoryInvalid =
                                                    Boolean(
                                                        categoryNameError ||
                                                        categoryWeightError,
                                                    );
                                                const isNameOnlyInvalid =
                                                    Boolean(
                                                        categoryNameError &&
                                                        !categoryWeightError,
                                                    );

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
                                                            control={
                                                                courseSetupForm.control
                                                            }
                                                            name={`categories.${index}.name`}
                                                            render={({
                                                                field,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                    className={cn(
                                                                        "grid grid-rows-subgrid max-sm:col-span-2",
                                                                        fieldState.error
                                                                            ? "row-span-3"
                                                                            : "row-span-2",
                                                                    )}
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={
                                                                            field.name
                                                                        }
                                                                    >
                                                                        Category
                                                                        #
                                                                        {index +
                                                                            1}{" "}
                                                                        Name
                                                                    </FieldLabel>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        aria-invalid={
                                                                            fieldState.invalid
                                                                        }
                                                                        placeholder={`e.g. Laboratories, Quizzes, Exams...`}
                                                                    />
                                                                    {fieldState.error && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <Controller
                                                            control={
                                                                courseSetupForm.control
                                                            }
                                                            name={`categories.${index}.weight`}
                                                            render={({
                                                                field,
                                                                fieldState,
                                                            }) => (
                                                                <Field
                                                                    data-invalid={
                                                                        fieldState.invalid
                                                                    }
                                                                    className={cn(
                                                                        "w-full sm:w-28 grid grid-rows-subgrid",
                                                                        fieldState.error
                                                                            ? "row-span-3"
                                                                            : "row-span-2",
                                                                    )}
                                                                >
                                                                    <FieldLabel
                                                                        htmlFor={
                                                                            field.name
                                                                        }
                                                                    >
                                                                        Weight
                                                                        (%)
                                                                    </FieldLabel>
                                                                    <InputGroup
                                                                        aria-invalid={
                                                                            fieldState.invalid
                                                                        }
                                                                    >
                                                                        <InputGroupInput
                                                                            value={(
                                                                                field.value ??
                                                                                0
                                                                            ).toString()}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                field.onChange(
                                                                                    e.target.value.trim() ===
                                                                                        ""
                                                                                        ? ""
                                                                                        : isNaN(
                                                                                                Number(
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                ),
                                                                                            )
                                                                                          ? field.value
                                                                                          : Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            ),
                                                                                )
                                                                            }
                                                                            id={
                                                                                field.name
                                                                            }
                                                                            aria-invalid={
                                                                                fieldState.invalid
                                                                            }
                                                                            ref={
                                                                                field.ref
                                                                            }
                                                                            className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                            type="number"
                                                                        />
                                                                        <InputGroupAddon align="inline-end">
                                                                            <PercentIcon />
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                    {fieldState.error && (
                                                                        <FieldError
                                                                            errors={[
                                                                                fieldState.error,
                                                                            ]}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                        <div
                                                            className={cn(
                                                                "grid grid-rows-subgrid gap-2",
                                                                isCategoryInvalid
                                                                    ? "row-span-3"
                                                                    : "row-span-2",
                                                                isNameOnlyInvalid &&
                                                                    "max-sm:row-span-2",
                                                            )}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        className="mt-auto row-2"
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            removeCategory(
                                                                                index,
                                                                            )
                                                                        }
                                                                        size="icon"
                                                                        type="button"
                                                                        disabled={
                                                                            categoryFields.length ===
                                                                            1
                                                                        }
                                                                        suppressHydrationWarning
                                                                    >
                                                                        <MinusIcon />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    collisionPadding={
                                                                        15
                                                                    }
                                                                >
                                                                    Remove
                                                                    Category
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                );
                                            })(),
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Total Weight:{" "}
                                        <span
                                            className={cn(
                                                "font-semibold",
                                                categories.reduce(
                                                    (sum, category) =>
                                                        sum +
                                                        (category.weight || 0),
                                                    0,
                                                ) === 100
                                                    ? "text-accent"
                                                    : "text-destructive",
                                            )}
                                        >
                                            {categories.reduce(
                                                (sum, category) =>
                                                    sum +
                                                    (category.weight || 0),
                                                0,
                                            )}
                                            %
                                        </span>
                                    </p>
                                    {fieldState.error && (
                                        <FieldError
                                            errors={[fieldState.error.root]}
                                        />
                                    )}
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
                            Note: The total weight of all categories must equal
                            100% to calculate your class standing.
                        </div>
                        {course && (
                            <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                Warning: Saving changes to the course setup will
                                reset all currently entered scores and
                                calculated standing.
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </form>
            <AlertDialog open={openWarning} onOpenChange={setOpenWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Warning</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the course setup?
                            This will reset all your entered scores and
                            calculated class standing. Make sure to save your
                            current scores if you want to keep a record of them.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setOpenWarning(false)}
                        >
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
    );
}

function getScoreInputSchema(allowExtraCredit: boolean) {
    return z.object({
        categories: z.array(
            z.object({
                name: z.string().min(1, "Category name is required"),
                weight: z
                    .number({
                        error: "Weight must be a number",
                    })
                    .min(1, "Weight must at least 1")
                    .max(100, "Weight cannot exceed 100"),
                records: z
                    .array(
                        z.object({
                            name: z.string().min(1, "Record name is required"),
                            score: z
                                .number({
                                    error: "Score must be a number",
                                })
                                .min(0, "Score cannot be negative")
                                .optional(),
                            maxScore: z
                                .number({
                                    error: "Max score must be a number",
                                })
                                .min(1, "Max score must be at least 1"),
                        }),
                    )
                    .superRefine((records, context) => {
                        const firstIndexByName = new Map<string, number>();
                        for (let index = 0; index < records.length; index++) {
                            const normalizedName = records[index].name
                                .trim()
                                .toLowerCase();
                            if (!normalizedName) continue;
                            const firstIndex =
                                firstIndexByName.get(normalizedName);
                            if (firstIndex === undefined) {
                                firstIndexByName.set(normalizedName, index);
                                continue;
                            }
                            context.addIssue({
                                code: "custom",
                                message:
                                    "Record names within the same category must be unique",
                                path: [index, "name"],
                            });
                            context.addIssue({
                                code: "custom",
                                message:
                                    "Record names within the same category must be unique",
                                path: [firstIndex, "name"],
                            });
                        }
                    })
                    .superRefine((records, context) => {
                        records.forEach((record, index) => {
                            if (record.score === undefined) {
                                context.addIssue({
                                    code: "custom",
                                    message: "Score is required",
                                    path: [index, "score"],
                                });
                                return;
                            }

                            if (
                                !allowExtraCredit &&
                                record.score > record.maxScore
                            ) {
                                context.addIssue({
                                    code: "custom",
                                    message: "Score cannot exceed max score",
                                    path: [index, "score"],
                                });
                            }
                        });
                    }),
            }),
        ),
        goalGrade: z
            .enum(
                [
                    "1.00",
                    "1.25",
                    "1.50",
                    "1.75",
                    "2.00",
                    "2.25",
                    "2.50",
                    "2.75",
                    "3.00",
                    "5.00",
                ],
                { error: "Invalid goal grade" },
            )
            .optional(),
    });
}

function useIsVisible(ref: RefObject<HTMLDivElement | null>) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting),
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
    getFormValuesRef,
    restoreFormRef,
    isTourOpen,
    templateId,
    setTemplateId,
    isModified,
}: {
    className?: string;
    course: CourseDetails;
    setCourse: Dispatch<SetStateAction<CourseDetails | null>>;
    getFormValuesRef?: React.RefObject<(() => ScoreInputValues) | null>;
    restoreFormRef?: React.RefObject<
        ((values: ScoreInputValues) => void) | null
    >;
    isTourOpen?: boolean;
    templateId?: string;
    setTemplateId: Dispatch<SetStateAction<string>>;
    isModified?: boolean;
}) {
    const [showResults, setShowResults] = useState<boolean>(false);
    const [calculatedGrade, setCalculatedGrade] = useState<number | null>(null);
    const [showCalculationDetails, setShowCalculationDetails] =
        useState<boolean>(false);
    const [includeFormulaBreakdown, setIncludeFormulaBreakdown] =
        useState<boolean>(false);
    const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
    const [lastCalculatedSnapshot, setLastCalculatedSnapshot] =
        useState<CalculationSnapshot | null>(null);
    const [autoCalcuTable, setAutoCalcuTable] = useState<boolean>(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    const shareSchema = useMemo(() => z.object({
        templateId: z
            .string()
            .trim()
            .min(1, "Template ID is required")
            .max(15, "Template ID must be 15 characters or less"),
    }), []);

    const shareForm = useForm<z.infer<typeof shareSchema>>({
        resolver: zodResolver(shareSchema),
        defaultValues: { templateId: "" },
    });
    const [goalAnalysis, setGoalAnalysis] = useState<{
        targetPercentage: number;
        gap: number;
        categoryInsights: {
            name: string;
            currentPercentage: number;
            weight: number;
            potentialGain: number;
        }[];
        recordInsights: {
            category: string;
            record: string;
            impact: number;
            missingPoints: number;
        }[];
    } | null>(null);
    const calcuDetailsRef = useRef<HTMLDivElement>(null);
    const isCalcuDetailsVisible = useIsVisible(calcuDetailsRef);

    const scoreInputSchema = useMemo(
        () => getScoreInputSchema(course.allowExtraCredit ?? false),
        [course.allowExtraCredit],
    );

    const scoreInputForm = useForm<ScoreInputValues>({
        resolver: zodResolver(scoreInputSchema),
        reValidateMode: "onSubmit",
        defaultValues: {
            categories: course.categories.map((category) => ({
                name: category.name,
                weight: category.weight,
                records: category.records.map((record) => ({
                    name: record.name,
                    score: record.score,
                    maxScore: record.maxScore,
                })),
            })),
            goalGrade:
                (course.goalGrade as GoalGradeType | undefined) ?? undefined,
        },
    });

    useEffect(() => {
        if (getFormValuesRef) {
            getFormValuesRef.current = () => scoreInputForm.getValues();
        }
        return () => {
            if (getFormValuesRef) {
                getFormValuesRef.current = null;
            }
        };
    }, [scoreInputForm, getFormValuesRef]);

    useEffect(() => {
        if (restoreFormRef) {
            restoreFormRef.current = (values) => scoreInputForm.reset(values);
        }
        return () => {
            if (restoreFormRef) {
                restoreFormRef.current = null;
            }
        };
    }, [scoreInputForm, restoreFormRef]);

    useEffect(() => {
        if (course.isDemo) {
            const updatedCourse: CourseDetails = {
                ...course,
                categories: course.categories.map((c) => ({
                    ...c,
                    records: c.records.map((r) => ({
                        ...r,
                        score: r.score!,
                    })),
                })),
            };
            setShowResults(true);
            const snapshot = calculateCourseSnapshot(updatedCourse);
            setCalculatedGrade(snapshot.overallPercentage);
            setLastCalculatedSnapshot(snapshot);
            setShowCalculationDetails(true);

            const targetPercentage = course.goalGrade
                ? gradeRequirements[course.goalGrade]
                : null;
            if (targetPercentage !== null) {
                const gap = targetPercentage - snapshot.overallPercentage;
                const categoryInsights = updatedCourse.categories
                    .map((category) => {
                        const totalScore = category.records.reduce(
                            (sum, r) => sum + r.score!,
                            0,
                        );
                        const totalMaxScore = category.records.reduce(
                            (sum, r) => sum + r.maxScore,
                            0,
                        );
                        const currentPercentage =
                            totalMaxScore > 0
                                ? (totalScore / totalMaxScore) * 100
                                : 0;
                        const potentialGain =
                            ((100 - currentPercentage) / 100) * category.weight;
                        return {
                            name: category.name,
                            currentPercentage,
                            weight: category.weight,
                            potentialGain,
                        };
                    })
                    .sort((a, b) => b.potentialGain - a.potentialGain);

                const recordInsights = updatedCourse.categories
                    .flatMap((category) => {
                        const categoryTotal = category.records.reduce(
                            (sum, r) => sum + r.maxScore,
                            0,
                        );
                        return category.records.map((record) => ({
                            category: category.name,
                            record: record.name,
                            missingPoints: record.maxScore - record.score!,
                            impact:
                                ((record.maxScore - record.score!) /
                                    categoryTotal) *
                                category.weight,
                        }));
                    })
                    .sort((a, b) => b.impact - a.impact)
                    .slice(0, 5);

                setGoalAnalysis({
                    targetPercentage,
                    gap,
                    categoryInsights,
                    recordInsights,
                });
            }
        }
    }, [course, course.isDemo]);

    const goalGrade = useWatch({
        control: scoreInputForm.control,
        name: "goalGrade",
    });

    const { fields: categoryFields } = useFieldArray({
        control: scoreInputForm.control,
        name: "categories",
    });

    const { errors } = useFormState({
        control: scoreInputForm.control,
        exact: false,
    });

    const watchedCategories = useWatch({
        control: scoreInputForm.control,
        name: "categories",
    });

    const [debouncedCategories] = useDebounce(watchedCategories, 300);

    const { isValid } = useFormState({
        control: scoreInputForm.control,
    });

    useEffect(() => {
        if (!autoCalcuTable) return;
        if (!isValid) return;

        setCourse((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                categories: debouncedCategories.map((category) => ({
                    name: category.name,
                    weight: category.weight,
                    records: category.records.map((record) => ({
                        name: record.name,
                        score: record.score!,
                        maxScore: record.maxScore,
                    })),
                })),
            };
        });
    }, [autoCalcuTable, isValid, debouncedCategories, setCourse]);

    const categorySummaries = course.categories.map(calculateCategorySummary);

    const handleFieldChange = () => {
        setShowResults(false);
        setCalculatedGrade(null);
        setShowCalculationDetails(false);
        setLastCalculatedSnapshot(null);
    };

    const onSubmit = (data: ScoreInputValues) => {
        const updatedCourse: CourseDetails = {
            ...course,
            categories: course.categories.map((category, categoryIndex) => ({
                ...category,
                records: data.categories[categoryIndex].records.map(
                    (record) => ({
                        name: record.name,
                        score: record.score!,
                        maxScore: record.maxScore,
                    }),
                ),
            })),
        };
        setCourse(updatedCourse);
        setShowResults(true);
        const snapshot = calculateCourseSnapshot(updatedCourse);
        const calculatedGradeValue = snapshot.overallPercentage;
        setCalculatedGrade(calculatedGradeValue);
        setLastCalculatedSnapshot(snapshot);

        const targetPercentage = data.goalGrade
            ? gradeRequirements[data.goalGrade]
            : null;

        if (targetPercentage !== null) {
            const gap = targetPercentage - calculatedGradeValue;

            const categoryInsights = updatedCourse.categories
                .map((category) => {
                    const totalScore = category.records
                        .filter(
                            (record) =>
                                record.score !== undefined &&
                                record.maxScore > 0,
                        )
                        .reduce((sum, record) => sum + record.score!, 0);

                    const totalMaxScore = category.records
                        .filter(
                            (record) =>
                                record.score !== undefined &&
                                record.maxScore > 0,
                        )
                        .reduce((sum, record) => sum + record.maxScore, 0);

                    const currentPercentage =
                        totalMaxScore > 0
                            ? (totalScore / totalMaxScore) * 100
                            : 0;

                    const potentialGain =
                        ((100 - currentPercentage) / 100) * category.weight;

                    return {
                        name: category.name,
                        currentPercentage,
                        weight: category.weight,
                        potentialGain,
                    };
                })
                .sort((a, b) => b.potentialGain - a.potentialGain);

            const recordInsights = updatedCourse.categories
                .flatMap((category) => {
                    const categoryTotal = category.records
                        .filter(
                            (record) =>
                                record.score !== undefined &&
                                record.maxScore > 0,
                        )
                        .reduce((sum, record) => sum + record.maxScore, 0);

                    return category.records
                        .filter(
                            (record) =>
                                record.score !== undefined &&
                                record.maxScore > 0,
                        )
                        .map((record) => ({
                            category: category.name,
                            record: record.name,
                            missingPoints: record.maxScore - record.score!,
                            impact:
                                ((record.maxScore - record.score!) /
                                    categoryTotal) *
                                category.weight,
                        }));
                })
                .sort((a, b) => b.impact - a.impact)
                .slice(0, 5);

            setGoalAnalysis({
                targetPercentage,
                gap,
                categoryInsights,
                recordInsights,
            });
        } else {
            setGoalAnalysis(null);
        }
    };

    const handleExportPdf = async () => {
        if (!lastCalculatedSnapshot) {
            return;
        }

        try {
            setIsExportingPdf(true);
            await exportClassStandingPdf(
                lastCalculatedSnapshot,
                includeFormulaBreakdown,
            );
            toast.success("Class standing report exported.", {
                icon: <SaveIcon className="size-4" />,
            });
        } catch (err) {
            console.error("Error exporting PDF:", err);
            toast.error("Failed to export the PDF report.");
        } finally {
            setIsExportingPdf(false);
        }
    };

    const handleShare = async () => {
        shareForm.reset({ templateId: "" });
        setIsShareDialogOpen(true);
    };

    const handleConfirmShare = async () => {
        const { templateId } = shareForm.getValues();
        const data = scoreInputForm.getValues();

        const encoded = serializeCourse({
            name: course.name,
            allowExtraCredit: course.allowExtraCredit ?? false,
            categories: data.categories.map((category) => ({
                ...category,
                records: category.records.map((record) => ({
                    ...record,
                    score: record.score ?? 0,
                })),
            })),
        });

        const url = new URL(window.location.href);

        url.searchParams.set("t", encoded);

        if (templateId.trim()) {
            url.searchParams.set("tid", templateId.trim());
            setTemplateId(templateId.trim());
        }

        await navigator.clipboard.writeText(url.toString());

        setIsShareDialogOpen(false);

        toast.success("Share link copied to clipboard.", {
            icon: <Share2Icon className="size-4" />,
        });
    };

    return (
        <div className={className}>
            <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{course.name}</h1>
                    {templateId && (
                        <Badge variant="outline" className="font-mono text-xs" suppressHydrationWarning>
                            ID: {templateId}
                        </Badge>
                    )}
                    {isModified && (
                        <Badge variant="secondary" className="text-xs">
                            Modified
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Input your scores for each category to calculate your
                    current class standing.
                </p>
            </div>
            <Separator />
            <form
                className="gap-4 flex flex-col md:flex-row items-start"
                onSubmit={scoreInputForm.handleSubmit(onSubmit)}
            >
                <section
                    id="tour-records"
                    className="space-y-4 w-full drop-shadow-xs"
                >
                    {categoryFields.map((category, index) => (
                        <RecordInput
                            key={category.id}
                            category={category}
                            index={index}
                            scoreInputForm={scoreInputForm}
                            errors={errors}
                            handleFieldChange={handleFieldChange}
                            autoCalcuTable={autoCalcuTable}
                            id={
                                index === 0
                                    ? "tour-collapse-category"
                                    : undefined
                            }
                        />
                    ))}
                </section>
                <Separator className="sm:hidden" />
                <Scroller
                    className={cn(
                        "sticky top-20.5 w-full md:w-4xl space-y-4 drop-shadow-xs",
                        !isTourOpen && "md:max-h-[calc(100dvh-6.10rem)]",
                    )}
                >
                    <Card id="tour-breakdown" className="border ring-0">
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                            <CardDescription>
                                Summary of category totals, weights, and each
                                category&apos;s impact on your overall grade.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className=" py-1">
                                            Category
                                        </TableHead>
                                        <TableHead className="text-right py-1">
                                            Total{" "}
                                            <span className="text-muted-foreground text-sm">
                                                /
                                            </span>{" "}
                                            Max Total
                                        </TableHead>
                                        <TableHead className="text-right py-1">
                                            Weight
                                        </TableHead>
                                        <TableHead className="text-right max-sm:w-28 max-sm:whitespace-normal py-1">
                                            Weighted Impact (%)
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categorySummaries.map(
                                        (category, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="whitespace-normal">
                                                        {category.name}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-mono">
                                                            {formatScoreValue(
                                                                category.totalScore,
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground text-sm">
                                                            /
                                                        </span>
                                                        <span className="font-mono">
                                                            {formatScoreValue(
                                                                category.totalMaxScore,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {category.weight}%
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono max-sm:w-24">
                                                        {category.weightedImpact.toFixed(
                                                            2,
                                                        )}
                                                        %
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        },
                                    )}
                                </TableBody>
                            </Table>
                            {!autoCalcuTable && (
                                <p className="text-sm text-muted-foreground italic mt-2">
                                    Note: This table will only update after you
                                    click &quot;Calculate Class Standing&quot;.
                                    It provides a breakdown of how each category
                                    contributes to your overall grade based on
                                    the scores you entered.
                                </p>
                            )}
                            <Field orientation="horizontal" className="mt-4">
                                <Checkbox
                                    id="auto-calculate-table"
                                    checked={autoCalcuTable}
                                    onCheckedChange={(checked) =>
                                        setAutoCalcuTable(Boolean(checked))
                                    }
                                />
                                <FieldLabel htmlFor="auto-calculate-table">
                                    Auto-update category breakdown table on
                                    score change
                                </FieldLabel>
                            </Field>
                        </CardContent>
                    </Card>
                    <Card id="tour-goal-grade" className="border ring-0">
                        <CardHeader>
                            <CardTitle>Goal Grade Analysis</CardTitle>
                            <CardDescription>
                                Optionally set a target grade to compare against
                                your calculated class standing and identify key
                                areas for improvement.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Controller
                                control={scoreInputForm.control}
                                name="goalGrade"
                                render={({ field, fieldState }) => (
                                    <Field
                                        id="tour-field-goal-grade"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Goal Grade (Optional)
                                        </FieldLabel>
                                        <Combobox
                                            items={[
                                                "1.00",
                                                "1.25",
                                                "1.50",
                                                "1.75",
                                                "2.00",
                                                "2.25",
                                                "2.50",
                                                "2.75",
                                                "3.00",
                                                "5.00",
                                            ]}
                                            value={field.value ?? null}
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value ?? undefined,
                                                )
                                            }
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <ComboboxInput
                                                showClear
                                                placeholder="e.g. 1.00, 2.25, etc."
                                            />
                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    No grade found.
                                                </ComboboxEmpty>
                                                <ComboboxList>
                                                    {(grade) => (
                                                        <ComboboxItem
                                                            value={grade}
                                                            key={grade}
                                                        >
                                                            {grade}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                        <FieldDescription>
                                            Setting a goal grade allows you to
                                            see how your current standing
                                            compares to your target. It will
                                            show you how much you need to score
                                            in remaining activities to achieve
                                            that grade.
                                        </FieldDescription>
                                        {fieldState.error && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex-col gap-2 items-center justify-center md:flex-row md:justify-start">
                            <Button
                                id="tour-btn-calculate"
                                type="submit"
                                className="max-md:w-full md:flex-1"
                            >
                                <CalculatorIcon />
                                Calculate Class Standing
                            </Button>
                            <Button
                                id="tour-btn-share"
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
                    {calculatedGrade !== null && showResults ? (
                        <>
                            {goalAnalysis && (
                                <Card
                                    id="tour-goal-insights"
                                    className="border ring-0"
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            Goal Grade Analysis Results
                                        </CardTitle>
                                        <CardDescription>
                                            See what areas will have the biggest
                                            impact on reaching your target
                                            grade.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {goalAnalysis.gap <= 0 ? (
                                            <Alert className="text-primary">
                                                <PartyPopperIcon />
                                                <AlertTitle>
                                                    Goal Achieved
                                                </AlertTitle>
                                                <AlertDescription>
                                                    You have already reached
                                                    your target grade.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <Alert variant="destructive">
                                                <TriangleAlertIcon />
                                                <AlertTitle>
                                                    Goal Progress
                                                </AlertTitle>
                                                <AlertDescription>
                                                    You need an additional{" "}
                                                    {goalAnalysis.gap.toFixed(
                                                        2,
                                                    )}
                                                    % to reach your target.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div>
                                            <p>
                                                Goal:{" "}
                                                <strong>{goalGrade}</strong>
                                            </p>
                                            <p>
                                                Required:{" "}
                                                <strong>
                                                    {
                                                        goalAnalysis.targetPercentage
                                                    }
                                                    %
                                                </strong>
                                            </p>
                                            <p>
                                                Current:{" "}
                                                <strong>
                                                    {calculatedGrade?.toFixed(
                                                        2,
                                                    )}
                                                    %
                                                </strong>
                                            </p>
                                            <p>
                                                Gap:{" "}
                                                <strong>
                                                    {goalAnalysis.gap.toFixed(
                                                        2,
                                                    )}
                                                    %
                                                </strong>
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Biggest Opportunities (Top{" "}
                                                {Math.min(
                                                    3,
                                                    goalAnalysis
                                                        .categoryInsights
                                                        .length,
                                                )}
                                                )
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                These categories have the
                                                highest potential to boost your
                                                grade and help you reach your
                                                target.
                                            </p>

                                            <ol className="list-decimal ml-5">
                                                {goalAnalysis.categoryInsights
                                                    .slice(0, 3)
                                                    .map((category) => (
                                                        <li key={category.name}>
                                                            {category.name} (+
                                                            {category.potentialGain.toFixed(
                                                                2,
                                                            )}
                                                            %)
                                                        </li>
                                                    ))}
                                            </ol>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Activities Hurting Your Grade
                                                (Top{" "}
                                                {Math.min(
                                                    5,
                                                    goalAnalysis.recordInsights
                                                        .length,
                                                )}
                                                )
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                These are the records where you
                                                lost the most points. Similar
                                                activities are key areas to
                                                focus on if you want to improve
                                                your standing.
                                            </p>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Category
                                                        </TableHead>
                                                        <TableHead>
                                                            Record
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Missing Points
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Impact on Grade (%)
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {goalAnalysis.recordInsights.map(
                                                        (record, index) => (
                                                            <TableRow
                                                                key={index}
                                                            >
                                                                <TableCell className="whitespace-normal">
                                                                    {
                                                                        record.category
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="whitespace-normal">
                                                                    {
                                                                        record.record
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <span className="font-mono">
                                                                        {record.missingPoints.toLocaleString()}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <span className="font-mono">
                                                                        {record.impact.toFixed(
                                                                            2,
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        <Alert className="mt-4 border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400">
                                            <InfoIcon className="size-4" />
                                            <AlertTitle>Disclaimer</AlertTitle>
                                            <AlertDescription>
                                                Reaching your target grade
                                                ultimately depends on your
                                                performance in upcoming/incoming
                                                course requirements. The
                                                suggested improvements are
                                                estimated based on your encoded
                                                past point deductions.
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            )}

                            <div
                                id="tour-results"
                                className={cn(
                                    "border border-current rounded-lg p-4 w-full",
                                    Number(
                                        getTransmutatedGrade(calculatedGrade),
                                    ) <= 1.25
                                        ? "bg-green-100 dark:bg-green-500/30 border-green-300 dark:border-green-700/30 text-green-900 dark:text-green-50"
                                        : Number(
                                                getTransmutatedGrade(
                                                    calculatedGrade,
                                                ),
                                            ) <= 1.75
                                          ? "bg-lime-100 dark:bg-lime-500/30 border-lime-300 dark:border-lime-700/30 text-lime-900 dark:text-lime-50"
                                          : Number(
                                                  getTransmutatedGrade(
                                                      calculatedGrade,
                                                  ),
                                              ) <= 2.5
                                            ? "bg-yellow-100 dark:bg-yellow-500/30 border-yellow-300 dark:border-yellow-700/30 text-yellow-900 dark:text-yellow-50"
                                            : Number(
                                                    getTransmutatedGrade(
                                                        calculatedGrade,
                                                    ),
                                                ) <= 3.0
                                              ? "bg-amber-100 dark:bg-amber-500/30 border-amber-300 dark:border-amber-700/30 text-amber-900 dark:text-amber-50"
                                              : "bg-destructive/30 border-destructive dark:border-destructive/30 text-black dark:text-white",
                                )}
                            >
                                <h2 className="text-lg font-semibold">
                                    Current Class Standing
                                </h2>
                                <p className="text-sm text-current/65 mb-4">
                                    Your grade for the course is...
                                </p>
                                <div className="flex max-sm:flex-col sm:items-baseline sm:gap-2">
                                    <span className="text-4xl font-bold font-mono">
                                        {calculatedGrade !== null
                                            ? `${calculatedGrade.toFixed(2)}%`
                                            : "N/A"}
                                    </span>
                                    <span className="text-sm text-current/65">
                                        or
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-4xl font-bold font-mono">
                                            {calculatedGrade !== null
                                                ? getTransmutatedGrade(
                                                      calculatedGrade,
                                                  )
                                                : "N/A"}
                                        </span>
                                        {calculatedGrade !== null &&
                                            (Number(
                                                getTransmutatedGrade(
                                                    calculatedGrade,
                                                ),
                                            ) <= 1.25 ? (
                                                <PartyPopperIcon className="inline text-inherit size-6" />
                                            ) : Number(
                                                  getTransmutatedGrade(
                                                      calculatedGrade,
                                                  ),
                                              ) <= 1.75 ? (
                                                <StarsIcon className="inline text-inherit size-6" />
                                            ) : Number(
                                                  getTransmutatedGrade(
                                                      calculatedGrade,
                                                  ),
                                              ) <= 2.5 ? (
                                                <SparkleIcon className="inline text-inherit size-6" />
                                            ) : Number(
                                                  getTransmutatedGrade(
                                                      calculatedGrade,
                                                  ),
                                              ) <= 3.0 ? (
                                                <TrendingUpDownIcon className="inline text-inherit size-6" />
                                            ) : (
                                                <TriangleAlertIcon className="inline text-inherit size-6" />
                                            ))}
                                    </span>
                                </div>

                                <p className="text-sm">
                                    {Number(
                                        getTransmutatedGrade(calculatedGrade),
                                    ) <= 1.25
                                        ? "Excellent work! Keep it up!"
                                        : Number(
                                                getTransmutatedGrade(
                                                    calculatedGrade,
                                                ),
                                            ) <= 1.75
                                          ? "Great job! You're doing well."
                                          : Number(
                                                  getTransmutatedGrade(
                                                      calculatedGrade,
                                                  ),
                                              ) <= 2.5
                                            ? "Good effort! There's room for improvement."
                                            : Number(
                                                    getTransmutatedGrade(
                                                        calculatedGrade,
                                                    ),
                                                ) <= 3.0
                                              ? "You're passing, but consider focusing more on your studies."
                                              : "Unfortunately, you're at risk of failing. Seek help and work hard to improve."}
                                </p>
                                <Button
                                    id="tour-toggle-details"
                                    variant="ghost"
                                    className="w-full mt-4"
                                    onClick={() => {
                                        setShowCalculationDetails(
                                            (prev) => !prev,
                                        );

                                        if (!showCalculationDetails) {
                                            setTimeout(() => {
                                                if (
                                                    isCalcuDetailsVisible ||
                                                    !calcuDetailsRef.current
                                                )
                                                    return;

                                                calcuDetailsRef.current?.scrollIntoView(
                                                    {
                                                        behavior: "smooth",
                                                        block: "start",
                                                    },
                                                );
                                            }, 500);
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
                                    Estimated class standing based on your
                                    entered scores. Actual grades may vary
                                    depending on your instructor&apos;s grading
                                    policies.
                                </AlertDescription>
                            </Alert>

                            <Card id="tour-actions" className="border ring-0">
                                <CardHeader>
                                    <CardTitle>Export Results as PDF</CardTitle>
                                    <CardDescription>
                                        Download a report — a summary page with
                                        course info and category grades, plus a
                                        detailed score records page.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldLabel htmlFor="formula-breakdown">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="formula-breakdown"
                                                checked={
                                                    includeFormulaBreakdown
                                                }
                                                onCheckedChange={(checked) =>
                                                    setIncludeFormulaBreakdown(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <FieldContent>
                                                <FieldTitle>
                                                    Include Formula Breakdown
                                                </FieldTitle>
                                                <FieldDescription>
                                                    Appends the weighted score
                                                    computation for each
                                                    category on the summary
                                                    page.
                                                </FieldDescription>
                                            </FieldContent>
                                        </Field>
                                    </FieldLabel>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={handleExportPdf}
                                        disabled={
                                            isExportingPdf ||
                                            !lastCalculatedSnapshot
                                        }
                                    >
                                        <SaveIcon />
                                        {isExportingPdf
                                            ? "Exporting PDF..."
                                            : "Export PDF"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </>
                    ) : null}
                </Scroller>
            </form>
            {showResults &&
                calculatedGrade !== null &&
                showCalculationDetails && (
                    <Card
                        id="tour-solution"
                        ref={calcuDetailsRef}
                        className="border ring-0"
                    >
                        <CardHeader>
                            <CardTitle>Calculation Details</CardTitle>
                            <CardDescription>
                                Your final grade is calculated by applying each
                                category&apos;s weight to your score and adding
                                the weighted scores together.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <span className="max-sm:text-sm">GWA</span> ={" "}
                                <span>
                                    Σ((
                                    <span className="inline-block relative align-middle text-center">
                                        <span className="p-0.5 max-sm:w-24 max-sm:block max-sm:text-xs max-sm:mx-auto">
                                            Total Score in Category
                                        </span>
                                        <Separator className="bg-current" />
                                        <span className="p-0.5 max-sm:w-32 max-sm:block max-sm:text-xs max-sm:mx-auto">
                                            Total Max Score in Category
                                        </span>
                                    </span>
                                    ) ×{" "}
                                    <span className="inline-block relative align-middle text-center">
                                        <span className="max-sm:text-xs max-sm:inline-block max-sm:w-14 max-sm:text-center">
                                            Category Weight
                                        </span>
                                    </span>
                                    )
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold">Solution</h2>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>
                                    Calculate how much of the available points
                                    you earned in each category.
                                    <ol className="list-decimal list-inside ml-4 sm:ml-6 space-y-1">
                                        {categorySummaries.map(
                                            (category, index) => {
                                                return (
                                                    <li key={index}>
                                                        {category.name}:{" "}
                                                        <span className="max-sm:block">
                                                            (
                                                            <span className="inline-block relative align-middle text-center">
                                                                <span className="relative inline-flex justify-center pt-9 sm:pt-4 sm:w-full sm:min-w-64 p-0.5">
                                                                    <span className="absolute top-1 text-xs text-muted-foreground max-sm:w-34">
                                                                        Total
                                                                        Scores
                                                                        for all
                                                                        records
                                                                        in this
                                                                        category
                                                                    </span>
                                                                    <span className="tabular-nums font-mono">
                                                                        {formatScoreValue(
                                                                            category.totalScore,
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                <Separator className="bg-current" />
                                                                <span className="flex flex-col justify-center p-0.5">
                                                                    <span className="font-mono tabular-nums">
                                                                        {formatScoreValue(
                                                                            category.totalMaxScore,
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground max-sm:w-44">
                                                                        Total
                                                                        Max
                                                                        Scores
                                                                        for all
                                                                        records
                                                                        in this
                                                                        category
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            ) ×{" "}
                                                            <span className="tabular-nums font-mono">
                                                                {category.weight.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                            %
                                                        </span>
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ol>
                                </li>
                                <li>
                                    Multiply each category score by its
                                    corresponding weight in the course&apos;s
                                    grading system.
                                    <ol className="list-decimal list-inside ml-6 space-y-1">
                                        {categorySummaries.map(
                                            (category, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="pl-5 -indent-5"
                                                    >
                                                        {category.name}:{" "}
                                                        <span className="tabular-nums font-mono">
                                                            {category.percentageScore.toFixed(
                                                                3,
                                                            )}
                                                        </span>{" "}
                                                        ×{" "}
                                                        <span className="tabular-nums font-mono">
                                                            {category.weight.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                        % ={" "}
                                                        <span className="tabular-nums font-mono">
                                                            {category.weightedImpact.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                        %
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ol>
                                </li>
                                <li>
                                    Add the weighted scores and convert the
                                    result using the NEUST grading scale.
                                    <br />
                                    <span className="inline-flex items-baseline gap-1 sm:w-fit flex-wrap">
                                        {(() => {
                                            return (
                                                <span className="inline-block relative align-middle text-center">
                                                    <span className="p-0.5">
                                                        {categorySummaries.map(
                                                            (
                                                                category,
                                                                index,
                                                            ) => {
                                                                return (
                                                                    <Fragment
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <span className="tabular-nums font-mono">
                                                                            {category.weightedImpact.toFixed(
                                                                                2,
                                                                            )}
                                                                        </span>
                                                                        %
                                                                        {index <
                                                                        categorySummaries.length -
                                                                            1
                                                                            ? " + "
                                                                            : ""}
                                                                    </Fragment>
                                                                );
                                                            },
                                                        )}
                                                    </span>
                                                </span>
                                            );
                                        })()}{" "}
                                        ={" "}
                                        <span
                                            className={cn(
                                                "inline border-current rounded-lg px-2 py-0.5",
                                                Number(
                                                    getTransmutatedGrade(
                                                        calculatedGrade,
                                                    ),
                                                ) <= 1.25
                                                    ? "bg-green-100 dark:bg-green-500/30 border-green-300 dark:border-green-700/30 text-green-900 dark:text-green-50"
                                                    : Number(
                                                            getTransmutatedGrade(
                                                                calculatedGrade,
                                                            ),
                                                        ) <= 1.75
                                                      ? "bg-lime-100 dark:bg-lime-500/30 border-lime-300 dark:border-lime-700/30 text-lime-900 dark:text-lime-50"
                                                      : Number(
                                                              getTransmutatedGrade(
                                                                  calculatedGrade,
                                                              ),
                                                          ) <= 2.5
                                                        ? "bg-yellow-100 dark:bg-yellow-500/30 border-yellow-300 dark:border-yellow-700/30 text-yellow-900 dark:text-yellow-50"
                                                        : Number(
                                                                getTransmutatedGrade(
                                                                    calculatedGrade,
                                                                ),
                                                            ) <= 3.0
                                                          ? "bg-amber-100 dark:bg-amber-500/30 border-amber-300 dark:border-amber-700/30 text-amber-900 dark:text-amber-50"
                                                          : "bg-destructive/50 dark:bg-destructive/30 border-destructive dark:border-destructive/30 text-destructive-foreground",
                                            )}
                                        >
                                            <span className="tabular-nums font-mono font-bold">
                                                {calculatedGrade.toFixed(2)}
                                            </span>
                                            % or{" "}
                                            <span className="tabular-nums font-mono font-bold">
                                                {getTransmutatedGrade(
                                                    calculatedGrade,
                                                )}
                                            </span>
                                        </span>{" "}
                                        = Final Grade
                                    </span>
                                </li>
                                <span className="block">
                                    You can see how the NEUST grading scale in
                                    our{" "}
                                    <Link
                                        href="/#system-of-grading"
                                        className="underline underline-offset-4"
                                        target="_blank"
                                    >
                                        System of Grading
                                    </Link>{" "}
                                    section in the home page.
                                </span>
                            </ol>
                        </CardContent>
                    </Card>
                )}
            <Dialog open={isShareDialogOpen} onOpenChange={(open) => setIsShareDialogOpen(open)}>
                <DialogContent>
                    <form onSubmit={shareForm.handleSubmit(handleConfirmShare)}>
                    <DialogHeader>
                        <DialogTitle>Share Template</DialogTitle>
                        <DialogDescription>
                            Optionally define an ID for this template (max 15 characters).
                        </DialogDescription>
                    </DialogHeader>
                    <Controller
                        control={shareForm.control}
                        name="templateId"
                        render={({ field, fieldState }) => (
                            <Field className="my-4" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Template ID</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="e.g. MyTemplate"
                                    maxLength={15}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setIsShareDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Share2Icon />
                            Copy Link
                        </Button>
                    </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
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

const gradeRequirements: Record<string, number> = {
    "1.00": 96.64,
    "1.25": 93.31,
    "1.50": 89.98,
    "1.75": 86.65,
    "2.00": 83.32,
    "2.25": 79.99,
    "2.50": 76.66,
    "2.75": 73.33,
    "3.00": 70.0,
    "5.00": 0,
};

function parseSequentialName(name: string) {
    const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?)$/);

    if (!match) {
        return null;
    }

    return {
        prefix: match[1].trim(),
        number: Number(match[2]),
        rawNumber: match[2],
    };
}

function getNextSequentialRecordName(
    categoryName: string,
    records: { name: string }[],
) {
    if (records.length === 0) {
        return `${categoryName} 1`;
    }

    const lastRecord = records[records.length - 1];

    const lastParsed = parseSequentialName(lastRecord.name);

    if (!lastParsed) {
        return `${lastRecord.name.trimEnd()} 1`;
    }

    let step = 1;

    const decimalPart = lastParsed.rawNumber.split(".")[1];

    if (decimalPart) {
        step = 1 / Math.pow(10, decimalPart.length);
    }

    const nextNumber = lastParsed.number + step;

    const formattedNumber = decimalPart
        ? nextNumber.toFixed(decimalPart.length)
        : nextNumber.toString();

    return `${lastParsed.prefix.trimEnd()} ${formattedNumber}`;
}

function RecordInput({
    category,
    index,
    scoreInputForm,
    errors,
    handleFieldChange,
    autoCalcuTable,
    id,
}: {
    category: ScoreInputValues["categories"][number];
    index: number;
    scoreInputForm: ReturnType<typeof useForm<ScoreInputValues>>;
    errors: UseFormStateReturn<ScoreInputValues>["errors"];
    handleFieldChange: () => void;
    autoCalcuTable: boolean;
    id?: string;
}) {
    const currentRecords = useWatch({
        control: scoreInputForm.control,
        name: `categories.${index}.records`,
    });

    const {
        fields: recordFields,
        append: appendRecord,
        remove: removeRecord,
    } = useFieldArray({
        control: scoreInputForm.control,
        name: `categories.${index}.records`,
    });

    const handleAppendRecord = (amount: number = 1) => {
        if (amount < 1) return;

        // Generate new records with sequential names based on the last record and amount to add
        const newRecords: { name: string; maxScore: number }[] = [];
        for (let i = 0; i < amount; i++) {
            const name = getNextSequentialRecordName(category.name, [
                ...currentRecords,
                ...newRecords,
            ]);
            newRecords.push({
                name,
                maxScore:
                    currentRecords[currentRecords.length - 1].maxScore ?? 100,
            });
        }

        appendRecord(newRecords, { shouldFocus: false });
        handleFieldChange();
    };

    const handleClearRecords = () => {
        if (currentRecords.length === 0) return;
        removeRecord(currentRecords.map((_, idx) => idx));
        appendRecord({
            name: `${category.name} 1`,
            score: undefined,
            maxScore: 100,
        });
        handleFieldChange();
    };

    return (
        <Collapsible
            className="bg-card text-card-foreground border rounded-xl p-4 @container"
            defaultOpen={index === 0}
        >
            <CollapsibleTrigger
                id={id}
                className="flex items-center gap-2 w-full"
            >
                <div className="flex items-center justify-between gap-2 flex-1 overflow-hidden">
                    <div className="flex items-baseline gap-1 overflow-hidden">
                        <h2 className="text-lg font-semibold line-clamp-1 truncate block">
                            {category.name}
                        </h2>{" "}
                        <span className="text-sm text-muted-foreground">
                            ({category.weight}%)
                        </span>{" "}
                    </div>
                    <Badge
                        variant={
                            currentRecords.length > 0
                                ? "default"
                                : "destructive"
                        }
                    >
                        {currentRecords.length > 0
                            ? `${currentRecords
                                  .filter(
                                      (record) =>
                                          record.score &&
                                          !isNaN(record.score) &&
                                          !isNaN(record.maxScore) &&
                                          record.score.toString() !== "" &&
                                          record.maxScore.toString() !== "",
                                  )
                                  .reduce(
                                      (sum, record) => sum + record.score!,
                                      0,
                                  )
                                  .toLocaleString()} / ${currentRecords
                                  .reduce(
                                      (sum, record) => sum + record.maxScore,
                                      0,
                                  )
                                  .toLocaleString()}`
                            : "No scores yet"}
                    </Badge>
                </div>
                <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Input your scores for each record in the {category.name}{" "}
                    category.
                </p>
                <div className="flex justify-end gap-2 flex-wrap">
                    <AddRecordButton handleAppendRecord={handleAppendRecord} />
                    <ClearAllButton
                        handleClearAll={handleClearRecords}
                        category={category.name}
                        disabled={currentRecords.length <= 1}
                    />
                </div>
                <div className="grid grid-cols-[auto_1fr_1fr_auto] @md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 @md:gap-2 my-4">
                    <div className="grid grid-cols-subgrid col-span-4 @md:col-span-5 gap-2 @max-md:hidden">
                        <span></span>
                        <span className="text-sm text-muted-foreground">
                            Record Name
                        </span>
                        <span className="text-sm text-muted-foreground text-right">
                            Score
                        </span>
                        <span className="text-sm text-muted-foreground text-right">
                            Max Score
                        </span>
                    </div>
                    {recordFields.map((field, recordIndex) => {
                        const recordNameError =
                            errors.categories?.[index]?.records?.[recordIndex]
                                ?.name;
                        const recordScoreError =
                            errors.categories?.[index]?.records?.[recordIndex]
                                ?.score ||
                            errors.categories?.[index]?.records?.[recordIndex]
                                ?.maxScore;
                        const isRecordInvalid = Boolean(
                            recordNameError || recordScoreError,
                        );
                        const isNameOnlyInvalid = Boolean(
                            recordNameError && !recordScoreError,
                        );

                        return (
                            <div
                                key={field.id}
                                className="grid grid-cols-subgrid col-span-5 gap-2"
                            >
                                <span className="text-xs text-muted-foreground content-center @max-md:col-span-4">
                                    <span className="@md:hidden">Record </span>#
                                    {recordIndex + 1}
                                </span>
                                <Controller
                                    control={scoreInputForm.control}
                                    name={`categories.${index}.records.${recordIndex}.name`}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                            className={cn(
                                                "grid grid-rows-subgrid @max-md:col-span-5",
                                                fieldState.invalid &&
                                                    "row-span-2",
                                            )}
                                        >
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={`Record #${recordIndex + 1} Name`}
                                                onChange={(e) => {
                                                    handleFieldChange();
                                                    field.onChange(e);
                                                }}
                                            />
                                            {fieldState.error && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <div
                                    className={cn(
                                        "grid grid-cols-2 col-span-4 @md:col-span-2 grid-rows-subgrid gap-2 @md:max-w-56",
                                        recordScoreError && "row-span-2",
                                    )}
                                >
                                    <Controller
                                        control={scoreInputForm.control}
                                        name={`categories.${index}.records.${recordIndex}.score`}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                                className={cn(
                                                    "grid grid-rows-subgrid",
                                                    fieldState.error &&
                                                        "row-span-2",
                                                )}
                                            >
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Score"
                                                    className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    type="number"
                                                    tabIndex={1}
                                                    onChange={(e) => {
                                                        handleFieldChange();
                                                        const value =
                                                            e.target.value.trim() ===
                                                            ""
                                                                ? ""
                                                                : isNaN(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                  ? field.value
                                                                  : Number(
                                                                        e.target
                                                                            .value,
                                                                    );

                                                        field.onChange(value);

                                                        if (autoCalcuTable) {
                                                            scoreInputForm.trigger(
                                                                [
                                                                    `categories.${index}.records.${recordIndex}.score`,
                                                                    `categories.${index}.records.${recordIndex}.maxScore`,
                                                                ],
                                                            );
                                                        }
                                                    }}
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        control={scoreInputForm.control}
                                        name={`categories.${index}.records.${recordIndex}.maxScore`}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                                className={cn(
                                                    "grid grid-rows-subgrid",
                                                    fieldState.invalid &&
                                                        "row-span-2",
                                                )}
                                            >
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Max Score"
                                                    className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    type="number"
                                                    onChange={(e) => {
                                                        handleFieldChange();
                                                        const value =
                                                            e.target.value ===
                                                            ""
                                                                ? ""
                                                                : isNaN(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                  ? field.value
                                                                  : Number(
                                                                        e.target
                                                                            .value,
                                                                    );

                                                        field.onChange(value);

                                                        if (autoCalcuTable) {
                                                            scoreInputForm.trigger(
                                                                [
                                                                    `categories.${index}.records.${recordIndex}.score`,
                                                                    `categories.${index}.records.${recordIndex}.maxScore`,
                                                                ],
                                                            );
                                                        }
                                                    }}
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        "grid grid-rows-subgrid gap-2",
                                        isRecordInvalid && "row-span-2",
                                        isNameOnlyInvalid &&
                                            "@max-md:row-span-1",
                                    )}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    handleFieldChange();
                                                    removeRecord(recordIndex);
                                                }}
                                                size="icon"
                                                type="button"
                                                disabled={
                                                    recordFields.length === 1
                                                }
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
                        );
                    })}
                </div>
                {recordFields.length > 15 && (
                    <div className="flex justify-end gap-2 flex-wrap">
                        <AddRecordButton
                            handleAppendRecord={handleAppendRecord}
                        />
                        <ClearAllButton
                            handleClearAll={handleClearRecords}
                            category={category.name}
                            disabled={currentRecords.length <= 1}
                        />
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}

function AddRecordButton({
    handleAppendRecord,
}: {
    handleAppendRecord: (amount?: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [bulkAmount, setBulkAmount] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    const handleBulkAdd = () => {
        if (bulkAmount < 1) {
            setError("Please enter a valid number of records to add.");
            return;
        }
        setError(null);
        handleAppendRecord(bulkAmount);
        toast.success(
            `${bulkAmount} record${bulkAmount > 1 ? "s" : ""} added successfully.`,
            {
                icon: <PlusIcon className="size-4" />,
            },
        );
        setIsOpen(false);
    };

    return (
        <ButtonGroup>
            <Button
                onClick={() => handleAppendRecord()}
                type="button"
                variant="outline"
            >
                <PlusIcon />
                Add Record
            </Button>
            <Popover
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setBulkAmount(1);
                        setError(null);
                    }
                    setIsOpen(open);
                }}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <PopoverContent collisionPadding={15}>
                        <h2 className="text-sm font-semibold mb-2">
                            Bulk Add Records
                        </h2>
                        <Field data-invalid={!!error}>
                            <FieldLabel>Number of records to add</FieldLabel>
                            <Input
                                type="number"
                                min={1}
                                value={bulkAmount}
                                onChange={(e) =>
                                    setBulkAmount(Number(e.target.value))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleBulkAdd();
                                    }
                                }}
                                aria-invalid={!!error}
                            />
                            {error && (
                                <FieldError errors={[{ message: error }]} />
                            )}
                        </Field>
                        <Button onClick={handleBulkAdd} type="button">
                            <PlusIcon />
                            Add
                        </Button>
                    </PopoverContent>
                    <TooltipContent collisionPadding={15}>
                        Bulk add records.
                    </TooltipContent>
                </Tooltip>
            </Popover>
        </ButtonGroup>
    );
}

function ClearAllButton({
    handleClearAll,
    disabled,
    category,
}: {
    handleClearAll: () => void;
    disabled: boolean;
    category: string;
}) {
    return (
        <Button
            onClick={async () => {
                const ok = await confirm({
                    title: "Clear All Records",
                    message: `Are you sure you want to clear all your records in the "${category}" category? This action cannot be undone.`,
                    buttonMessage: "Yes, clear all",
                    buttonVariant: "destructive",
                });

                if (!ok) return;

                handleClearAll();
            }}
            type="button"
            variant="destructive"
            disabled={disabled}
        >
            <Trash2Icon />
            Clear All
        </Button>
    );
}
