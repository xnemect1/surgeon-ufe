import { newE2EPage } from '@stencil/core/testing';

describe('xnemect-surgeon-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xnemect-surgeon-list></xnemect-surgeon-list>');

    const element = await page.find('xnemect-surgeon-list');
    expect(element).toHaveClass('hydrated');
  });
});
