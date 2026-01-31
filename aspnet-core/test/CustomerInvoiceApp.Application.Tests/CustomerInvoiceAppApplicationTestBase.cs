using Volo.Abp.Modularity;

namespace CustomerInvoiceApp;

public abstract class CustomerInvoiceAppApplicationTestBase<TStartupModule> : CustomerInvoiceAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
