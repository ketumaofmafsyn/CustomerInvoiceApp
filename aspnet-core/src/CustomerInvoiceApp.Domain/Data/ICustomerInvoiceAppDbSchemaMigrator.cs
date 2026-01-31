using System.Threading.Tasks;

namespace CustomerInvoiceApp.Data;

public interface ICustomerInvoiceAppDbSchemaMigrator
{
    Task MigrateAsync();
}
