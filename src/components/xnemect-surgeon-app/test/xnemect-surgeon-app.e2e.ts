import { newE2EPage } from '@stencil/core/testing';

describe('xnemect-surgeon-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xnemect-surgeon-app></xnemect-surgeon-app>');

    const element = await page.find('xnemect-surgeon-app');
    expect(element).toHaveClass('hydrated');
  });
});
