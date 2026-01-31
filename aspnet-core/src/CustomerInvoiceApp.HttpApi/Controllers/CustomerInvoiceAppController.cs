using CustomerInvoiceApp.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace CustomerInvoiceApp.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class CustomerInvoiceAppController : AbpControllerBase
{
    protected CustomerInvoiceAppController()
    {
        LocalizationResource = typeof(CustomerInvoiceAppResource);
    }
}
