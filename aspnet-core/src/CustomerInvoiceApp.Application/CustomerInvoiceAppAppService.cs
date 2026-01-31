using System;
using System.Collections.Generic;
using System.Text;
using CustomerInvoiceApp.Localization;
using Volo.Abp.Application.Services;

namespace CustomerInvoiceApp;

/* Inherit your application services from this class.
 */
public abstract class CustomerInvoiceAppAppService : ApplicationService
{
    protected CustomerInvoiceAppAppService()
    {
        LocalizationResource = typeof(CustomerInvoiceAppResource);
    }
}
