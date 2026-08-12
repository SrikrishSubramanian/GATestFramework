import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'productPathDetailCardPage.locators.json'));

export class ProductPathDetailCardPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/product-path-detail-card.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/product-path-detail-card.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for a_FindAn_Advisor */
  get a_FindAn_Advisor(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_FindAn_Advisor);
  }

  /** Locator for a_1 */
  get a_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_1);
  }

  /** Locator for a_Learn_More */
  get a_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Learn_More);
  }

  /** Locator for img_PersonReviewingFin */
  get img_PersonReviewingFin(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_PersonReviewingFin);
  }

  /** Locator for img_PortraitOf_Sarah_R */
  get img_PortraitOf_Sarah_R(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.img_PortraitOf_Sarah_R);
  }

  /** Locator for ul_5 */
  get ul_5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_5);
  }

  /** Locator for ul_6 */
  get ul_6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_6);
  }

  /** Locator for div_Path_A */
  get div_Path_A(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_A);
  }

  /** Locator for div_8 */
  get div_8(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_8);
  }

  /** Locator for div_9 */
  get div_9(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_9);
  }

  /** Locator for div_10 */
  get div_10(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_10);
  }

  /** Locator for div_Maximize_My_Reliability */
  get div_Maximize_My_Reliability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Maximize_My_Reliability);
  }

  /** Locator for div_12 */
  get div_12(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_12);
  }

  /** Locator for div_13 */
  get div_13(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_13);
  }

  /** Locator for div_14 */
  get div_14(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_14);
  }

  /** Locator for div_15 */
  get div_15(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_15);
  }

  /** Locator for div_HowItWorks */
  get div_HowItWorks(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_HowItWorks);
  }

  /** Locator for li_17 */
  get li_17(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_17);
  }

  /** Locator for div_Guaranteed_Rollup */
  get div_Guaranteed_Rollup(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Guaranteed_Rollup);
  }

  /** Locator for div_19 */
  get div_19(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_19);
  }

  /** Locator for li_20 */
  get li_20(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_20);
  }

  /** Locator for div_Flexible_Income_Options */
  get div_Flexible_Income_Options(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Flexible_Income_Options);
  }

  /** Locator for div_22 */
  get div_22(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_22);
  }

  /** Locator for li_23 */
  get li_23(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_23);
  }

  /** Locator for div_Principal_Protection */
  get div_Principal_Protection(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Principal_Protection);
  }

  /** Locator for div_25 */
  get div_25(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_25);
  }

  /** Locator for div_26 */
  get div_26(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_26);
  }

  /** Locator for div_27 */
  get div_27(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_27);
  }

  /** Locator for div_Path_B */
  get div_Path_B(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_B);
  }

  /** Locator for div_29 */
  get div_29(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_29);
  }

  /** Locator for div_30 */
  get div_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_30);
  }

  /** Locator for div_31 */
  get div_31(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_31);
  }

  /** Locator for div_Build_Guaranteed_Income */
  get div_Build_Guaranteed_Income(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Build_Guaranteed_Income);
  }

  /** Locator for div_33 */
  get div_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_33);
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

  /** Locator for div_IncomeYouCanCountOn */
  get div_IncomeYouCanCountOn(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_IncomeYouCanCountOn);
  }

  /** Locator for div_38 */
  get div_38(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_38);
  }

  /** Locator for div_Path_C */
  get div_Path_C(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_C);
  }

  /** Locator for div_40 */
  get div_40(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_40);
  }

  /** Locator for div_41 */
  get div_41(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_41);
  }

  /** Locator for div_42 */
  get div_42(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_42);
  }

  /** Locator for div_SecureA_Higher_Starting_Check */
  get div_SecureA_Higher_Starting_Check(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_SecureA_Higher_Starting_Check);
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

  /** Locator for div_ReadyToGetStarted */
  get div_ReadyToGetStarted(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ReadyToGetStarted);
  }

  /** Locator for div_49 */
  get div_49(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_49);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for div_51 */
  get div_51(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_51);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for div_53 */
  get div_53(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_53);
  }

  /** Locator for div_KeyBenefits */
  get div_KeyBenefits(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_KeyBenefits);
  }

  /** Locator for div_55 */
  get div_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_55);
  }

  /** Locator for div_56 */
  get div_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_56);
  }

  /** Locator for li_57 */
  get li_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_57);
  }

  /** Locator for div_Flexible_Riders */
  get div_Flexible_Riders(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Flexible_Riders);
  }

  /** Locator for div_59 */
  get div_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_59);
  }

  /** Locator for div_60 */
  get div_60(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_60);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for div_ReadyToLearnMore */
  get div_ReadyToLearnMore(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ReadyToLearnMore);
  }

  /** Locator for div_63 */
  get div_63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_63);
  }

  /** Locator for div_Path_D */
  get div_Path_D(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Path_D);
  }

  /** Locator for div_Protect_What_Matters_Most */
  get div_Protect_What_Matters_Most(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Protect_What_Matters_Most);
  }

  /** Locator for div_Protect_What_Matters_Most_66 */
  get div_Protect_What_Matters_Most_66(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Protect_What_Matters_Most_66);
  }

  /** Locator for div_Protect_What_Matters_Most_67 */
  get div_Protect_What_Matters_Most_67(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Protect_What_Matters_Most_67);
  }

  /** Locator for div_Protect_What_Matters_Most_68 */
  get div_Protect_What_Matters_Most_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Protect_What_Matters_Most_68);
  }

  /** Locator for div_69 */
  get div_69(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_69);
  }

  /** Locator for div_70 */
  get div_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_70);
  }

  /** Locator for div_Client_Case_Study */
  get div_Client_Case_Study(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Client_Case_Study);
  }

  /** Locator for div_72 */
  get div_72(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_72);
  }

  /** Locator for div_73 */
  get div_73(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_73);
  }

  /** Locator for div_74 */
  get div_74(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_74);
  }

  /** Locator for div_75 */
  get div_75(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_75);
  }

  /** Locator for div_IncomeForLife */
  get div_IncomeForLife(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_IncomeForLife);
  }

  /** Locator for div_77 */
  get div_77(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_77);
  }

  /** Locator for div_78 */
  get div_78(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_78);
  }

  /** Locator for div_79 */
  get div_79(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_79);
  }

  /** Locator for div_80 */
  get div_80(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_80);
  }

  /** Locator for div_81 */
  get div_81(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_81);
  }

  /** Locator for div_82 */
  get div_82(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_82);
  }

  /** Locator for div_83 */
  get div_83(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_83);
  }

  /** Locator for div_WhyThisPathWorks */
  get div_WhyThisPathWorks(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_WhyThisPathWorks);
  }

  /** Locator for li_85 */
  get li_85(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_85);
  }

  /** Locator for div_Inflation_Protection */
  get div_Inflation_Protection(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Inflation_Protection);
  }

  /** Locator for div_87 */
  get div_87(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_87);
  }

  /** Locator for li_88 */
  get li_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_88);
  }

  /** Locator for div_Lifetime_Guarantee */
  get div_Lifetime_Guarantee(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Lifetime_Guarantee);
  }

  /** Locator for div_90 */
  get div_90(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_90);
  }

  /** Locator for div_91 */
  get div_91(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_91);
  }

  /** Locator for div_92 */
  get div_92(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_92);
  }

  /** Locator for figure_93 */
  get figure_93(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.figure_93);
  }

  /** Locator for picture_94 */
  get picture_94(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_94);
  }

  /** Locator for blockquote_95 */
  get blockquote_95(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_95);
  }

  /** Locator for div_Sarah_M_Retired_Teacher */
  get div_Sarah_M_Retired_Teacher(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Sarah_M_Retired_Teacher);
  }

  /** Locator for div_97 */
  get div_97(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_97);
  }

  /** Locator for div_98 */
  get div_98(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_98);
  }

  /** Locator for div_99 */
  get div_99(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_99);
  }

  /** Locator for div_100 */
  get div_100(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_100);
  }

  /** Locator for div_BuiltForReliability */
  get div_BuiltForReliability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_BuiltForReliability);
  }

  /** Locator for div_102 */
  get div_102(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_102);
  }

  /** Locator for div_103 */
  get div_103(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_103);
  }

  /** Locator for blockquote_104 */
  get blockquote_104(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_104);
  }

  /** Locator for div_105 */
  get div_105(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_105);
  }

  /** Locator for div_106 */
  get div_106(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_106);
  }

  /** Locator for blockquote_107 */
  get blockquote_107(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.blockquote_107);
  }

  /** Locator for div_James_T_Retired_Firefighter */
  get div_James_T_Retired_Firefighter(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_James_T_Retired_Firefighter);
  }

  // --- Actions ---

  /** Click a_FindAn_Advisor */
  async clickAFindanAdvisor() {
    const el = await this.a_FindAn_Advisor;
    await el.click();
  }

  /** Click a_1 */
  async clickA1() {
    const el = await this.a_1;
    await el.click();
  }

  /** Click a_Learn_More */
  async clickALearnMore() {
    const el = await this.a_Learn_More;
    await el.click();
  }

  /** Click img_PersonReviewingFin */
  async clickImgPersonreviewingfin() {
    const el = await this.img_PersonReviewingFin;
    await el.click();
  }

  /** Click img_PortraitOf_Sarah_R */
  async clickImgPortraitofSarahR() {
    const el = await this.img_PortraitOf_Sarah_R;
    await el.click();
  }

  /** Click ul_5 */
  async clickUl5() {
    const el = await this.ul_5;
    await el.click();
  }

  /** Click ul_6 */
  async clickUl6() {
    const el = await this.ul_6;
    await el.click();
  }

  /** Click div_Path_A */
  async clickDivPathA() {
    const el = await this.div_Path_A;
    await el.click();
  }

  /** Click div_8 */
  async clickDiv8() {
    const el = await this.div_8;
    await el.click();
  }

  /** Click div_9 */
  async clickDiv9() {
    const el = await this.div_9;
    await el.click();
  }
}
