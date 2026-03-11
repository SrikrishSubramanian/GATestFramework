import { Locator, Page } from '@playwright/test';


//Navigation options
export type GotoOptions = Parameters<Page['goto']>[1];
export type WaitForLoadStateOptions = Parameters<Page['waitForLoadState']>[0];
export type NavigationOptions = Parameters<Page['goBack']>[0]




//Location options
export type LocatorOptions = Parameters<Page['locator']>[1]

//Assert options

export type SoftOption = { soft?: boolean };
export type TimeoutOption = { timeout?: number };
export type MessageOption = string | { message?: string };
export type ExpectOptions = SoftOption & TimeoutOption & MessageOption;
export type ExpectTextOptions = {
    ignoreCase?: boolean;
    useInnerText?: boolean;
}

//Action options

export type ClickOptions = Parameters<Locator['click']>[0]
export type FillOptions = Parameters<Locator['fill']>[1]
export type ClearOptions = Parameters<Locator['clear']>[0]
export type CheckOptions = Parameters<Locator['check']>[0]
export type SelectOptions = Parameters<Locator['selectOption']>[1]
export type HoverOptions = Parameters<Locator['hover']>[0]
export type FocusOptions = Parameters<Locator['focus']>[0]
export type DragAndDropOptions = Parameters<Locator['dragTo']>[1]
export type DoubleClickOptions = Parameters<Locator['dblclick']>[0]
export type KeyboardOptions = Parameters<Page['keyboard']['press']>[1]