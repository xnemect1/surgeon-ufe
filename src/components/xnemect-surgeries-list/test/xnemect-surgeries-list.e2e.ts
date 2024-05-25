import { newE2EPage } from '@stencil/core/testing';

describe('xnemect-surgeries-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xnemect-surgeries-list></xnemect-surgeries-list>');

    const element = await page.find('xnemect-surgeries-list');
    expect(element).toHaveClass('hydrated');
  });
});
