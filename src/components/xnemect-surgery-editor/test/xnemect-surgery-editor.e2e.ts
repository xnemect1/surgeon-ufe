import { newE2EPage } from '@stencil/core/testing';

describe('xnemect-surgery-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xnemect-surgery-editor></xnemect-surgery-editor>');

    const element = await page.find('xnemect-surgery-editor');
    expect(element).toHaveClass('hydrated');
  });
});
