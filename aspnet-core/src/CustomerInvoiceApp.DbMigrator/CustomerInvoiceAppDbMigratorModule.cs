using CustomerInvoiceApp.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace CustomerInvoiceApp.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(CustomerInvoiceAppEntityFrameworkCoreModule),
    typeof(CustomerInvoiceAppApplicationContractsModule)
    )]
public class CustomerInvoiceAppDbMigratorModule : AbpModule
{
}
