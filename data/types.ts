export interface Program {
	code: string;
	name: string;
	curriculums: {
		name: string;
		internalName: string;
	}[];
	internalName: string;
}

export interface Major {
	code: string;
	name: string;
}

/**
 * Helper type: array of majors (readonly for better inference)
 */
export type MajorsArray = readonly Major[];

/**
 * Extract union of major codes from a majors array type
 */
export type MajorCodes<M extends readonly Major[] = MajorsArray> = M[number]['code'];

export interface Course<M extends readonly Major[] = MajorsArray> {
	code: string;
	name: string;
	units: number;
	/**
	 * When `Course` is used with a concrete `majors` array type `M`,
	 * `majorCode` will be restricted to the codes present in `M`.
	 */
	majorCode?: MajorCodes<M>;
	coreOnly?: boolean;
}

export interface Term<M extends readonly Major[] = MajorsArray> {
	year: number;
	semester: number;
	courses: Course<M>[];
}

export interface Curriculum<M extends readonly Major[] = MajorsArray> {
	name: string;
	internalName: string;
	term: Term<M>[];
	majors?: M;
}