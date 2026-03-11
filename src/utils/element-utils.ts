import { getLocator } from "./locator-utils";
import { Locator } from "playwright";
import { TimeoutOption } from "../setup/optional-parameter-types";
import { getPage } from "./page-utils";
export async function getAttributeOfElement(locator: string | Locator, attributeName: string, options?: TimeoutOption): Promise<string | null> {
    return getLocator(locator).getAttribute(attributeName, options);
}

export async function getTextOfElement(locator: string | Locator, options?: TimeoutOption): Promise<string | null> {
    return getLocator(locator).textContent(options);
}

export async function getAllElementText(locator: string | Locator): Promise<Array<string>> {
    return getLocator(locator).allTextContents();
    
}

