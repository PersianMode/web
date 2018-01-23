import { PmWebPage } from './app.po';

describe('pm-web App', () => {
  let page: PmWebPage;

  beforeEach(() => {
    page = new PmWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
