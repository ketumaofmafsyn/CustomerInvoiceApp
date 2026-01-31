using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace CustomerInvoiceApp.Data;

/* This is used if database provider does't define
 * ICustomerInvoiceAppDbSchemaMigrator implementation.
 */
public class NullCustomerInvoiceAppDbSchemaMigrator : ICustomerInvoiceAppDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
