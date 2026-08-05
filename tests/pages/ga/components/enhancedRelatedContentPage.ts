import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'enhancedRelatedContentPage.locators.json'));

export class EnhancedRelatedContentPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/enhanced-related-content.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for ViewAllInsights */
  get ViewAllInsights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ViewAllInsights);
  }

  /** Locator for Benefits_Table */
  get Benefits_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Benefits_Table);
  }

  /** Locator for Content_Trail */
  get Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Content_Trail);
  }

  /** Locator for Feature_Banner */
  get Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Feature_Banner);
  }

  /** Locator for Headline_Block */
  get Headline_Block(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Headline_Block);
  }

  /** Locator for PreviousRelatedContentSlide */
  get PreviousRelatedContentSlide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PreviousRelatedContentSlide);
  }

  /** Locator for NextRelatedContentSlide */
  get NextRelatedContentSlide(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.NextRelatedContentSlide);
  }

  /** Locator for h3_7 */
  get h3_7(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_7);
  }

  /** Locator for ul_8 */
  get ul_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_8);
  }

  /** Locator for ul_9 */
  get ul_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_9);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for div_11 */
  get div_11(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_11);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for p_OptionalEyebrow */
  get p_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_OptionalEyebrow);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_ViewAllInsights */
  get div_ViewAllInsights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ViewAllInsights);
  }

  /** Locator for span_ViewAllInsights */
  get span_ViewAllInsights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_ViewAllInsights);
  }

  /** Locator for span_17 */
  get span_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_17);
  }

  /** Locator for div_18 */
  get div_18(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_18);
  }

  /** Locator for li_19 */
  get li_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_19);
  }

  /** Locator for div_20 */
  get div_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_20);
  }

  /** Locator for dialog_21 */
  get dialog_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_21);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for div_23 */
  get div_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_23);
  }

  /** Locator for div_24 */
  get div_24(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_24);
  }

  /** Locator for p_Benefits_Table */
  get p_Benefits_Table(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Benefits_Table);
  }

  /** Locator for p_26 */
  get p_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_26);
  }

  /** Locator for span_ReadThe_Artilce */
  get span_ReadThe_Artilce(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_ReadThe_Artilce);
  }

  /** Locator for i_28 */
  get i_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_28);
  }

  /** Locator for span_ReadThe_Artilce_29 */
  get span_ReadThe_Artilce_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_ReadThe_Artilce_29);
  }

  /** Locator for div_30 */
  get div_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30);
  }

  /** Locator for span_Development */
  get span_Development(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Development);
  }

  /** Locator for span_Tutorials */
  get span_Tutorials(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Tutorials);
  }

  /** Locator for span_Insights */
  get span_Insights(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Insights);
  }

  /** Locator for li_34 */
  get li_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for p_Content_Trail */
  get p_Content_Trail(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Content_Trail);
  }

  /** Locator for p_Content_Trail_Description */
  get p_Content_Trail_Description(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Content_Trail_Description);
  }

  /** Locator for li_38 */
  get li_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_38);
  }

  /** Locator for div_39 */
  get div_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_39);
  }

  /** Locator for p_Feature_Banner */
  get p_Feature_Banner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Feature_Banner);
  }

  /** Locator for p_Feature_Banner_Description */
  get p_Feature_Banner_Description(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Feature_Banner_Description);
  }

  /** Locator for li_42 */
  get li_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_42);
  }

  /** Locator for div_43 */
  get div_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_43);
  }

  /** Locator for p_Headline_Block */
  get p_Headline_Block(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Headline_Block);
  }

  /** Locator for p_Headline_Block_Description */
  get p_Headline_Block_Description(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Headline_Block_Description);
  }

  /** Locator for div_46 */
  get div_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_46);
  }

  /** Locator for i_47 */
  get i_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_47);
  }

  /** Locator for div_48 */
  get div_48(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_48);
  }

  /** Locator for el1Of_6 */
  get el1Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el1Of_6);
  }

  /** Locator for el2Of_6 */
  get el2Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el2Of_6);
  }

  /** Locator for el3Of_6 */
  get el3Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el3Of_6);
  }

  /** Locator for el4Of_6 */
  get el4Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el4Of_6);
  }

  /** Locator for el5Of_6 */
  get el5Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el5Of_6);
  }

  /** Locator for el6Of_6 */
  get el6Of_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el6Of_6);
  }

  // --- Actions ---

  /** Click ViewAllInsights */
  async clickViewallinsights() {
    const el = await this.ViewAllInsights;
    await el.click();
  }

  /** Click Benefits_Table */
  async clickBenefitsTable() {
    const el = await this.Benefits_Table;
    await el.click();
  }

  /** Click Content_Trail */
  async clickContentTrail() {
    const el = await this.Content_Trail;
    await el.click();
  }

  /** Click Feature_Banner */
  async clickFeatureBanner() {
    const el = await this.Feature_Banner;
    await el.click();
  }

  /** Click Headline_Block */
  async clickHeadlineBlock() {
    const el = await this.Headline_Block;
    await el.click();
  }

  /** Click PreviousRelatedContentSlide */
  async clickPreviousrelatedcontentslide() {
    const el = await this.PreviousRelatedContentSlide;
    await el.click();
  }

  /** Click NextRelatedContentSlide */
  async clickNextrelatedcontentslide() {
    const el = await this.NextRelatedContentSlide;
    await el.click();
  }

  /** Click h3_7 */
  async clickH37() {
    const el = await this.h3_7;
    await el.click();
  }

  /** Click ul_8 */
  async clickUl8() {
    const el = await this.ul_8;
    await el.click();
  }

  /** Click ul_9 */
  async clickUl9() {
    const el = await this.ul_9;
    await el.click();
  }
}
