import { expect, Expect, Locator } from '@playwright/test';
import { ExpectOptions, ExpectTextOptions, LocatorOptions, SoftOption } from '../setup/optional-parameter-types';
import { getAllLocators, getCountOfLocators, getLocator } from './locator-utils';
import { assert } from 'console';
import { getPage } from './page-utils';



function expectSoftAssertOption(options?: SoftOption): Expect {
  return expect.configure({ soft: options?.soft })

}

export function getLocatorAndAssert(input: string | Locator, options?: SoftOption): { locator: Locator, assert: Expect } {
  const locator = getLocator(input);
  const assert = expectSoftAssertOption(options);
  return { locator, assert };
}
export async function isVisible(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { assert, locator } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeVisible(options);
}

export async function isNotVisible(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { assert, locator } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeVisible(options);
}

export async function isVisibleForListOfElements(input: string | Locator, options?: ExpectOptions) {
  const { assert, locator } = getLocatorAndAssert(input, options);
  const locators = await getAllLocators(locator)
  const count = await getCountOfLocators(locator)
  for (let i = 0; i < count; i++) {
    await assert(locators[i], options).toBeVisible(options);
  }

}

export async function expectToBeLessThan(expectedNum: Number, actualNum: number | bigint, options?: ExpectOptions): Promise<void> {
  const assert = expectSoftAssertOption(options);
  assert(expectedNum).toBeLessThan(actualNum);
}

export async function expectToBeLessThanOrEqualTo(expectedNum: Number, actualNum: number | bigint, options?: ExpectOptions): Promise<void> {
  const assert = expectSoftAssertOption(options);
  assert(expectedNum).toBeLessThanOrEqual(actualNum);
}
export async function expectElementToHaveText(input: string | Locator, text: string | RegExp | ReadonlyArray<string | RegExp>, options?: ExpectOptions & ExpectTextOptions) {
  const { assert, locator } = getLocatorAndAssert(input, options)
  await assert(locator, options).toHaveText(text, options);
}

export async function assertPageTitle(titleOrRegExp: string | RegExp, options?: ExpectOptions): Promise<void> {
  const assert = expectSoftAssertOption(options)
  await assert(getPage()).toHaveTitle(titleOrRegExp, options)
}

export async function assertNumber(expectedNum: number, actualNum: number) {
  const assert = expectSoftAssertOption();
  assert(expectedNum).toBe(actualNum)

}

export async function assertString(expectedString: string, actualString: string) {
  const assert = expectSoftAssertOption();
  assert(expectedString).toBe(actualString)

}

export async function expectElementToBeEmpty(input: string | Locator, options?: ExpectOptions) {
  const { assert, locator } = getLocatorAndAssert(input, options);
  assert(locator, options).toBeEmpty(options)
}

export async function expectElementToBeHidden(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeHidden(options);
}

export async function expectElementToHaveCount(
  input: string | Locator,
  count: number,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveCount(count, options);
}


export async function expectElementToHaveAttribute(
  input: string | Locator,
  attribute: string,
  value: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveAttribute(attribute, value, options);
}

export async function expectElementToContainAttribute(
  input: string | Locator,
  attribute: string,
  value: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveAttribute(attribute, new RegExp(value), options);
}
export async function expectElementToHaveClass(
  input: string | Locator,
  classValue: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveClass(classValue, options);
}

export async function expectToEqual(expected: any, actual: any, options?: SoftOption) {
  const assert = expectSoftAssertOption(options)
  assert(expected).toEqual(actual)
}

export async function expectBoolean(expected: boolean, actual: boolean, options?: SoftOption) {
  const assert = expectSoftAssertOption(options)
  assert(expected).toBe(actual)
}

export async function expectElementToBeChecked(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeChecked(options);
}


export async function expectElementNotToBeChecked(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeChecked(options);
}


export async function expectElementToBeDisabled(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeDisabled(options);
}


export async function expectElementToBeEnabled(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeEnabled(options);
}

export async function expectElementValueToBeEmpty(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeEmpty(options);
}

export async function expectElementValueNotToBeEmpty(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeEmpty(options);
}