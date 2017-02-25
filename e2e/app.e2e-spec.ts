import { Scouter2Page } from './app.po';

describe('scouter2 App', () => {
  let page: Scouter2Page;

  beforeEach(() => {
    page = new Scouter2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
