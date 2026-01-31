export const environment = {
  production: true,
  application: {
    baseUrl: 'http://localhost:4200/',
    name: 'CustomerInvoiceApp',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44369',
    redirectUri: 'http://localhost:4200',
    clientId: 'CustomerInvoiceApp_App',
    responseType: 'code',
    scope: 'offline_access CustomerInvoiceApp',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44369',
      rootNamespace: 'CustomerInvoiceApp'
    }
  },
  remoteEnv: {} // ✅ Same fix for production
};