using Volo.Abp.Modularity;

namespace CustomerInvoiceApp;

[DependsOn(
    typeof(CustomerInvoiceAppDomainModule),
    typeof(CustomerInvoiceAppTestBaseModule)
)]
public class CustomerInvoiceAppDomainTestModule : AbpModule
{

}
