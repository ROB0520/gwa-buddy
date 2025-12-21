import { Curriculum } from "@/data/types";

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	term: [
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "CRIM 6",
					name: "Dispute Resolution and Crises/Incidents Management",
					units: 3
				},
				{
					code: "CDI 6",
					name: "Fire Technology & Arson Investigation",
					units: 3
				},
				{
					code: "LEA 4",
					name: "Law Enforcement Operations and Planning with Crime Mapping",
					units: 3
				},
				{
					code: "CDI 8",
					name: "Technical English II (Legal Forms)",
					units: 3
				},
				{
					code: "CFLM 1",
					name: "Character Formation 1: Nationalism and Patriotism with Environmental Laws",
					units: 3
				},
				{
					code: "CA 2",
					name: "Non-Institutional Corrections",
					units: 3
				},
				{
					code: "FORENSIC 5",
					name: "Lie Detection Techniques",
					units: 3
				},
				{
					code: "C JURIS 5",
					name: "Evidence",
					units: 3
				}
			]
		}
	]
} satisfies Curriculum;
