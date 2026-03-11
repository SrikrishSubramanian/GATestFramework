import { Locator } from "playwright";
import { getPage } from "./page-utils";
import { LocatorOptions } from "../setup/optional-parameter-types";

export async function getAllLocators(locator: string | Locator, options?: LocatorOptions): Promise<Locator[]> {
    return typeof locator === 'string' ? getPage().locator(locator, options).all() : locator.all();
}

export function getLocator(locator: string | Locator, options?: LocatorOptions): Locator {
    return typeof locator === 'string' ? getPage().locator(locator, options) : locator;
}
export async function getCountOfLocators(input: string | Locator, options?: LocatorOptions): Promise<number> {
    return getLocator(input, options).count();
}

export async function iterateLocator(input: string | Locator, index: number, options?: LocatorOptions): Promise<Locator> {
    return getLocator(input, options).nth(index);
}
