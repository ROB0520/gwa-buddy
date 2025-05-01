export interface Data {
    programs: Programs;
    courses:  Courses;
}

export interface Courses {
    [key: string]: BSITElement[];
}

export interface BSITElement {
    code:      string;
    name:      string;
    units:     number;
    semester?: number;
    year:      number;
    major?:    BSITMajorEnum;
}

export enum BSITMajorEnum {
    Dst = "DST",
    Nst = "NST",
    Wst = "WST",
}

export interface Programs {
    BSIT: ProgramsBSIT;
}

export interface ProgramsBSIT {
    code:   string;
    name:   string;
	year:  number[];
    majors: BSITMajorElement[];
}

export interface BSITMajorElement {
    code: BSITMajorEnum;
    name: string;
    year: number[];
}
