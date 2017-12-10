import { AppPage } from './app.po';
import { $ } from 'protractor';

describe('chained-http App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  const httpButton = $('.e2e-chained-http-calls');
  const timeoutButton = $('.e2e-chained-timeouts');
  const statusSpan = $('.e2e-current-state');

  it('should wait for chained http calls', () => {
    page.navigateTo();
    httpButton.click();
    expect(statusSpan.getText()).toBe('afterSecond');
  });

  it('should wait for chained timeouts', () => {
    page.navigateTo();
    timeoutButton.click();
    expect(statusSpan.getText()).toBe('afterSecond');
  });
});
