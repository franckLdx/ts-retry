import { DELAY } from "../options";
export declare function createExponetialDelay<RETURN_TYPE>(initialDelay: number): DELAY<RETURN_TYPE>;
export declare function createMutiplicableDelay<RETURN_TYPE>(initialDelay: number, multiplicator: number): DELAY<RETURN_TYPE>;
export declare function createRandomDelay<RETURN_TYPE>(min: number, max: number): DELAY<RETURN_TYPE>;
