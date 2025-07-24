// Test setup dosyası
global.console = {
  ...console,
  // Jest testlerinde log mesajlarını bastırmak için
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Test timeout'u
jest.setTimeout(10000);
