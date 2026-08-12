import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '../locators/accordionTabsFeaturePage.locators.json'));

export class AccordionTabsFeaturePage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    try {
      return await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // AEM's Unified Shell can still be mid-redirect (to its own aem/start.html
      // console) right after login, interrupting this navigation. Retry once.
      if (err instanceof Error && (err.message.includes('interrupted by another navigation') || err.message.includes('NS_ERROR_ABORT'))) {
        return this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/accordion-tabs-feature.html?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
      }
      throw err;
    }
  }

  /** Locator for Learn_More */
  get Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Learn_More);
  }

  /** Locator for Plan_Ahead */
  get Plan_Ahead(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Plan_Ahead);
  }

  /** Locator for View_Products */
  get View_Products(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.View_Products);
  }

  /** Locator for Explore_Markets */
  get Explore_Markets(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Explore_Markets);
  }

  /** Locator for Our_Approach */
  get Our_Approach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Our_Approach);
  }

  /** Locator for View_Portfolio */
  get View_Portfolio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.View_Portfolio);
  }

  /** Locator for Read_More */
  get Read_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Read_More);
  }

  /** Locator for Start_Exploring */
  get Start_Exploring(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Start_Exploring);
  }

  /** Locator for Learn_Process */
  get Learn_Process(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Learn_Process);
  }

  /** Locator for View_Success_Stories */
  get View_Success_Stories(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.View_Success_Stories);
  }

  /** Locator for Our_Strength */
  get Our_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Our_Strength);
  }

  /** Locator for MeetThe_Team */
  get MeetThe_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.MeetThe_Team);
  }

  /** Locator for Our_Innovation */
  get Our_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Our_Innovation);
  }

  /** Locator for button_Wealth_Management */
  get button_Wealth_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Wealth_Management);
  }

  /** Locator for button_Retirement_Planning */
  get button_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Retirement_Planning);
  }

  /** Locator for button_Insurance_Solutions */
  get button_Insurance_Solutions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Insurance_Solutions);
  }

  /** Locator for button_Global_Reach */
  get button_Global_Reach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Global_Reach);
  }

  /** Locator for button_Innovation */
  get button_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Innovation);
  }

  /** Locator for button_Sustainability */
  get button_Sustainability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Sustainability);
  }

  /** Locator for button_Investment_Strategy */
  get button_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Investment_Strategy);
  }

  /** Locator for button_Portfolio_Management */
  get button_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Portfolio_Management);
  }

  /** Locator for button_Risk_Assessment */
  get button_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Risk_Assessment);
  }

  /** Locator for button_Discover */
  get button_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Discover);
  }

  /** Locator for button_Evaluate */
  get button_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Evaluate);
  }

  /** Locator for button_Execute */
  get button_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Execute);
  }

  /** Locator for button_Financial_Strength */
  get button_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Financial_Strength);
  }

  /** Locator for button_Expert_Team */
  get button_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Expert_Team);
  }

  /** Locator for button_Innovation_Focus */
  get button_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Innovation_Focus);
  }

  /** Locator for h3_Wealth_Management */
  get h3_Wealth_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Wealth_Management);
  }

  /** Locator for h3_Retirement_Planning */
  get h3_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Retirement_Planning);
  }

  /** Locator for h3_Insurance_Solutions */
  get h3_Insurance_Solutions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Insurance_Solutions);
  }

  /** Locator for h3_Global_Reach */
  get h3_Global_Reach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Global_Reach);
  }

  /** Locator for h3_Innovation */
  get h3_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Innovation);
  }

  /** Locator for h3_Sustainability */
  get h3_Sustainability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Sustainability);
  }

  /** Locator for h3_Investment_Strategy */
  get h3_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Investment_Strategy);
  }

  /** Locator for h3_Portfolio_Management */
  get h3_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Portfolio_Management);
  }

  /** Locator for h3_Risk_Assessment */
  get h3_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Risk_Assessment);
  }

  /** Locator for h3_Discover */
  get h3_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Discover);
  }

  /** Locator for h3_Evaluate */
  get h3_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Evaluate);
  }

  /** Locator for h3_Execute */
  get h3_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Execute);
  }

  /** Locator for h3_Financial_Strength */
  get h3_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Financial_Strength);
  }

  /** Locator for h3_Expert_Team */
  get h3_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Expert_Team);
  }

  /** Locator for h3_Innovation_Focus */
  get h3_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h3_Innovation_Focus);
  }

  /** Locator for div_43 */
  get div_43(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_43);
  }

  /** Locator for accordionTabF26cac7ae1 */
  get accordionTabF26cac7ae1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabF26cac7ae1);
  }

  /** Locator for div_45 */
  get div_45(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_45);
  }

  /** Locator for accordionTab_77723d07bb */
  get accordionTab_77723d07bb(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_77723d07bb);
  }

  /** Locator for div_47 */
  get div_47(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_47);
  }

  /** Locator for accordionTab_9e14c1f6be */
  get accordionTab_9e14c1f6be(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_9e14c1f6be);
  }

  /** Locator for div_49 */
  get div_49(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_49);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for accordionTab_85a8815f97 */
  get accordionTab_85a8815f97(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_85a8815f97);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for accordionTabC78a78f9cc */
  get accordionTabC78a78f9cc(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabC78a78f9cc);
  }

  /** Locator for div_54 */
  get div_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_54);
  }

  /** Locator for accordionTabCd427f0aef */
  get accordionTabCd427f0aef(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabCd427f0aef);
  }

  /** Locator for div_56 */
  get div_56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_56);
  }

  /** Locator for div_57 */
  get div_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_57);
  }

  /** Locator for accordionTabCbe058cfe6 */
  get accordionTabCbe058cfe6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabCbe058cfe6);
  }

  /** Locator for div_59 */
  get div_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_59);
  }

  /** Locator for accordionTabB58b139277 */
  get accordionTabB58b139277(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabB58b139277);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for accordionTab_2cb0f20a56 */
  get accordionTab_2cb0f20a56(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_2cb0f20a56);
  }

  /** Locator for div_63 */
  get div_63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_63);
  }

  /** Locator for div_64 */
  get div_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_64);
  }

  /** Locator for accordionTab_247651daa6 */
  get accordionTab_247651daa6(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_247651daa6);
  }

  /** Locator for div_66 */
  get div_66(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_66);
  }

  /** Locator for accordionTab_358981e219 */
  get accordionTab_358981e219(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_358981e219);
  }

  /** Locator for div_68 */
  get div_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_68);
  }

  /** Locator for accordionTab_1c86a17c0e */
  get accordionTab_1c86a17c0e(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_1c86a17c0e);
  }

  /** Locator for div_70 */
  get div_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_70);
  }

  /** Locator for div_71 */
  get div_71(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_71);
  }

  /** Locator for accordionTab_684bf12147 */
  get accordionTab_684bf12147(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_684bf12147);
  }

  /** Locator for div_73 */
  get div_73(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_73);
  }

  /** Locator for accordionTab_4030f728d5 */
  get accordionTab_4030f728d5(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTab_4030f728d5);
  }

  /** Locator for div_75 */
  get div_75(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_75);
  }

  /** Locator for accordionTabD3a71b7036 */
  get accordionTabD3a71b7036(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.accordionTabD3a71b7036);
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

  /** Locator for span_Wealth_Management */
  get span_Wealth_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Wealth_Management);
  }

  /** Locator for span_83 */
  get span_83(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_83);
  }

  /** Locator for svg_84 */
  get svg_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_84);
  }

  /** Locator for div_85 */
  get div_85(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_85);
  }

  /** Locator for div_86 */
  get div_86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_86);
  }

  /** Locator for div_Wealth_Management */
  get div_Wealth_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Wealth_Management);
  }

  /** Locator for div_88 */
  get div_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_88);
  }

  /** Locator for div_89 */
  get div_89(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_89);
  }

  /** Locator for div_Learn_More */
  get div_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_More);
  }

  /** Locator for span_91 */
  get span_91(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_91);
  }

  /** Locator for span_Learn_More */
  get span_Learn_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Learn_More);
  }

  /** Locator for div_93 */
  get div_93(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_93);
  }

  /** Locator for span_Retirement_Planning */
  get span_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Retirement_Planning);
  }

  /** Locator for div_95 */
  get div_95(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_95);
  }

  /** Locator for div_96 */
  get div_96(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_96);
  }

  /** Locator for div_Retirement_Planning */
  get div_Retirement_Planning(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Retirement_Planning);
  }

  /** Locator for div_98 */
  get div_98(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_98);
  }

  /** Locator for div_99 */
  get div_99(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_99);
  }

  /** Locator for div_Plan_Ahead */
  get div_Plan_Ahead(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Plan_Ahead);
  }

  /** Locator for span_Plan_Ahead */
  get span_Plan_Ahead(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Plan_Ahead);
  }

  /** Locator for div_102 */
  get div_102(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_102);
  }

  /** Locator for span_Insurance_Solutions */
  get span_Insurance_Solutions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Insurance_Solutions);
  }

  /** Locator for div_104 */
  get div_104(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_104);
  }

  /** Locator for div_105 */
  get div_105(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_105);
  }

  /** Locator for div_Insurance_Solutions */
  get div_Insurance_Solutions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Insurance_Solutions);
  }

  /** Locator for div_107 */
  get div_107(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_107);
  }

  /** Locator for div_108 */
  get div_108(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_108);
  }

  /** Locator for div_View_Products */
  get div_View_Products(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_View_Products);
  }

  /** Locator for span_View_Products */
  get span_View_Products(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_View_Products);
  }

  /** Locator for div_111 */
  get div_111(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_111);
  }

  /** Locator for div_112 */
  get div_112(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_112);
  }

  /** Locator for div_113 */
  get div_113(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_113);
  }

  /** Locator for div_114 */
  get div_114(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_114);
  }

  /** Locator for div_115 */
  get div_115(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_115);
  }

  /** Locator for div_116 */
  get div_116(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_116);
  }

  /** Locator for div_117 */
  get div_117(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_117);
  }

  /** Locator for span_Global_Reach */
  get span_Global_Reach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Global_Reach);
  }

  /** Locator for div_119 */
  get div_119(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_119);
  }

  /** Locator for div_120 */
  get div_120(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_120);
  }

  /** Locator for div_Global_Reach */
  get div_Global_Reach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Global_Reach);
  }

  /** Locator for div_122 */
  get div_122(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_122);
  }

  /** Locator for div_123 */
  get div_123(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_123);
  }

  /** Locator for div_Explore_Markets */
  get div_Explore_Markets(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Explore_Markets);
  }

  /** Locator for span_Explore_Markets */
  get span_Explore_Markets(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Explore_Markets);
  }

  /** Locator for div_126 */
  get div_126(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_126);
  }

  /** Locator for span_Innovation */
  get span_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Innovation);
  }

  /** Locator for div_128 */
  get div_128(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_128);
  }

  /** Locator for div_129 */
  get div_129(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_129);
  }

  /** Locator for div_Innovation */
  get div_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Innovation);
  }

  /** Locator for div_131 */
  get div_131(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_131);
  }

  /** Locator for div_132 */
  get div_132(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_132);
  }

  /** Locator for div_133 */
  get div_133(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_133);
  }

  /** Locator for span_Sustainability */
  get span_Sustainability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Sustainability);
  }

  /** Locator for div_135 */
  get div_135(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_135);
  }

  /** Locator for div_136 */
  get div_136(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_136);
  }

  /** Locator for div_Sustainability */
  get div_Sustainability(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Sustainability);
  }

  /** Locator for div_138 */
  get div_138(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_138);
  }

  /** Locator for div_139 */
  get div_139(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_139);
  }

  /** Locator for div_Our_Approach */
  get div_Our_Approach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Our_Approach);
  }

  /** Locator for span_Our_Approach */
  get span_Our_Approach(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Our_Approach);
  }

  /** Locator for div_142 */
  get div_142(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_142);
  }

  /** Locator for div_143 */
  get div_143(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_143);
  }

  /** Locator for div_144 */
  get div_144(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_144);
  }

  /** Locator for span_Investment_Strategy */
  get span_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Investment_Strategy);
  }

  /** Locator for div_146 */
  get div_146(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_146);
  }

  /** Locator for div_147 */
  get div_147(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_147);
  }

  /** Locator for div_Investment_Strategy */
  get div_Investment_Strategy(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Investment_Strategy);
  }

  /** Locator for div_149 */
  get div_149(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_149);
  }

  /** Locator for div_150 */
  get div_150(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_150);
  }

  /** Locator for div_151 */
  get div_151(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_151);
  }

  /** Locator for span_Portfolio_Management */
  get span_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Portfolio_Management);
  }

  /** Locator for div_153 */
  get div_153(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_153);
  }

  /** Locator for div_154 */
  get div_154(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_154);
  }

  /** Locator for div_Portfolio_Management */
  get div_Portfolio_Management(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Portfolio_Management);
  }

  /** Locator for div_156 */
  get div_156(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_156);
  }

  /** Locator for div_157 */
  get div_157(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_157);
  }

  /** Locator for div_View_Portfolio */
  get div_View_Portfolio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_View_Portfolio);
  }

  /** Locator for span_View_Portfolio */
  get span_View_Portfolio(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_View_Portfolio);
  }

  /** Locator for div_160 */
  get div_160(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_160);
  }

  /** Locator for span_Risk_Assessment */
  get span_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Risk_Assessment);
  }

  /** Locator for div_162 */
  get div_162(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_162);
  }

  /** Locator for div_163 */
  get div_163(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_163);
  }

  /** Locator for div_Risk_Assessment */
  get div_Risk_Assessment(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Risk_Assessment);
  }

  /** Locator for div_165 */
  get div_165(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_165);
  }

  /** Locator for div_166 */
  get div_166(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_166);
  }

  /** Locator for div_Read_More */
  get div_Read_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Read_More);
  }

  /** Locator for span_Read_More */
  get span_Read_More(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Read_More);
  }

  /** Locator for div_169 */
  get div_169(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_169);
  }

  /** Locator for div_170 */
  get div_170(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_170);
  }

  /** Locator for div_171 */
  get div_171(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_171);
  }

  /** Locator for span_Discover */
  get span_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Discover);
  }

  /** Locator for div_173 */
  get div_173(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_173);
  }

  /** Locator for div_174 */
  get div_174(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_174);
  }

  /** Locator for div_Discover */
  get div_Discover(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Discover);
  }

  /** Locator for div_176 */
  get div_176(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_176);
  }

  /** Locator for div_177 */
  get div_177(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_177);
  }

  /** Locator for div_Start_Exploring */
  get div_Start_Exploring(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Start_Exploring);
  }

  /** Locator for span_Start_Exploring */
  get span_Start_Exploring(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Start_Exploring);
  }

  /** Locator for div_180 */
  get div_180(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_180);
  }

  /** Locator for span_Evaluate */
  get span_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Evaluate);
  }

  /** Locator for div_182 */
  get div_182(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_182);
  }

  /** Locator for div_183 */
  get div_183(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_183);
  }

  /** Locator for div_Evaluate */
  get div_Evaluate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Evaluate);
  }

  /** Locator for div_185 */
  get div_185(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_185);
  }

  /** Locator for div_186 */
  get div_186(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_186);
  }

  /** Locator for div_Learn_Process */
  get div_Learn_Process(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Learn_Process);
  }

  /** Locator for span_Learn_Process */
  get span_Learn_Process(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Learn_Process);
  }

  /** Locator for div_189 */
  get div_189(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_189);
  }

  /** Locator for span_Execute */
  get span_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Execute);
  }

  /** Locator for div_191 */
  get div_191(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_191);
  }

  /** Locator for div_192 */
  get div_192(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_192);
  }

  /** Locator for div_Execute */
  get div_Execute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Execute);
  }

  /** Locator for div_194 */
  get div_194(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_194);
  }

  /** Locator for div_195 */
  get div_195(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_195);
  }

  /** Locator for div_View_Success_Stories */
  get div_View_Success_Stories(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_View_Success_Stories);
  }

  /** Locator for span_View_Success_Stories */
  get span_View_Success_Stories(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_View_Success_Stories);
  }

  /** Locator for div_198 */
  get div_198(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_198);
  }

  /** Locator for div_199 */
  get div_199(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_199);
  }

  /** Locator for div_200 */
  get div_200(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_200);
  }

  /** Locator for span_Financial_Strength */
  get span_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Financial_Strength);
  }

  /** Locator for div_202 */
  get div_202(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_202);
  }

  /** Locator for div_203 */
  get div_203(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_203);
  }

  /** Locator for div_Financial_Strength */
  get div_Financial_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Financial_Strength);
  }

  /** Locator for div_205 */
  get div_205(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_205);
  }

  /** Locator for div_206 */
  get div_206(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_206);
  }

  /** Locator for div_Our_Strength */
  get div_Our_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Our_Strength);
  }

  /** Locator for span_Our_Strength */
  get span_Our_Strength(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Our_Strength);
  }

  /** Locator for div_209 */
  get div_209(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_209);
  }

  /** Locator for span_Expert_Team */
  get span_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Expert_Team);
  }

  /** Locator for div_211 */
  get div_211(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_211);
  }

  /** Locator for div_212 */
  get div_212(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_212);
  }

  /** Locator for div_Expert_Team */
  get div_Expert_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Expert_Team);
  }

  /** Locator for div_214 */
  get div_214(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_214);
  }

  /** Locator for div_215 */
  get div_215(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_215);
  }

  /** Locator for div_MeetThe_Team */
  get div_MeetThe_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_MeetThe_Team);
  }

  /** Locator for span_MeetThe_Team */
  get span_MeetThe_Team(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_MeetThe_Team);
  }

  /** Locator for div_218 */
  get div_218(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_218);
  }

  /** Locator for span_Innovation_Focus */
  get span_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Innovation_Focus);
  }

  /** Locator for div_220 */
  get div_220(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_220);
  }

  /** Locator for div_221 */
  get div_221(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_221);
  }

  /** Locator for div_Innovation_Focus */
  get div_Innovation_Focus(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Innovation_Focus);
  }

  /** Locator for div_223 */
  get div_223(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_223);
  }

  /** Locator for div_224 */
  get div_224(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_224);
  }

  /** Locator for div_Our_Innovation */
  get div_Our_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_Our_Innovation);
  }

  /** Locator for span_Our_Innovation */
  get span_Our_Innovation(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Our_Innovation);
  }

  // --- Actions ---

  /** Click Learn_More */
  async clickLearnMore() {
    const el = await this.Learn_More;
    await el.click();
  }

  /** Click Plan_Ahead */
  async clickPlanAhead() {
    const el = await this.Plan_Ahead;
    await el.click();
  }

  /** Click View_Products */
  async clickViewProducts() {
    const el = await this.View_Products;
    await el.click();
  }

  /** Click Explore_Markets */
  async clickExploreMarkets() {
    const el = await this.Explore_Markets;
    await el.click();
  }

  /** Click Our_Approach */
  async clickOurApproach() {
    const el = await this.Our_Approach;
    await el.click();
  }

  /** Click View_Portfolio */
  async clickViewPortfolio() {
    const el = await this.View_Portfolio;
    await el.click();
  }

  /** Click Read_More */
  async clickReadMore() {
    const el = await this.Read_More;
    await el.click();
  }

  /** Click Start_Exploring */
  async clickStartExploring() {
    const el = await this.Start_Exploring;
    await el.click();
  }

  /** Click Learn_Process */
  async clickLearnProcess() {
    const el = await this.Learn_Process;
    await el.click();
  }

  /** Click View_Success_Stories */
  async clickViewSuccessStories() {
    const el = await this.View_Success_Stories;
    await el.click();
  }
}
