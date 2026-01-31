using Volo.Abp.Modularity;

namespace CustomerInvoiceApp;

/* Inherit from this class for your domain layer tests. */
public abstract class CustomerInvoiceAppDomainTestBase<TStartupModule> : CustomerInvoiceAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
