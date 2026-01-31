using Microsoft.Extensions.Localization;
using CustomerInvoiceApp.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace CustomerInvoiceApp;

[Dependency(ReplaceServices = true)]
public class CustomerInvoiceAppBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<CustomerInvoiceAppResource> _localizer;

    public CustomerInvoiceAppBrandingProvider(IStringLocalizer<CustomerInvoiceAppResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
