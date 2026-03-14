import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, 'featureBannerPage.locators.json'));

export class FeatureBannerPage {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/content/global-atlantic/style-guide/components/feature-banner.html?wcmmode=disabled`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.feature-banner', { timeout: 15000 });
  }

  /** Locator for a_Optional_CTA */
  get a_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_Optional_CTA);
  }

  /** Locator for a_1 */
  get a_1(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.a_1);
  }

  /** Locator for button_Play_Video */
  get button_Play_Video(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Play_Video);
  }

  /** Locator for button_Pause */
  get button_Pause(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Pause);
  }

  /** Locator for button_SkipBackward_5Seconds */
  get button_SkipBackward_5Seconds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_SkipBackward_5Seconds);
  }

  /** Locator for button_SkipForward_5Seconds */
  get button_SkipForward_5Seconds(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_SkipForward_5Seconds);
  }

  /** Locator for button_Unmute */
  get button_Unmute(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Unmute);
  }

  /** Locator for button_SeekToLiveCurrentlyBehind_ */
  get button_SeekToLiveCurrentlyBehind_(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_SeekToLiveCurrentlyBehind_);
  }

  /** Locator for button_Playback_Rate */
  get button_Playback_Rate(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Playback_Rate);
  }

  /** Locator for button_Chapters */
  get button_Chapters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Chapters);
  }

  /** Locator for button_Descriptions */
  get button_Descriptions(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Descriptions);
  }

  /** Locator for button_Subtitles */
  get button_Subtitles(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Subtitles);
  }

  /** Locator for button_Audio_Track */
  get button_Audio_Track(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Audio_Track);
  }

  /** Locator for button_Fullscreen */
  get button_Fullscreen(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Fullscreen);
  }

  /** Locator for button_Reset */
  get button_Reset(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Reset);
  }

  /** Locator for button_Done */
  get button_Done(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Done);
  }

  /** Locator for button_Close_Modal_Dialog */
  get button_Close_Modal_Dialog(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.button_Close_Modal_Dialog);
  }

  /** Locator for PlayVideo */
  get PlayVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PlayVideo);
  }

  /** Locator for PauseVideo */
  get PauseVideo(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.PauseVideo);
  }

  /** Locator for select_WhiteBlackRedGreenBlueYellowMa */
  get select_WhiteBlackRedGreenBlueYellowMa(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_WhiteBlackRedGreenBlueYellowMa);
  }

  /** Locator for select_OpaqueSemiTransparent */
  get select_OpaqueSemiTransparent(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_OpaqueSemiTransparent);
  }

  /** Locator for select_BlackWhiteRedGreenBlueYellowMa */
  get select_BlackWhiteRedGreenBlueYellowMa(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_BlackWhiteRedGreenBlueYellowMa);
  }

  /** Locator for select_OpaqueSemiTransparentTranspare */
  get select_OpaqueSemiTransparentTranspare(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_OpaqueSemiTransparentTranspare);
  }

  /** Locator for select_TransparentSemiTransparentOpaq */
  get select_TransparentSemiTransparentOpaq(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_TransparentSemiTransparentOpaq);
  }

  /** Locator for select_5075100125150175200300400 */
  get select_5075100125150175200300400(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_5075100125150175200300400);
  }

  /** Locator for select_NoneRaisedDepressedUniformDrop */
  get select_NoneRaisedDepressedUniformDrop(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.select_NoneRaisedDepressedUniformDrop);
  }

  /** Locator for vjsSelect_665 */
  get vjsSelect_665(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.vjsSelect_665);
  }

  /** Locator for h2_LoremIpsumDolorSitAmetCon */
  get h2_LoremIpsumDolorSitAmetCon(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.h2_LoremIpsumDolorSitAmetCon);
  }

  /** Locator for bcPlayerFeatureBanner_4d061201c3Html5Api */
  get bcPlayerFeatureBanner_4d061201c3Html5Api(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.bcPlayerFeatureBanner_4d061201c3Html5Api);
  }

  /** Locator for ul_30 */
  get ul_30(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_30);
  }

  /** Locator for ul_Chapters */
  get ul_Chapters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_Chapters);
  }

  /** Locator for ulDescriptionsOffSelected */
  get ulDescriptionsOffSelected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ulDescriptionsOffSelected);
  }

  /** Locator for ul_33 */
  get ul_33(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ul_33);
  }

  /** Locator for ulEn_MainSelected */
  get ulEn_MainSelected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.ulEn_MainSelected);
  }

  /** Locator for Close */
  get Close(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Close);
  }

  /** Locator for Video_Player */
  get Video_Player(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_Player);
  }

  /** Locator for Volume_Level */
  get Volume_Level(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Volume_Level);
  }

  /** Locator for span_Current_Time */
  get span_Current_Time(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Current_Time);
  }

  /** Locator for span_002 */
  get span_002(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_002);
  }

  /** Locator for span_Duration */
  get span_Duration(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Duration);
  }

  /** Locator for span_412 */
  get span_412(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_412);
  }

  /** Locator for Progress_Bar */
  get Progress_Bar(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Progress_Bar);
  }

  /** Locator for span_Remaining_Time */
  get span_Remaining_Time(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Remaining_Time);
  }

  /** Locator for span_410 */
  get span_410(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_410);
  }

  /** Locator for liDescriptionsOffSelected */
  get liDescriptionsOffSelected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liDescriptionsOffSelected);
  }

  /** Locator for li_46 */
  get li_46(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_46);
  }

  /** Locator for liSubtitlesOffSelected */
  get liSubtitlesOffSelected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liSubtitlesOffSelected);
  }

  /** Locator for liEn_MainSelected */
  get liEn_MainSelected(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.liEn_MainSelected);
  }

  /** Locator for Modal_Window */
  get Modal_Window(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Modal_Window);
  }

  /** Locator for div_50 */
  get div_50(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_50);
  }

  /** Locator for Caption_Settings_Dialog */
  get Caption_Settings_Dialog(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Caption_Settings_Dialog);
  }

  /** Locator for div_52 */
  get div_52(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_52);
  }

  /** Locator for Player_Information_Dialog */
  get Player_Information_Dialog(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Player_Information_Dialog);
  }

  /** Locator for Video_Player_54 */
  get Video_Player_54(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_Player_54);
  }

  /** Locator for Video_Player_55 */
  get Video_Player_55(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Video_Player_55);
  }

  /** Locator for span_012 */
  get span_012(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_012);
  }

  /** Locator for Progress_Bar_57 */
  get Progress_Bar_57(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.Progress_Bar_57);
  }

  /** Locator for span_400 */
  get span_400(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_400);
  }

  /** Locator for picture_59 */
  get picture_59(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.picture_59);
  }

  /** Locator for li_Chapters */
  get li_Chapters(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.li_Chapters);
  }

  /** Locator for div_61 */
  get div_61(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_61);
  }

  /** Locator for div_62 */
  get div_62(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_62);
  }

  /** Locator for div_63 */
  get div_63(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_63);
  }

  /** Locator for div_64 */
  get div_64(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_64);
  }

  /** Locator for div_65 */
  get div_65(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_65);
  }

  /** Locator for div_66 */
  get div_66(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_66);
  }

  /** Locator for div_OptionalEyebrow */
  get div_OptionalEyebrow(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_OptionalEyebrow);
  }

  /** Locator for div_68 */
  get div_68(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_68);
  }

  /** Locator for div_69 */
  get div_69(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_69);
  }

  /** Locator for i_70 */
  get i_70(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.i_70);
  }

  /** Locator for span_Optional_CTA */
  get span_Optional_CTA(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_Optional_CTA);
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

  /** Locator for div_ComeGrowWithUs */
  get div_ComeGrowWithUs(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_ComeGrowWithUs);
  }

  /** Locator for svg_76 */
  get svg_76(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.svg_76);
  }

  /** Locator for p_77 */
  get p_77(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.p_77);
  }

  /** Locator for dialog_78 */
  get dialog_78(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.dialog_78);
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

  /** Locator for span_84 */
  get span_84(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_84);
  }

  /** Locator for span_85 */
  get span_85(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.span_85);
  }

  /** Locator for div_86 */
  get div_86(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_86);
  }

  /** Locator for div_87 */
  get div_87(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_87);
  }

  /** Locator for div_88 */
  get div_88(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_88);
  }

  /** Locator for div_100M */
  get div_100M(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_100M);
  }

  /** Locator for div_90 */
  get div_90(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.div_90);
  }

  // --- Actions ---

  /** Click a_Optional_CTA */
  async clickAOptionalCta() {
    const el = await this.a_Optional_CTA;
    await el.click();
  }

  /** Click a_1 */
  async clickA1() {
    const el = await this.a_1;
    await el.click();
  }

  /** Click button_Play_Video */
  async clickButtonPlayVideo() {
    const el = await this.button_Play_Video;
    await el.click();
  }

  /** Click button_Pause */
  async clickButtonPause() {
    const el = await this.button_Pause;
    await el.click();
  }

  /** Click button_SkipBackward_5Seconds */
  async clickButtonSkipbackward5seconds() {
    const el = await this.button_SkipBackward_5Seconds;
    await el.click();
  }

  /** Click button_SkipForward_5Seconds */
  async clickButtonSkipforward5seconds() {
    const el = await this.button_SkipForward_5Seconds;
    await el.click();
  }

  /** Click button_Unmute */
  async clickButtonUnmute() {
    const el = await this.button_Unmute;
    await el.click();
  }

  /** Click button_SeekToLiveCurrentlyBehind_ */
  async clickButtonSeektolivecurrentlybehind() {
    const el = await this.button_SeekToLiveCurrentlyBehind_;
    await el.click();
  }

  /** Click button_Playback_Rate */
  async clickButtonPlaybackRate() {
    const el = await this.button_Playback_Rate;
    await el.click();
  }

  /** Click button_Chapters */
  async clickButtonChapters() {
    const el = await this.button_Chapters;
    await el.click();
  }
}
