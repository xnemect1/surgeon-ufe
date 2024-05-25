import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeriesList } from '../xnemect-surgeries-list';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SurgeryEntry } from '../../../api/surgeon-wl';

describe('xnemect-surgeries-list', () => {
  const sampleEntries: SurgeryEntry[] = [
    {
      id: 'entry-1',
      patientId: 'p-1',
      surgeonId: 's-1',
      date: '2024-02-10',
      successful: true,
      operatedLimb: {
        value: 'Lava ruka',
      },
      surgeryNote: 'Surgery was successful without any complications.',
    },
    {
      id: 'entry-2',
      patientId: 'p-2',
      surgeonId: 's-1',
      date: '2024-03-15',
      successful: false,
      operatedLimb: {
        value: 'Prava noha',
      },
      surgeryNote: 'Complications occurred during the surgery.',
    },
  ];

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });

  it('renders sample entries', async () => {
    // simulate API response using sampleEntries
    mock.onGet().reply(200, sampleEntries);

    const page = await newSpecPage({
      components: [XnemectSurgeriesList],
      html: `<xnemect-surgeries-list surgeon-id="test-surgeon" api-base="http://test/api"></xnemect-surgeries-list>`,
    });

    const wlList = page.rootInstance as XnemectSurgeriesList;
    const expectedSurgeries = wlList?.surgeries?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    // use sample entries as expectation
    expect(expectedSurgeries).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedSurgeries);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [XnemectSurgeriesList], //
      html: `<xnemect-surgeries-list surgeon-id="test-surgeon" api-base="http://test/api"></xnemect-surgeries-list>`, //
    });

    const wlList = page.rootInstance as XnemectSurgeriesList; //
    const expectedSurgeries = wlList?.surgeries?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedSurgeries).toEqual(0);
    expect(items.length).toEqual(expectedSurgeries);
  });
});
