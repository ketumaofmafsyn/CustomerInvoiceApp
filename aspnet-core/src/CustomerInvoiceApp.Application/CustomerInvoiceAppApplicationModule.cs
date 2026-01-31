using Volo.Abp;
using Volo.Abp.Modularity;
using Volo.Abp.AutoMapper;

namespace CustomerInvoiceApp
{
    [DependsOn(typeof(AbpAutoMapperModule))]
    public class CustomerInvoiceAppApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpAutoMapperOptions>(options =>
            {
                // Scan this assembly (Application) for all profiles
                options.AddMaps<CustomerInvoiceAppApplicationModule>(validate: true);
            });
        }
    }
}
