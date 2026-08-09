import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { DomProbe } from '../../../utils/infra/dom-probe';
import ENV from '../../../utils/infra/env';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
