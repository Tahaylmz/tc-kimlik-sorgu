// Test setup dosyası
process.env.NODE_ENV = 'test';

global.console = {
  ...console,
  // Jest testlerinde log mesajlarını bastırmak için
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Test timeout'u
jest.setTimeout(10000);

// Test öncesi ve sonrası cleanup
beforeAll(() => {
  // Test başında NODE_ENV'i test olarak ayarla
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Test sonunda timeout ile cleanup işlemi yap
  setTimeout(() => {
    if (process.env.NODE_ENV === 'test') {
      process.exit(0);
    }
  }, 500);
});
