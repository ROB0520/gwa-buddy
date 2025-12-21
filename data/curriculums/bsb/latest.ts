import { Curriculum } from "@/data/types";

const majors = [
	{
		code: "MB",
		name: "Medical Biology"
	}
] as const;

export default {
	name: "Latest Curriculum",
	internalName: "latest",
	majors,
	term: [
		{
			year: 1,
			semester: 1,
			courses: [
				{
					code: "GE FIL 1",
					name: "Kontekswalisadong Komunikasyon sa Filipino",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "GE 02",
					name: "Readings in Philippine History",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 1",
					name: "General Botany",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "GE 04",
					name: "Mathematics in the Modern World",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 2",
					name: "General Zoology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "PATHFit 01",
					name: "Movement Competency Training",
					units: 2,
					majorCode: "MB"
				}
			]
		},
		{
			year: 1,
			semester: 2,
			courses: [
				{
					code: "GE FIL 2",
					name: "Filipino sa Iba't Ibang Disiplina",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "GE 05",
					name: "Purposive Communication",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 3",
					name: "Systematics",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "ChemBio 1",
					name: "Organic Molecules",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "BioStat",
					name: "Statistical Biology",
					units: 4,
					majorCode: "MB"
				},
				{
					code: "PATHFit 02",
					name: "Exercise-based Fitness Activities",
					units: 2,
					majorCode: "MB"
				},
				{
					code: "ChemBio 1.1",
					name: "Organic Molecules Laboratory",
					units: 1,
					majorCode: "MB"
				}
			]
		},
		{
			year: 2,
			semester: 1,
			courses: [
				{
					code: "GE 06",
					name: "Art Appreciation",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "GE FIL 3",
					name: "Panitikan Sosyedad at Literatura/Panitikan Panlipunan (SOSLIT)",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 4",
					name: "Microbiology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "ChemBio 2",
					name: "Analytical Methods for Biology",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 5",
					name: "General Ecology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "PATHFit 03",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2,
					majorCode: "MB"
				},
				{
					code: "ChemBio 2.1",
					name: "Analytical Methods for Biology Laboratory",
					units: 1,
					majorCode: "MB"
				}
			]
		},
		{
			year: 2,
			semester: 2,
			courses: [
				{
					code: "ChemBio 3",
					name: "Biomolecules",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 6",
					name: "Evolutionary Biology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "Bio 7",
					name: "Genetics",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "PATHFit 04",
					name: "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
					units: 2,
					majorCode: "MB"
				},
				{
					code: "GE 08",
					name: "Ethics",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "ChemBio 3.1",
					name: "Biomolecules Laboratory",
					units: 2,
					majorCode: "MB"
				},
				{
					code: "ELP",
					name: "English for Biologist",
					units: 3,
					majorCode: "MB"
				}
			]
		},
		{
			year: 3,
			semester: 1,
			courses: [
				{
					code: "GE 03",
					name: "The Contemporary World",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Bio 8",
					name: "Cell and Molecular Biology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "Bio 9",
					name: "General Physiology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "GE 07",
					name: "Science, Technology and Society",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "GE 09",
					name: "The Life and Works of Rizal",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "GE 01",
					name: "Understanding the Self",
					units: 3,
					majorCode: "MB"
				}
			]
		},
		{
			year: 3,
			semester: 2,
			courses: [
				{
					code: "BioPhys",
					name: "BioPhysics",
					units: 4,
					majorCode: "MB"
				},
				{
					code: "Bio 10",
					name: "Developmental Biology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "MedBio 1",
					name: "Human Anatomy and Physiology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "MedBio 5",
					name: "Medical Microbiology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "Res 1",
					name: "Thesis 1",
					units: 2,
					majorCode: "MB"
				}
			]
		},
		{
			year: 3,
			semester: 3,
			courses: [
				{
					code: "OJT",
					name: "On-the-Job Training",
					units: 3,
					majorCode: "MB"
				}
			]
		},
		{
			year: 4,
			semester: 1,
			courses: [
				{
					code: "MedBio 3",
					name: "Medical Histology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "MedBio 4",
					name: "Medical Parasitology",
					units: 5,
					majorCode: "MB"
				},
				{
					code: "MedBio 2",
					name: "Epidemiology",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "Res 2",
					name: "Thesis 2",
					units: 2,
					majorCode: "MB"
				}
			]
		},
		{
			year: 4,
			semester: 2,
			courses: [
				{
					code: "Res 3",
					name: "Thesis 3",
					units: 2,
					majorCode: "MB"
				},
				{
					code: "BE",
					name: "Bioethics",
					units: 1,
					majorCode: "MB"
				},
				{
					code: "MedBio 6",
					name: "Health Biotechnology",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "ELEC1",
					name: "Elective 1",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "ELEC2",
					name: "Elective 2",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "ELEC3",
					name: "Elective 3",
					units: 3,
					majorCode: "MB"
				},
				{
					code: "BioSem",
					name: "BioSeminar",
					units: 1,
					majorCode: "MB"
				}
			]
		}
	]
} satisfies Curriculum<typeof majors>;
