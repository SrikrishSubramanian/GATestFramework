/**
 * Deploy dropdown fixture content to local AEM style guide page.
 * Adds single-select and multi-select dropdown instances to the existing
 * form-options style guide page on all 4 backgrounds.
 *
 * Usage: node tests/specFiles/ga/form-options/content-fixtures/deploy-fixtures.js
 */
const http = require('http');
const querystring = require('querystring');

const AEM_HOST = 'localhost';
const AEM_PORT = 4502;
const AEM_USER = 'admin';
const AEM_PASS = 'admin';
const BASE_PATH = '/content/global-atlantic/style-guide/components/form-options/jcr:content/root/main-par';

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = querystring.stringify(data);
    const options = {
      hostname: AEM_HOST,
      port: AEM_PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': 'Basic ' + Buffer.from(`${AEM_USER}:${AEM_PASS}`).toString('base64'),
      },
    };
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ status: res.statusCode, path });
        } else {
          reject(new Error(`${res.statusCode} for ${path}: ${responseBody.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function createNode(relativePath, props) {
  const fullPath = `${BASE_PATH}/${relativePath}`;
  await post(fullPath, { 'jcr:primaryType': 'nt:unstructured', ...props });
}

async function createDropdownComponent(parentPath, name, title, optionType, options, extra = {}) {
  const compPath = `${parentPath}/${name}`;
  await createNode(compPath, {
    'jcr:title': title,
    'sling:resourceType': 'kkr-aem-base/components/form/options',
    'name': name,
    'source': 'local',
    'type': optionType,
    ...(extra.emptyOption ? { 'emptyOption': extra.emptyOption } : {}),
    ...(extra.required === true ? { 'required': 'true', 'requiredMessage': extra.requiredMessage || 'This field is required.' } : {}),
    ...(extra.hideTitle === true ? { 'hideTitle': '{Boolean}true' } : {}),
  });

  // Create items container
  await createNode(`${compPath}/items`, {});
  await createNode(`${compPath}/items/item0`, { 'sectionTitle': '\\0' });
  await createNode(`${compPath}/items/item0/options`, {});

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const props = { 'text': opt.text, 'value': opt.value };
    if (opt.selected) props['selected'] = '{Boolean}true';
    if (opt.disabled) props['disabled'] = '{Boolean}true';
    if (opt.helpMessage) props['helpMessage'] = opt.helpMessage;
    await createNode(`${compPath}/items/item0/options/item${i}`, props);
  }
}

const PLAN_OPTIONS = [
  { text: 'Option A', value: 'a' },
  { text: 'Option B', value: 'b' },
  { text: 'Option C', value: 'c' },
  { text: 'Option D (disabled)', value: 'd', disabled: true },
];

const REGION_OPTIONS = [
  { text: 'North America', value: 'na' },
  { text: 'Europe', value: 'eu' },
  { text: 'Asia Pacific', value: 'apac' },
  { text: 'Latin America', value: 'latam' },
];

const INTEREST_OPTIONS = [
  { text: 'Retirement Planning', value: 'retirement' },
  { text: 'Life Insurance', value: 'life' },
  { text: 'Annuities', value: 'annuities' },
  { text: 'Wealth Management', value: 'wealth' },
  { text: 'Tax Planning', value: 'tax' },
];

const BACKGROUNDS = [
  { key: 'white', styleId: 'background-white', label: 'Light (White)' },
  { key: 'slate', styleId: 'background-slate', label: 'Light (Slate)' },
  { key: 'granite', styleId: 'background-granite', label: 'Dark (Granite)' },
  { key: 'azul', styleId: 'background-azul', label: 'Dark (Azul)' },
];

async function main() {
  console.log('Deploying dropdown fixtures to local AEM...\n');

  let created = 0;

  // --- Single-select dropdowns on all 4 backgrounds ---
  for (const bg of BACKGROUNDS) {
    // Header
    await createNode(`text_dd_${bg.key}_hdr`, {
      'sling:resourceType': 'ga/components/content/text',
      'textIsRich': 'true',
      'text': `<h3 class="style-guide__headline">Single-Select Dropdown — ${bg.label}</h3>`,
    });

    // Section with background
    await createNode(`section_dd_${bg.key}`, {
      'sling:resourceType': 'ga/components/content/section',
      'cq:styleIds': `[${bg.styleId}]`,
    });
    await createNode(`section_dd_${bg.key}/section-par`, {});

    // Dropdown component
    await createDropdownComponent(
      `section_dd_${bg.key}/section-par`,
      `dd_${bg.key}`,
      'Select a plan',
      'drop-down',
      PLAN_OPTIONS,
      { emptyOption: 'Choose an option...' }
    );

    // Spacer
    await createNode(`spacer_dd_${bg.key}`, {
      'sling:resourceType': 'ga/components/content/spacer',
      'cq:styleIds': '[size-medium]',
    });

    created += 4; // header + section + component + spacer
    console.log(`  Created single-select dropdown on ${bg.label}`);
  }

  // --- Multi-select dropdowns on all 4 backgrounds ---
  for (const bg of BACKGROUNDS) {
    await createNode(`text_mdd_${bg.key}_hdr`, {
      'sling:resourceType': 'ga/components/content/text',
      'textIsRich': 'true',
      'text': `<h3 class="style-guide__headline">Multi-Select Dropdown — ${bg.label}</h3>`,
    });

    await createNode(`section_mdd_${bg.key}`, {
      'sling:resourceType': 'ga/components/content/section',
      'cq:styleIds': `[${bg.styleId}]`,
    });
    await createNode(`section_mdd_${bg.key}/section-par`, {});

    await createDropdownComponent(
      `section_mdd_${bg.key}/section-par`,
      `mdd_${bg.key}`,
      'Select your interests',
      'multi-drop-down',
      INTEREST_OPTIONS,
      { emptyOption: 'Select all that apply...' }
    );

    await createNode(`spacer_mdd_${bg.key}`, {
      'sling:resourceType': 'ga/components/content/spacer',
      'cq:styleIds': '[size-medium]',
    });

    created += 4;
    console.log(`  Created multi-select dropdown on ${bg.label}`);
  }

  // --- Pre-selected dropdown (single) ---
  await createNode('text_dd_preselected_hdr', {
    'sling:resourceType': 'ga/components/content/text',
    'textIsRich': 'true',
    'text': '<h3 class="style-guide__headline">Single-Select Dropdown — Pre-selected (White)</h3>',
  });
  await createNode('section_dd_preselected', {
    'sling:resourceType': 'ga/components/content/section',
    'cq:styleIds': '[background-white]',
  });
  await createNode('section_dd_preselected/section-par', {});
  await createDropdownComponent(
    'section_dd_preselected/section-par',
    'dd_preselected',
    'Select a region',
    'drop-down',
    [
      { text: 'North America', value: 'na' },
      { text: 'Europe', value: 'eu', selected: true },
      { text: 'Asia Pacific', value: 'apac' },
    ],
    { emptyOption: 'Choose a region...' }
  );
  console.log('  Created pre-selected dropdown');

  // --- Required dropdown with error state ---
  await createNode('text_dd_required_hdr', {
    'sling:resourceType': 'ga/components/content/text',
    'textIsRich': 'true',
    'text': '<h3 class="style-guide__headline">Required Dropdown — Error State (White)</h3>',
  });
  await createNode('section_dd_required', {
    'sling:resourceType': 'ga/components/content/section',
    'cq:styleIds': '[background-white]',
  });
  await createNode('section_dd_required/section-par', {});
  // Wrap in form container for error triggering
  await createNode('section_dd_required/section-par/form_dd_req', {
    'sling:resourceType': 'kkr-aem-base/components/form/container',
    'actionType': 'foundation/components/form/actions/mail',
    'id': 'form-dd-required',
  });
  await createNode('section_dd_required/section-par/form_dd_req/par', {});
  await createDropdownComponent(
    'section_dd_required/section-par/form_dd_req/par',
    'dd_required',
    'Required dropdown',
    'drop-down',
    REGION_OPTIONS,
    { emptyOption: 'Please select...', required: true, requiredMessage: 'Please select an option.' }
  );
  await createNode('section_dd_required/section-par/form_dd_req/par/btn_submit_dd', {
    'jcr:title': 'Submit',
    'sling:resourceType': 'kkr-aem-base/components/form/button',
    'type': 'submit',
  });
  console.log('  Created required dropdown with error state');

  // --- Required multi-select with error state ---
  await createNode('text_mdd_required_hdr', {
    'sling:resourceType': 'ga/components/content/text',
    'textIsRich': 'true',
    'text': '<h3 class="style-guide__headline">Required Multi-Select — Error State (Granite)</h3>',
  });
  await createNode('section_mdd_required', {
    'sling:resourceType': 'ga/components/content/section',
    'cq:styleIds': '[background-granite]',
  });
  await createNode('section_mdd_required/section-par', {});
  await createNode('section_mdd_required/section-par/form_mdd_req', {
    'sling:resourceType': 'kkr-aem-base/components/form/container',
    'actionType': 'foundation/components/form/actions/mail',
    'id': 'form-mdd-required',
  });
  await createNode('section_mdd_required/section-par/form_mdd_req/par', {});
  await createDropdownComponent(
    'section_mdd_required/section-par/form_mdd_req/par',
    'mdd_required',
    'Required multi-select',
    'multi-drop-down',
    INTEREST_OPTIONS,
    { emptyOption: 'Select at least one...', required: true, requiredMessage: 'Please select at least one option.' }
  );
  await createNode('section_mdd_required/section-par/form_mdd_req/par/btn_submit_mdd', {
    'jcr:title': 'Submit',
    'sling:resourceType': 'kkr-aem-base/components/form/button',
    'type': 'submit',
  });
  console.log('  Created required multi-select with error state');

  // --- Disabled dropdown ---
  await createNode('text_dd_disabled_hdr', {
    'sling:resourceType': 'ga/components/content/text',
    'textIsRich': 'true',
    'text': '<h3 class="style-guide__headline">Disabled Dropdown (White)</h3>',
  });
  await createNode('section_dd_disabled', {
    'sling:resourceType': 'ga/components/content/section',
    'cq:styleIds': '[background-white]',
  });
  await createNode('section_dd_disabled/section-par', {});
  await createDropdownComponent(
    'section_dd_disabled/section-par',
    'dd_disabled',
    'Disabled dropdown',
    'drop-down',
    [
      { text: 'Option A', value: 'a', disabled: true },
      { text: 'Option B', value: 'b', disabled: true },
    ],
    { emptyOption: 'Not available' }
  );
  console.log('  Created disabled dropdown');

  console.log(`\nDone! Deployed dropdown fixtures to style guide page.`);
  console.log('View at: http://localhost:4502/content/global-atlantic/style-guide/components/form-options.html?wcmmode=disabled');
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
