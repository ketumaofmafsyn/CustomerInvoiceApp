using Volo.Abp.Modularity;

namespace CustomerInvoiceApp;

[DependsOn(
    typeof(CustomerInvoiceAppApplicationModule),
    typeof(CustomerInvoiceAppDomainTestModule)
)]
public class CustomerInvoiceAppApplicationTestModule : AbpModule
{

}
