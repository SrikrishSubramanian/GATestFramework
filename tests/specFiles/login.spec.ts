import { Page } from 'playwright';
import { setPage, getPage } from '../../src/utils/page-utils';
import { login, navigateToLoginPage } from '../pages/loginPage';
import { test } from '../../src/setup/page-setup';
test.describe("way finding component", () => {

    test.beforeEach(async ({ page }: { page: Page }) => {
        console.time('Page Setup');
        setPage(page);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        console.timeEnd('Page Setup');
    });

    test.afterEach(async () => {
        await getPage().close();
    });

    test('login scenarios',async ()=>{
         
        await navigateToLoginPage();
        await login('tomsmith', 'SuperSecretPassword!');
    })

})