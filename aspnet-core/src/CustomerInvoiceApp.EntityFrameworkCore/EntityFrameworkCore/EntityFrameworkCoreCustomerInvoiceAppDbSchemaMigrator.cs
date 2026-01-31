using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CustomerInvoiceApp.Data;
using Volo.Abp.DependencyInjection;

namespace CustomerInvoiceApp.EntityFrameworkCore;

public class EntityFrameworkCoreCustomerInvoiceAppDbSchemaMigrator
    : ICustomerInvoiceAppDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreCustomerInvoiceAppDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the CustomerInvoiceAppDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<CustomerInvoiceAppDbContext>()
            .Database
            .MigrateAsync();
    }
}
