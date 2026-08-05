import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'decisionTreePage.locators.json'));

export class DecisionTreePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/decision-tree.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
  }

  /** Locator for a_Optional_CTA */
  get a_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Optional_CTA);
  }

  /** Locator for ShowOrHideOptions */
  get ShowOrHideOptions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ShowOrHideOptions);
  }

  /** Locator for Spouse */
  get Spouse(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Spouse);
  }

  /** Locator for Traditional */
  get Traditional(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Traditional);
  }

  /** Locator for Roth */
  get Roth(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Roth);
  }

  /** Locator for MoreInformationAbout_DeathO */
  get MoreInformationAbout_DeathO(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.MoreInformationAbout_DeathO);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for Today */
  get Today(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Today);
  }

  /** Locator for Before_1120 */
  get Before_1120(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Before_1120);
  }

  /** Locator for el1120OrLater */
  get el1120OrLater(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.el1120OrLater);
  }

  /** Locator for NonSpouse */
  get NonSpouse(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.NonSpouse);
  }

  /** Locator for SeeThrough_Trust */
  get SeeThrough_Trust(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.SeeThrough_Trust);
  }

  /** Locator for Successor_Beneficiary */
  get Successor_Beneficiary(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Successor_Beneficiary);
  }

  /** Locator for h3_RequiredBeginningDate */
  get h3_RequiredBeginningDate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_RequiredBeginningDate);
  }

  /** Locator for Step_1_Select_RelationshipTo_ */
  get Step_1_Select_RelationshipTo_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Step_1_Select_RelationshipTo_);
  }

  /** Locator for Select_Market_Type */
  get Select_Market_Type(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Select_Market_Type);
  }

  /** Locator for decisionTreeStep_62fd22cd19Modal */
  get decisionTreeStep_62fd22cd19Modal(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.decisionTreeStep_62fd22cd19Modal);
  }

  /** Locator for DeathOf_Original_IRA_Owner */
  get DeathOf_Original_IRA_Owner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.DeathOf_Original_IRA_Owner);
  }

  /** Locator for p_Select_RelationshipTo_IRA_Own */
  get p_Select_RelationshipTo_IRA_Own(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Select_RelationshipTo_IRA_Own);
  }

  /** Locator for p_Select_Market_Type */
  get p_Select_Market_Type(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_Select_Market_Type);
  }

  /** Locator for p_DeathOf_Original_IRA_Owner */
  get p_DeathOf_Original_IRA_Owner(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_DeathOf_Original_IRA_Owner);
  }

  /** Locator for div_21 */
  get div_21(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_21);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for span_Step_1 */
  get span_Step_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Step_1);
  }

  /** Locator for span_Spouse */
  get span_Spouse(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Spouse);
  }

  /** Locator for span_Optional_Description */
  get span_Optional_Description(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_Description);
  }

  /** Locator for span_26 */
  get span_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_26);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for div_28 */
  get div_28(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_28);
  }

  /** Locator for div_29 */
  get div_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_29);
  }

  /** Locator for span_Step_2 */
  get span_Step_2(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Step_2);
  }

  /** Locator for span_Traditional */
  get span_Traditional(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Traditional);
  }

  /** Locator for div_32 */
  get div_32(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_32);
  }

  /** Locator for span_Roth */
  get span_Roth(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Roth);
  }

  /** Locator for div_34 */
  get div_34(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_34);
  }

  /** Locator for div_35 */
  get div_35(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_35);
  }

  /** Locator for div_36 */
  get div_36(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_36);
  }

  /** Locator for span_Step_3 */
  get span_Step_3(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Step_3);
  }

  /** Locator for div_38 */
  get div_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_38);
  }

  /** Locator for div_39 */
  get div_39(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_39);
  }

  /** Locator for span_Today */
  get span_Today(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Today);
  }

  /** Locator for div_41 */
  get div_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_41);
  }

  /** Locator for div_42 */
  get div_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42);
  }

  /** Locator for div_43 */
  get div_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_43);
  }

  /** Locator for div_44 */
  get div_44(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_44);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  /** Locator for div_46 */
  get div_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_46);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for div_OptionalEyebrow */
  get div_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_OptionalEyebrow);
  }

  /** Locator for div_LoremIpsumDolorSitAmetCon */
  get div_LoremIpsumDolorSitAmetCon(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_LoremIpsumDolorSitAmetCon);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for div_51 */
  get div_51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_51);
  }

  /** Locator for i_52 */
  get i_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_52);
  }

  /** Locator for span_Optional_CTA */
  get span_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_CTA);
  }

  /** Locator for div_54 */
  get div_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_54);
  }

  /** Locator for span_Before_1120 */
  get span_Before_1120(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Before_1120);
  }

  /** Locator for div_ThisIs_Before_1120SectionAr */
  get div_ThisIs_Before_1120SectionAr(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ThisIs_Before_1120SectionAr);
  }

  /** Locator for span_1120OrLater */
  get span_1120OrLater(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_1120OrLater);
  }

  /** Locator for div_ThisIs_1120OrLaterSection_ */
  get div_ThisIs_1120OrLaterSection_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ThisIs_1120OrLaterSection_);
  }

  /** Locator for span_NonSpouse */
  get span_NonSpouse(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_NonSpouse);
  }

  /** Locator for div_60 */
  get div_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_60);
  }

  /** Locator for span_SeeThrough_Trust */
  get span_SeeThrough_Trust(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_SeeThrough_Trust);
  }

  /** Locator for div_62 */
  get div_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_62);
  }

  /** Locator for span_Successor_Beneficiary */
  get span_Successor_Beneficiary(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Successor_Beneficiary);
  }

  /** Locator for div_64 */
  get div_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_64);
  }

  // --- Actions ---

  /** Click a_Optional_CTA */
  async clickAOptionalCta() {
    const el = await this.a_Optional_CTA;
    await el.click();
  }

  /** Click ShowOrHideOptions */
  async clickShoworhideoptions() {
    const el = await this.ShowOrHideOptions;
    await el.click();
  }

  /** Click Spouse */
  async clickSpouse() {
    const el = await this.Spouse;
    await el.click();
  }

  /** Click Traditional */
  async clickTraditional() {
    const el = await this.Traditional;
    await el.click();
  }

  /** Click Roth */
  async clickRoth() {
    const el = await this.Roth;
    await el.click();
  }

  /** Click MoreInformationAbout_DeathO */
  async clickMoreinformationaboutDeatho() {
    const el = await this.MoreInformationAbout_DeathO;
    await el.click();
  }

  /** Click Close */
  async clickClose() {
    const el = await this.Close;
    await el.click();
  }

  /** Click Today */
  async clickToday() {
    const el = await this.Today;
    await el.click();
  }

  /** Click Before_1120 */
  async clickBefore1120() {
    const el = await this.Before_1120;
    await el.click();
  }

  /** Click el1120OrLater */
  async clickEl1120orlater() {
    const el = await this.el1120OrLater;
    await el.click();
  }
}
